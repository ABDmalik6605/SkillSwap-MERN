# SkillSwap Backend

RESTful API for SkillSwap - a peer-to-peer skill exchange platform.

## Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** (Mongoose ODM)
- **JWT** authentication
- **Socket.io** for real-time chat
- **Joi** validation
- **Docker** support

## Project Structure

```
backend/
├── api/
│   └── index.js          # Vercel serverless entry point
├── src/
│   ├── app.js            # Express app setup
│   ├── server.js         # HTTP server (for local dev)
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Auth, validation, error handling
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── sockets/          # Socket.io handlers
│   └── utils/            # Helper functions
├── vercel.json           # Vercel deployment config
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env` file in the `backend/` directory:
   ```env
   NODE_ENV=development
   PORT=4000
   MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/skillswap?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:4000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users` - Get all users (discover)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile (protected)

### Swap Requests
- `POST /api/requests` - Create swap request (protected)
- `GET /api/requests` - Get user's requests (protected)
- `PUT /api/requests/:id/accept` - Accept request (protected)
- `PUT /api/requests/:id/decline` - Decline request (protected)

### Bookings
- `GET /api/bookings` - Get user's bookings (protected)
- `POST /api/bookings` - Create booking (protected)
- `PUT /api/bookings/:id` - Update booking (protected)

### Chat
- `GET /api/chat/contacts` - Get chat contacts (protected)
- `GET /api/chat/messages/:userId` - Get messages with user (protected)
- `POST /api/chat/messages` - Send message (protected)

### Reviews
- `POST /api/reviews` - Create review (protected)
- `GET /api/reviews/user/:userId` - Get user reviews

## Deployment to Vercel

### 1. Create GitHub Repository

```bash
# In the backend folder
git remote add origin https://github.com/YOUR_USERNAME/skillswap-backend.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your `skillswap-backend` repository
4. Configure environment variables in Vercel dashboard:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = `your-mongodb-atlas-uri`
   - `JWT_SECRET` = `your-secret-key`
   - `JWT_EXPIRES_IN` = `7d`
   - `CORS_ORIGIN` = `http://localhost:5173,https://your-frontend.vercel.app`
5. Click "Deploy"

### 3. Important Notes

- **Socket.io limitation**: Real-time chat will NOT work on Vercel serverless functions. For production, consider:
  - Deploying to Railway, Render, or Heroku (long-running servers)
  - Using a separate WebSocket service
  - Or switching to polling for messages

- **Vercel Entry Point**: The `api/index.js` file is the serverless function entry point. It initializes the Express app and MongoDB connection for each request.

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | `http://localhost:5173,https://app.com` |

## License

MIT
