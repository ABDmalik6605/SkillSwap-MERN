#!/bin/bash

# SkillSwap Backend Deployment Script for Vercel

echo "🚀 Deploying SkillSwap Backend to Vercel..."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if logged in
echo "📝 Checking Vercel authentication..."
vercel whoami 2>/dev/null || {
    echo "🔐 Please login to Vercel..."
    vercel login
}

echo ""
echo "📦 Deploying to production..."
vercel --prod --yes

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔍 Next steps:"
echo "1. Check Vercel dashboard for deployment status"
echo "2. Verify environment variables are set"
echo "3. Test your API at: https://skill-swap-backend-5m4g.vercel.app/health"
echo ""

