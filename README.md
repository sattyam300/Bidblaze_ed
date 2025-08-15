# BidBlaze 2.0 - Real-Time Auction Platform

BidBlaze 2.0 is a real-time auction platform built with React, Node.js, and MongoDB. Featuring Socket.io live bidding, Razorpay secure payments, and Cloudinary image management, it delivers a fast, secure, and engaging experience for buyers, sellers, and auction houses worldwide.

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
git clone https://github.com/sattyam300/Final-year-project-BidBlaze-.git
cd Final-year-project-BidBlaze-
```

#### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

#### 4. Environment Configuration

Create a `.env` file in the `backend` directory:
```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/bidblaze

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Razorpay Configuration (Get from Razorpay Dashboard)
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
```

#### 5. Start Development Servers

**Start Backend Server:**
```bash
cd backend
npm run dev
```
Backend will run on: `http://localhost:8080`

**Start Frontend Server:**
```bash
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:3000`

#### 6. Access the Application
Open your browser and navigate to: `http://localhost:3000`

### Available Scripts

**Backend Scripts:**
```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
npm test            # Run tests
```

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
- `GET /api/payments/transactions` - Get user transactions
- `POST /api/payments/webhook` - Razorpay webhook

### Images
- `POST /api/images/upload` - Upload single image
- `POST /api/images/upload-multiple` - Upload multiple images
- `DELETE /api/images/:publicId` - Delete image

## 🌟 Why BidBlaze 2.0?

BidBlaze 2.0 revolutionizes the auction experience by combining traditional auction excitement with modern technology. The platform ensures secure, transparent, and engaging bidding experiences while providing comprehensive tools for auction management. Whether you're a seasoned collector or new to auctions, BidBlaze 2.0 offers an intuitive and secure platform for buying and selling valuable items.

Experience the future of auctions with BidBlaze 2.0 - where every bid counts and every transaction is secure! 🎉
