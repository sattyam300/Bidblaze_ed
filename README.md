# eBay Product Search Integration

This project demonstrates how to integrate with the eBay API to search and display products. It consists of a Node.js/Express backend and a React frontend.

## Project Structure

```
├── server/          # Express backend
│   ├── .env         # Environment variables (eBay credentials)
│   ├── ebayService.js # eBay API integration
│   ├── server.js    # Express server
│   └── package.json # Backend dependencies
└── client/          # React frontend
    ├── src/
    │   ├── App.jsx  # Main application component
    │   ├── components/
    │   │   └── ProductCard.jsx # Product display component
    │   └── index.css # Styling
    └── package.json # Frontend dependencies
```

## Setup Instructions

### 1. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure eBay API credentials:
   - Edit the `.env` file
   - Add your eBay Sandbox credentials:
     ```
     EBAY_SANDBOX_CLIENT_ID="your_client_id_here"
     EBAY_SANDBOX_CLIENT_SECRET="your_client_secret_here"
     ```

4. Start the server:
   ```bash
   npm start
   ```
   
   The server will run on `http://localhost:5000`

### 2. Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:5173`

## Features

### Backend (`/server`)
- **Express Server**: RESTful API server with CORS enabled
- **eBay API Integration**: 
  - OAuth2 token authentication
  - Product search functionality
  - Error handling and logging
- **API Endpoints**:
  - `GET /api/search`: Search eBay products
  - `GET /health`: Health check endpoint

### Frontend (`/client`)
- **React Application**: Modern React app built with Vite
- **Product Display**: 
  - Responsive grid layout
  - Product cards with images, titles, and prices
  - Loading and error states
- **Styling**: Clean, modern CSS with hover effects and responsive design

## API Usage

### Search Products
```bash
GET http://localhost:5000/api/search
```

**Response:**
```json
{
  "success": true,
  "items": [
    {
      "itemId": "123456789",
      "title": "Product Title",
      "price": {
        "value": "29.99",
        "currency": "USD"
      },
      "image": {
        "imageUrl": "https://example.com/image.jpg"
      }
    }
  ]
}
```

## eBay API Setup

To use this application, you'll need to:

1. Create an eBay Developer account at [developer.ebay.com](https://developer.ebay.com)
2. Create a new application in the eBay Developer Portal
3. Get your Sandbox Client ID and Client Secret
4. Add these credentials to the `server/.env` file

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **Axios**: HTTP client for API requests
- **dotenv**: Environment variable management
- **CORS**: Cross-origin resource sharing

### Frontend
- **React**: UI library
- **Vite**: Build tool and dev server
- **Axios**: HTTP client for API requests
- **CSS3**: Modern styling with Grid and Flexbox

## Development

### Running Both Services

1. Start the backend (in one terminal):
   ```bash
   cd server && npm start
   ```

2. Start the frontend (in another terminal):
   ```bash
   cd client && npm run dev
   ```

### Development Mode

For backend development with auto-restart:
```bash
cd server && npm run dev
```
(Note: Install nodemon globally if not already installed: `npm install -g nodemon`)

## Error Handling

The application includes comprehensive error handling:

- **Backend**: API errors, network issues, and invalid credentials
- **Frontend**: Loading states, error messages, and retry functionality
- **Image Fallbacks**: Placeholder images for failed product images

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
