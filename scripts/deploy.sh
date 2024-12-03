#!/bin/bash

echo "🚀 Starting production deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build the project
echo "🏗️ Building project..."
npm run build

# Start the production server
echo "🌟 Starting production server..."
npm start
