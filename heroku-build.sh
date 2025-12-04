#!/bin/bash
set -e

echo "-----> Building monorepo for Heroku"

# Install pnpm
echo "-----> Installing pnpm"
npm install -g pnpm

# Install all dependencies at root
echo "-----> Installing dependencies"
pnpm install --frozen-lockfile

# Build all workspace packages that example depends on
echo "-----> Building workspace dependencies"
pnpm --filter @asset-route-sdk/core run build || echo "Core package has no build script"
pnpm --filter @asset-route-sdk/solana-hot-address-only run build || echo "Solana package has no build script"
pnpm --filter @asset-route-sdk/zcash-core run build || echo "Zcash package has no build script"

echo "-----> Build complete"
