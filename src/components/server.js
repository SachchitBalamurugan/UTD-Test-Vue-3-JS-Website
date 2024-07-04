const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

// CORS Proxy endpoint
app.get('/cors-proxy', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) throw new Error('URL parameter is required');

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching via CORS proxy:', error.message);
    res.status(500).json({ error: 'Failed to fetch via CORS proxy' });
  }
});

app.listen(port, () => {
  console.log(`CORS Proxy Server running at http://localhost:${port}`);
});
