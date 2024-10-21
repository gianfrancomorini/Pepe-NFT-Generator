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

// Trust proxy
app.set('trust proxy', 1);

// Enhanced security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP as it might interfere with your React app
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter); // Apply rate limiting only to API routes

// Update CORS configuration
app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 8080;

// Initialize OpenAI and Pinata clients
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
app.use(express.static(path.join(__dirname, 'build')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).send('Healthy');
});

// Generate image endpoint
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
    
    // Download and upload to IPFS
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

// Upload metadata endpoint
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

// Catch-all handler for any request that doesn't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});