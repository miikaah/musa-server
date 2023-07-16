#!/bin/bash
echo "Building musa-server backend..."
rm -rf dist
npm run build:backend

echo ""
echo "Building musa frontend..."
cd $FRONTEND_DIR
node scripts/buildDistributable.mjs server

echo "Copying frontend to distributable..."
cd $BACKEND_DIR
cp -rf "${FRONTEND_DIR}/build-server" dist/public
