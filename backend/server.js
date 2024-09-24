const express = require('express');
const cors = require('cors');
const { OpenAIApi } = require('openai');
require('dotenv').config();
const axios = require('axios');
const ipfsHttpClient = require('ipfs-http-client');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});

// IPFS configuration (using Infura)
const projectId = process.env.INFURA_PROJECT_ID;
const projectSecret = process.env.INFURA_PROJECT_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfsClient = ipfsHttpClient.create({
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
    console.log('Received request:', { emotion, clothes, accessories, background });

    const prompt = `A cartoon frog with friendly facial features looking joyful, wearing a professional suit and carrying a briefcase, standing in an office setting.`;
    console.log('Generated prompt:', prompt);

    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    console.log('OpenAI response:', response);

    const imageUrl = response.data.data[0].url;
    console.log('Generated image URL:', imageUrl);
    
    // Upload the generated image to IPFS
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(imageResponse.data, 'binary');
    const result = await ipfsClient.add(buffer);
    const ipfsUrl = `https://ipfs.io/ipfs/${result.path}`;
    console.log('IPFS URL:', ipfsUrl);

    res.json({ imageUrl: ipfsUrl });
  } catch (error) {
    console.error('Error in /generate-image:', error);
    if (error.response) {
      console.error('OpenAI API error:', error.response.data);
    }
    res.status(500).json({ error: 'Failed to generate image or upload to IPFS', details: error.message });
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