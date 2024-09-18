// Frontend (React) - src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    emotion: '',
    clothes: '',
    accessories: '',
    background: ''
  });
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/generate-image', formData);
      setGeneratedImage(response.data.imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  return (
    <div className="App">
      <h1>Pepe NFT Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="emotion"
          placeholder="Emotion"
          value={formData.emotion}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="clothes"
          placeholder="Clothes"
          value={formData.clothes}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="accessories"
          placeholder="Accessories"
          value={formData.accessories}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="background"
          placeholder="Background"
          value={formData.background}
          onChange={handleInputChange}
        />
        <button type="submit">Generate Pepe</button>
      </form>
      {generatedImage && <img src={generatedImage} alt="Generated Pepe" />}
    </div>
  );
}

export default App;

// Backend (Node.js with Express) - server.js
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

// .env file
AI_API_KEY=your_ai_api_key_here