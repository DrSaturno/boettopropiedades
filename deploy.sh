#!/bin/bash
# Deploy script for SiteGround (Node.js hosting)
# Run this on the server after uploading the project

set -e

echo "=== Boetto Propiedades - Deploy ==="

# Install dependencies
echo "Installing dependencies..."
npm ci --omit=dev

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push database schema (creates tables if they don't exist)
echo "Pushing database schema..."
npx prisma db push --accept-data-loss

# Seed database (only if empty)
echo "Seeding database..."
npx prisma db seed || echo "Seed skipped or already done"

# Build the app
echo "Building application..."
npm run build

# Copy standalone output
echo "Setting up standalone server..."
cp -r .next/standalone/. ./standalone/
cp -r .next/static ./standalone/.next/static
cp -r public ./standalone/public

echo ""
echo "=== Deploy complete ==="
echo "Start with: cd standalone && PORT=3000 node server.js"
echo "Or with PM2: pm2 start ecosystem.config.js"
