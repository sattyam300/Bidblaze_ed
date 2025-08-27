# eBay Product Search Integration

This project demonstrates how to integrate with the eBay API to search and display products. It consists of a Node.js/Express backend and a React frontend.

## 🛠️ Technology Stack

### Frontend Technologies
- **React 18** - Modern JavaScript library for building user interfaces
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Shadcn/ui** - Beautiful and accessible UI components
- **React Router DOM** - Client-side routing for React applications
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **Lucide React** - Beautiful & consistent icon toolkit
- **Sonner** - Toast notifications for React

### Backend Technologies
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework for Node.js
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT (JSON Web Tokens)** - Secure authentication and authorization
- **bcryptjs** - Password hashing for security
- **Multer** - File upload middleware for Express
- **Express Validator** - Input validation and sanitization
- **Helmet** - Security middleware for Express
- **CORS** - Cross-Origin Resource Sharing middleware

### Real-Time Communication
- **Socket.io** - Real-time bidirectional communication
- **WebSocket** - Protocol for real-time data exchange

### Payment Integration
- **Razorpay** - Payment gateway for Indian market
- **Webhook Support** - Real-time payment status updates
- **Signature Verification** - Secure payment validation

### Cloud Services
- **Cloudinary** - Cloud image and video management
- **Image Upload/Processing** - Automatic image optimization

### Development Tools
- **Nodemon** - Auto-restart server during development
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatter

## 🎯 Perfect For

- **Auction Houses**: Streamline operations with digital bidding
- **Collectors**: Access rare items from anywhere in the world
- **Sellers**: Reach global audience with secure payment processing
- **Businesses**: Host corporate auctions and asset sales

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - [Install MongoDB](https://docs.mongodb.com/manual/installation/)
- **Git** - [Download here](https://git-scm.com/)

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/sattyam300/Bidblaze_ed.git
cd Bidblaze_ed
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
<<<<<<< HEAD
cd server && npm run dev
=======
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/bidblaze

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Razorpay Configuration (Optional - can be added later)
RAZORPAY_KEY_ID=rzp_test_your_test_key_id
RAZORPAY_KEY_SECRET=your_test_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Cloudinary Configuration (Get from Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
>>>>>>> 7565be956b51b25f3088f0f5d9ab8e6d127d76cd
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

<<<<<<< HEAD
This project is open source and available under the MIT License.
=======
**Frontend Scripts:**
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

## 🔌 Integrations & APIs

### Razorpay Payment Gateway
- **Secure Payment Processing** - Industry-standard encryption
- **Multiple Payment Methods** - UPI, Cards, Net Banking, Wallets
- **Webhook Support** - Real-time payment status updates
- **Signature Verification** - HMAC SHA256 for security
- **Test Mode** - Safe testing with test credentials

### Socket.io Real-Time Communication
- **Live Bidding** - Real-time bid updates across all users
- **Auction Status** - Instant notification of auction changes
- **User Presence** - Track active bidders in real-time
- **Bidirectional Communication** - Server-client real-time updates

### Cloudinary Image Management
- **Automatic Image Optimization** - Resize and compress images
- **Multiple Image Support** - Gallery for auction items
- **Secure Upload** - Protected file upload system
- **CDN Delivery** - Fast global image delivery

### MongoDB Database
- **Flexible Schema** - NoSQL for auction data
- **Scalable Architecture** - Handle large auction volumes
- **Real-time Queries** - Fast data retrieval
- **Data Integrity** - ACID compliance for transactions

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Auctions
- `GET /api/auctions` - Get all auctions
- `GET /api/auctions/:id` - Get single auction
- `POST /api/auctions` - Create auction (sellers)
- `PUT /api/auctions/:id` - Update auction
- `DELETE /api/auctions/:id` - Delete auction

### Bidding
- `POST /api/bids` - Place a bid
- `GET /api/bids/auction/:auctionId` - Get auction bids
- `GET /api/bids/my-bids` - Get user's bids
- `GET /api/bids/winning` - Get winning bids

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/webhook` - Razorpay webhook

## 🚀 Deployment

### Vercel Deployment (Recommended)

For the easiest deployment experience, we recommend using Vercel. Check out our comprehensive deployment guide:

📖 **[Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)**

### Quick Deployment Steps:

1. **Deploy Backend to Vercel:**
   ```bash
   cd backend
   vercel
   ```

2. **Deploy Frontend to Vercel:**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard

4. **Connect to MongoDB Atlas** for cloud database

### Alternative Deployment Options

- **Heroku** - Platform as a Service
- **Railway** - Modern deployment platform
- **DigitalOcean App Platform** - Managed containers
- **AWS** - Cloud infrastructure

### Images
- `POST /api/images/upload` - Upload auction images
- `DELETE /api/images/:id` - Delete image
- `GET /api/images/auction/:auctionId` - Get auction images
- `POST /api/images/upload` - Upload single image
- `POST /api/images/upload-multiple` - Upload multiple images
- `DELETE /api/images/:publicId` - Delete image

## 🌟 Why BidBlaze 2.0?

BidBlaze 2.0 revolutionizes the auction experience by combining traditional auction excitement with modern technology. The platform ensures secure, transparent, and engaging bidding experiences while providing comprehensive tools for auction management. Whether you're a seasoned collector or new to auctions, BidBlaze 2.0 offers an intuitive and secure platform for buying and selling valuable items.

Experience the future of auctions with BidBlaze 2.0 - where every bid counts and every transaction is secure! 🎉
>>>>>>> 7565be956b51b25f3088f0f5d9ab8e6d127d76cd
