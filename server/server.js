const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { getEbayAccessToken, searchEbayItems } = require('./ebayService');

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5050;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/search', async (req, res) => {
  try {
    // Get eBay access token
    const accessToken = await getEbayAccessToken();
    
    // Search for items
    const items = await searchEbayItems(accessToken);
    
    // Send results back
    res.json({ success: true, items });
  } catch (error) {
    console.error('Error in /api/search:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Search API: http://localhost:${PORT}/api/search`);
});
