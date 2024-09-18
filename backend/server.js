const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.post('/generate-image', async (req, res) => {
  try {
    const { emotion, clothes, accessories, background } = req.body;
    const prompt = `A cartoon frog Pepe looking ${emotion}, wearing ${clothes} and ${accessories}, standing in front of a ${background} background`;

    // TODO: Replace with actual AI image generation API call
    // This is a placeholder response
    const imageUrl = 'https://placeholder.com/generated-pepe-image.jpg';

    res.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});