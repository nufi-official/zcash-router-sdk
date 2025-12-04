#!/bin/bash
set -e

echo "-----> Building monorepo for Heroku"

# Check pnpm version (already installed by Heroku)
echo "-----> Using pnpm version:"
pnpm --version

# Install all dependencies at root (without frozen lockfile to allow updates)
echo "-----> Installing dependencies"
pnpm install --no-frozen-lockfile

# Build all workspace packages that example-app depends on
echo "-----> Building workspace dependencies"
pnpm --filter @zcash-router-sdk/core run build || echo "Core package has no build script"
pnpm --filter @zcash-router-sdk/solana-account-mnemonic run build || echo "Solana package has no build script"
pnpm --filter @zcash-router-sdk/zcash-account-mnemonic run build || echo "Zcash package has no build script"

echo "-----> Build complete"
