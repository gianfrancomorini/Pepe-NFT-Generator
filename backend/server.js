const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const axios = require('axios');
const { create } = require('ipfs-http-client');
const ipfsClient = require('ipfs-http-client');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IPFS configuration (using Infura)
const projectId = process.env.INFURA_PROJECT_ID;
const projectSecret = process.env.INFURA_PROJECT_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfsClient = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

app.post('/generate-image', async (req, res) => {
  try {
    const { emotion, clothes, accessories, background } = req.body;
    const prompt = `A cartoon frog Pepe looking ${emotion}, wearing ${clothes} and ${accessories}, standing in front of a ${background} background`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const imageUrl = response.data[0].url;
    
    // Upload the generated image to IPFS
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(imageResponse.data, 'binary');
    const result = await ipfsClient.add(buffer);
    const ipfsUrl = `https://ipfs.io/ipfs/${result.path}`;

    res.json({ imageUrl: ipfsUrl });
  } catch (error) {
    console.error('Error generating image or uploading to IPFS:', error);
    res.status(500).json({ error: 'Failed to generate image or upload to IPFS' });
  }
});

app.post('/upload-metadata', async (req, res) => {
  try {
    const metadata = req.body;
    const result = await ipfsClient.add(JSON.stringify(metadata));
    const metadataUrl = `https://ipfs.io/ipfs/${result.path}`;
    res.json({ metadataUrl });
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    res.status(500).json({ error: 'Failed to upload metadata to IPFS' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});