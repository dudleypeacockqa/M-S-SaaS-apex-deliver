#!/bin/bash

echo "Checking local build bundle hash..."
cd frontend

if [ ! -d "dist" ]; then
  echo "❌ dist/ directory not found. Run 'npm run build' first."
  exit 1
fi

BUNDLE_FILE=$(find dist/assets/js -name "react-vendor-*.js" | head -1)
if [ -z "$BUNDLE_FILE" ]; then
  echo "❌ react-vendor bundle not found in dist/"
  exit 1
fi

BUNDLE_NAME=$(basename "$BUNDLE_FILE")
HASH=$(echo "$BUNDLE_NAME" | sed 's/react-vendor-\(.*\)\.js/\1/')

echo "✅ Local bundle hash: $HASH"
echo "📦 Bundle file: $BUNDLE_NAME"
echo ""
echo "After deployment, verify production serves: react-vendor-$HASH.js"

