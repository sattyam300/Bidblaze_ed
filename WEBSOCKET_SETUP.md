# WebSocket Setup Documentation for BidBlaze

## Overview

This document explains how to set up and run the real-time WebSocket functionality using Socket.IO in the BidBlaze auction platform.

## Backend Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Environment variables configured

### Installation

1. **Install Socket.IO dependency:**
   ```bash
   cd backend
   npm install socket.io
   ```

2. **Environment Variables:**
   Ensure your `.env` file contains:
   ```env
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:3000
   PORT=8080
   ```

### Running the Server

1. **Development mode:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Production mode:**
   ```bash
   cd backend
   npm start
   ```

The server will start on port 8080 with Socket.IO enabled.

## Frontend Setup

### Prerequisites

- Node.js (v14 or higher)
- React development environment

### Installation

1. **Install Socket.IO client:**
   ```bash
   cd frontend
   npm install socket.io-client
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## WebSocket Events

### Client to Server Events

| Event | Description | Payload |
|-------|-------------|---------|
| `joinAuction` | Join an auction room | `auctionId: string` |
| `leaveAuction` | Leave an auction room | `auctionId: string` |
| `newBid` | Place a new bid | `{ auctionId, bidAmount, bidderId, bidderName }` |
| `productUpdate` | Update product details | `{ auctionId, updates }` |
| `imageUpdate` | Update auction images | `{ auctionId, images }` |
| `auctionEnd` | End an auction | `{ auctionId, winnerId, finalBid }` |

### Server to Client Events

| Event | Description | Payload |
|-------|-------------|---------|
| `bidUpdate` | New bid placed | `{ auctionId, newBid, bidderId, bidderName, timestamp, totalBids }` |
| `productUpdate` | Product details updated | `{ auctionId, updates, timestamp }` |
| `imageUpdate` | Images updated | `{ auctionId, images, timestamp }` |
| `auctionEnd` | Auction ended | `{ auctionId, winnerId, finalBid, timestamp }` |

## Authentication

The WebSocket connection requires JWT authentication:

1. **Client sends token in handshake:**
   ```javascript
   const socket = io('http://localhost:8080', {
     auth: {
       token: localStorage.getItem('token')
     }
   });
   ```

2. **Server validates token:**
   ```javascript
   io.use((socket, next) => {
     const token = socket.handshake.auth.token;
     if (!token) {
       return next(new Error('Authentication error'));
     }
     
     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       socket.userId = decoded.userId;
       socket.userRole = decoded.role;
       next();
     } catch (error) {
       return next(new Error('Authentication error'));
     }
   });
   ```

## Room Management

Each auction has its own room for targeted updates:

- **Room naming convention:** `auction_${auctionId}`
- **Join room:** `socket.join('auction_123')`
- **Leave room:** `socket.leave('auction_123')`
- **Emit to room:** `io.to('auction_123').emit('event', data)`

## Real-time Features

### 1. Live Bidding
- Real-time bid updates
- Current highest bid display
- Bid count updates
- Toast notifications for new bids

### 2. Product Updates
- Seller can update auction details
- Changes broadcast to all viewers
- Real-time UI updates

### 3. Image Management
- New images added by seller
- Real-time image gallery updates
- Cloudinary integration

### 4. Auction End
- Automatic auction termination
- Winner notification
- Status updates

## Testing

### Manual Testing

1. **Open two browser windows/tabs**
2. **Navigate to the same auction page**
3. **Place a bid in one window**
4. **Verify the other window updates automatically**

### Test Commands

```bash
# Test WebSocket connection
curl -X GET http://localhost:8080/api/health

# Test auction creation
curl -X POST http://localhost:8080/api/auctions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Auction",
    "description": "Test description",
    "starting_price": 1000,
    "bid_increment": 100,
    "start_time": "2024-01-01T00:00:00Z",
    "end_time": "2024-01-02T00:00:00Z",
    "category": "watches",
    "condition": "new"
  }'
```

## Production Deployment

### Environment Variables

```env
NODE_ENV=production
PORT=8080
JWT_SECRET=your-production-secret
FRONTEND_URL=https://yourdomain.com
MONGODB_URI=your-mongodb-connection-string
```

### PM2 Configuration

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'bidblaze-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    }
  }]
};
```

### Nginx Configuration

```nginx
upstream bidblaze_backend {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://bidblaze_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Common Issues

1. **Connection refused:**
   - Check if server is running on correct port
   - Verify firewall settings
   - Check CORS configuration

2. **Authentication errors:**
   - Verify JWT token is valid
   - Check token expiration
   - Ensure token is sent in handshake

3. **Events not received:**
   - Check if client joined correct room
   - Verify event names match
   - Check browser console for errors

4. **Memory leaks:**
   - Ensure proper cleanup in useEffect
   - Remove event listeners on unmount
   - Monitor socket connections

### Debug Mode

Enable debug logging:

```javascript
// Backend
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  },
  debug: true
});

// Frontend
const socket = io('http://localhost:8080', {
  auth: {
    token: localStorage.getItem('token')
  },
  debug: true
});
```

## Security Considerations

1. **Authentication:** All WebSocket connections require valid JWT tokens
2. **Authorization:** Users can only join auction rooms they have access to
3. **Rate Limiting:** Implement rate limiting for WebSocket events
4. **Input Validation:** Validate all incoming WebSocket data
5. **CORS:** Configure CORS properly for production

## Performance Optimization

1. **Room Management:** Only join necessary auction rooms
2. **Event Filtering:** Filter events on client side
3. **Connection Pooling:** Use connection pooling for database
4. **Caching:** Cache frequently accessed auction data
5. **Load Balancing:** Use multiple server instances with sticky sessions
