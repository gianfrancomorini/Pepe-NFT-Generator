const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();
const axios = require('axios');
const pinataSDK = require('@pinata/sdk');
const { Readable } = require('stream');

const app = express();

// Update CORS configuration
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Add a test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Healthy');
});

// Generate image endpoint
app.post('/generate-image', async (req, res) => {
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
app.post('/upload-metadata', async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});