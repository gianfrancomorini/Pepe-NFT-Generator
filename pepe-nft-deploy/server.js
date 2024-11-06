const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const axios = require('axios');
const pinataSDK = require('@pinata/sdk');
const { Readable } = require('stream');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();

// Trust proxy - required for EB ALB
app.set('trust proxy', true);

// Helmet configuration adjusted for image generation
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http:", "https://*.pinata.cloud", "https://gateway.pinata.cloud"],
      connectSrc: ["'self'", "https:", "wss:", "https://*.pinata.cloud", "https://gateway.pinata.cloud"],
      fontSrc: ["'self'", "data:", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: false,
}));

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/api/health',
  trusted: true
});

// API rate limiting
app.use('/api/', limiter);

// Updated CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://www.pepenftgenerator.xyz', 'https://pepenftgenerator.xyz']
    : true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Additional security headers middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 
    process.env.NODE_ENV === 'production' 
      ? 'https://www.pepenftgenerator.xyz' 
      : '*'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  next();
});

// Rest of your existing code remains the same...
// Body parser config
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize API clients with error handling
let openai;
let pinata;

function initializeAPIClients() {
  try {
    if (process.env.OPENAI_API_KEY) {
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      console.warn('OPENAI_API_KEY not found in environment variables');
    }

    if (process.env.PINATA_API_KEY && process.env.PINATA_API_SECRET) {
      pinata = new pinataSDK({ 
        pinataApiKey: process.env.PINATA_API_KEY, 
        pinataSecretApiKey: process.env.PINATA_API_SECRET 
      });
    } else {
      console.warn('Pinata credentials not found in environment variables');
    }
  } catch (error) {
    console.error('Error initializing API clients:', error);
  }
}

initializeAPIClients();

// Serve static files - must come before API routes
app.use(express.static(path.join(__dirname, 'build')));

// Enhanced health check for EB
app.get('/api/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK',
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
    serviceStatus: {
      openai: !!openai,
      pinata: !!pinata
    }
  };
  res.status(200).json(health);
});


// Your existing API endpoints remain the same
app.post('/api/generate-image', async (req, res) => {
  console.log('Received generate-image request:', req.body);
  
  try {
    const { emotion, clothes, accessories, background } = req.body;
    
    if (!emotion || !clothes || !accessories || !background) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!openai || !pinata) {
      throw new Error('API clients not properly initialized');
    }

    const prompt = `A cartoon frog with ${emotion} expression, wearing ${clothes} and ${accessories}, in a ${background} setting.`;
    console.log('Generated prompt:', prompt);

    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    console.log('Generated image URL:', imageUrl);
    
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(imageResponse.data);
    const stream = Readable.from(buffer);

    const result = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: {
        name: `Pepe-NFT-${Date.now()}.png`
      }
    });
    
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
    console.log('IPFS URL:', ipfsUrl);
    
    res.json({ imageUrl: ipfsUrl });
  } catch (error) {
    console.error('Error in /generate-image:', error);
    res.status(500).json({ 
      error: 'Failed to generate image or upload to IPFS', 
      details: error.message 
    });
  }
});

app.post('/api/upload-metadata', async (req, res) => {
  try {
    if (!pinata) {
      throw new Error('Pinata client not properly initialized');
    }

    const metadata = req.body;
    const result = await pinata.pinJSONToIPFS(metadata);
    const metadataUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
    res.json({ metadataUrl });
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    res.status(500).json({ 
      error: 'Failed to upload metadata to IPFS', 
      details: error.message 
    });
  }
});

// Catch-all handler for React router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Enhanced error handling
app.use((err, req, res, next) => {
  const errorResponse = {
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message,
    status: err.status || 500,
    timestamp: new Date().toISOString()
  };

  // Log error details
  console.error('Error details:', {
    ...errorResponse,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  res.status(errorResponse.status).json(errorResponse);
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Server started at: ${new Date().toISOString()}`);
});