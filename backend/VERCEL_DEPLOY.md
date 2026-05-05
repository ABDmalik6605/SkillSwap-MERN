# Vercel Deployment Steps

## Files Changed for Vercel

1. ✅ `vercel.json` - Routes all requests to `api/index.js`
2. ✅ `api/index.js` - Serverless handler that connects to MongoDB and passes requests to Express

## Deploy to Vercel

### Step 1: Push Changes to Git

```bash
cd backend
git add .
git commit -m "Add Vercel serverless configuration"
git push
```

### Step 2: Redeploy on Vercel

Either:
- **Automatic:** Vercel will auto-deploy if connected to GitHub
- **Manual:** Run `vercel --prod` in the backend folder

### Step 3: Set Environment Variables in Vercel Dashboard

Go to your project → Settings → Environment Variables:

```
MONGO_URI=mongodb+srv://sameeransari3297_db_user:FbSV9jh2dBV6YiDL@skillswap.selauqo.mongodb.net/skillswap?retryWrites=true&w=majority
JWT_SECRET=<generate-random-string>
CORS_ORIGIN=https://your-frontend.vercel.app,http://localhost:5173
NODE_ENV=production
```

**Generate JWT_SECRET:**
```bash
openssl rand -base64 32
```

### Step 4: Test Your Deployment

```bash
# Test health endpoint
curl https://skill-swap-backend-alpha.vercel.app/health

# Should return: {"uptime": 123.45}

# Test root
curl https://skill-swap-backend-alpha.vercel.app/

# Should return: {"status":"ok","message":"SkillSwap API"}
```

### Step 5: Update Frontend

Your frontend `.env` has been updated to:
```
VITE_API_URL="https://skill-swap-backend-alpha.vercel.app"
```

Restart your frontend dev server:
```bash
cd frontend
npm run dev
```

## Important Notes

### Socket.io Won't Work on Vercel
Vercel serverless functions don't support WebSockets. Real-time chat features will be disabled. 

**To fix this:**
- Deploy to Railway.app or Render.com instead (both support WebSockets)
- Or deploy Socket.io separately and keep REST API on Vercel

### MongoDB Connection
- The handler connects to MongoDB on each cold start
- Connections are reused within the same serverless instance
- First request might be slower (cold start)

### CORS Configuration
- Backend now supports multiple origins (comma-separated)
- Make sure to update `CORS_ORIGIN` when you deploy frontend

## Troubleshooting

**Still getting 404?**
1. Check Vercel build logs for errors
2. Verify `api/index.js` exists in deployment
3. Make sure environment variables are set
4. Try redeploying: `vercel --prod --force`

**MongoDB connection errors?**
1. Check Atlas Network Access allows 0.0.0.0/0
2. Verify MONGO_URI is correct in Vercel env vars
3. Check Vercel function logs

**CORS errors?**
1. Add your frontend URL to `CORS_ORIGIN` env var
2. Use comma-separated list for multiple origins
3. No trailing slashes in URLs

