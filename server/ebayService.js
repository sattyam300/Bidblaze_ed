const axios = require('axios');
require('dotenv').config();

/**
 * Get eBay OAuth2 access token
 * @returns {Promise<string>} The access token
 */
async function getEbayAccessToken() {
  try {
    // For testing purposes, use hardcoded credentials
    // In production, these should come from environment variables
    const clientId = process.env.EBAY_SANDBOX_CLIENT_ID || 'BidBlaze-PRD-123456789-12345678';
    const clientSecret = process.env.EBAY_SANDBOX_CLIENT_SECRET || 'PRD-123456789-12345-12345678';
    
    console.log('Using eBay credentials:', { usingEnvVars: !!process.env.EBAY_SANDBOX_CLIENT_ID });

    // Base64 encode the credentials
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await axios.post('https://api.sandbox.ebay.com/identity/v1/oauth2/token', 
      'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`
        }
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting eBay access token:', error.message);
    throw new Error('Failed to get eBay access token');
  }
}

/**
 * Search eBay items
 * @param {string} accessToken - The OAuth2 access token
 * @returns {Promise<Array>} Array of item summaries
 */
async function searchEbayItems(accessToken) {
  try {
    const response = await axios.get('https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search', {
      params: {
        q: 'test',
        limit: 12
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.itemSummaries || [];
  } catch (error) {
    console.error('Error searching eBay items:', error.message);
    throw new Error('Failed to search eBay items');
  }
}

module.exports = {
  getEbayAccessToken,
  searchEbayItems
};
