#!/bin/bash
# Run Lighthouse audits on production marketing pages
# Requires: npm install -g lighthouse

OUTPUT_DIR="docs/marketing/lighthouse-reports-2025-11-12"
mkdir -p "$OUTPUT_DIR"

echo "=========================================="
echo "Lighthouse Audits - Production Marketing"
echo "=========================================="
echo ""

PAGES=(
  "https://100daysandbeyond.com"
  "https://100daysandbeyond.com/pricing"
  "https://100daysandbeyond.com/about"
  "https://100daysandbeyond.com/contact"
  "https://100daysandbeyond.com/blog"
  "https://100daysandbeyond.com/features"
)

for PAGE in "${PAGES[@]}"; do
  PAGE_NAME=$(echo "$PAGE" | sed 's|https://100daysandbeyond.com||' | sed 's|/|-|g' | sed 's|^-||')
  if [ -z "$PAGE_NAME" ]; then
    PAGE_NAME="home"
  fi

  echo "[*] Running Lighthouse audit for: $PAGE"
  echo "    Output: $OUTPUT_DIR/lighthouse-${PAGE_NAME}.json"

  lighthouse "$PAGE" \
    --output=json \
    --output=html \
    --output-path="$OUTPUT_DIR/lighthouse-${PAGE_NAME}" \
    --chrome-flags="--headless" \
    --quiet

  echo "[OK] Completed: $PAGE"
  echo ""
done

echo "=========================================="
echo "Lighthouse Audits Complete"
echo "=========================================="
echo ""
echo "Reports saved to: $OUTPUT_DIR/"
echo ""
echo "Summary:"
for PAGE in "${PAGES[@]}"; do
  PAGE_NAME=$(echo "$PAGE" | sed 's|https://100daysandbeyond.com||' | sed 's|/|-|g' | sed 's|^-||')
  if [ -z "$PAGE_NAME" ]; then
    PAGE_NAME="home"
  fi

  if [ -f "$OUTPUT_DIR/lighthouse-${PAGE_NAME}.json" ]; then
    PERFORMANCE=$(jq '.categories.performance.score * 100' "$OUTPUT_DIR/lighthouse-${PAGE_NAME}.json")
    ACCESSIBILITY=$(jq '.categories.accessibility.score * 100' "$OUTPUT_DIR/lighthouse-${PAGE_NAME}.json")
    BEST_PRACTICES=$(jq '.categories["best-practices"].score * 100' "$OUTPUT_DIR/lighthouse-${PAGE_NAME}.json")
    SEO=$(jq '.categories.seo.score * 100' "$OUTPUT_DIR/lighthouse-${PAGE_NAME}.json")

    echo "  $PAGE:"
    echo "    Performance: ${PERFORMANCE}%"
    echo "    Accessibility: ${ACCESSIBILITY}%"
    echo "    Best Practices: ${BEST_PRACTICES}%"
    echo "    SEO: ${SEO}%"
  fi
done
