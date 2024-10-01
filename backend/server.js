const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();
const axios = require('axios');
const pinataSDK = require('@pinata/sdk');
const { Readable } = require('stream');

const app = express();

app.use(cors({
  origin: ['https://gianfrancomorini.github.io', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 3001;


// Handle preflight requests
app.options('*', cors());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Healthy');
});

app.get('/', (req, res) => {
  res.send('Pepe NFT Generator API is running!');
});


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pinata = new pinataSDK({ 
  pinataApiKey: process.env.PINATA_API_KEY, 
  pinataSecretApiKey: process.env.PINATA_API_SECRET 
});


// Test endpoint
app.post('/test', (req, res) => {
  console.log('Test endpoint reached');
  console.log('Request body:', req.body);
  res.json({ 
    message: 'Test endpoint working',
    receivedData: req.body
  });
});

app.post('/generate-image', async (req, res) => {
  console.log('Received generate-image request');
  try {
    const { emotion, clothes, accessories, background } = req.body;
    console.log('Request body:', req.body);

    const prompt = `A cartoon frog with ${emotion} expression, wearing ${clothes} and ${accessories}, in a ${background} setting.`;
    console.log('Generated prompt:', prompt);

    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    console.log('OpenAI response:', response);

    const imageUrl = response.data[0].url;
    console.log('Generated image URL:', imageUrl);
    
    // Download the image
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(imageResponse.data);

    // Create a readable stream from the buffer
    const stream = Readable.from(buffer);

    // Upload the generated image to IPFS using Pinata
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
    if (error.response) {
      console.error('API error:', error.response.data);
    }
    res.status(500).json({ error: 'Failed to generate image or upload to IPFS', details: error.message });
  }
});

app.post('/upload-metadata', async (req, res) => {
  try {
    const metadata = req.body;
    const result = await pinata.pinJSONToIPFS(metadata);
    const metadataUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
    res.json({ metadataUrl });
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    res.status(500).json({ error: 'Failed to upload metadata to IPFS', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});