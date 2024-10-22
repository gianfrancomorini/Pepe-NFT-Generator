const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();
const axios = require('axios');
const pinataSDK = require('@pinata/sdk');
const { Readable } = require('stream');
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');
const path = require('path');

const app = express();

// Trust proxy - important for Elastic Beanstalk
app.set('trust proxy', 1);

// Enhanced security headers with adjustments for Elastic Beanstalk
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https:", "http:"],
      fontSrc: ["'self'", "data:", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
}));

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for health checks
  skip: (req) => req.path === '/api/health'
});

// Apply rate limiting only to API routes
app.use('/api/', limiter);

// CORS configuration - adjusted for Elastic Beanstalk
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://www.pepenftgenerator.xyz', 'https://pepenftgenerator.xyz']
    : true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Increased payload limit for image processing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize API clients
let openai;
let pinata;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  pinata = new pinataSDK({ 
    pinataApiKey: process.env.PINATA_API_KEY, 
    pinataSecretApiKey: process.env.PINATA_API_SECRET 
  });
} catch (error) {
  console.error('Error initializing API clients:', error);
}

// Serve static files from the React app build directory
// Important: This should come AFTER security middleware but BEFORE API routes
app.use(express.static(path.join(__dirname, 'build')));

// Health check endpoint - useful for Elastic Beanstalk
app.get('/api/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK'
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

// Catch-all handler for React router - must come AFTER API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method
  });
  
  res.status(500).json({ 
    error: 'Internal Server Error', 
    details: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});