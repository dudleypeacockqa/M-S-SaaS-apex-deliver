#!/usr/bin/env node
/**
 * Verify Lucide React Bundling Strategy
 *
 * Ensures lucide-react icons are bundled in the main chunk, not split into separate files.
 * Separate lucide chunks cause async loading race conditions and blank screens.
 *
 * Exit codes:
 * - 0: Success (no lucide-specific chunks found)
 * - 1: Failure (lucide chunks detected or verification error)
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distPath = join(__dirname, '..', 'dist', 'assets', 'js');
const htmlPath = join(__dirname, '..', 'dist', 'index.html');

async function verifyLucideBundling() {
  try {
    // Check for lucide-specific JavaScript chunks
    const files = await readdir(distPath);
    const lucideChunks = files.filter(f =>
      f.toLowerCase().includes('lucide') &&
      f.endsWith('.js') &&
      !f.includes('index') // Ignore main index bundle
    );

    if (lucideChunks.length > 0) {
      console.error('❌ VERIFICATION FAILED: Found lucide-specific chunks!');
      console.error('');
      console.error('The following files violate the bundling strategy:');
      lucideChunks.forEach(file => console.error(`  - ${file}`));
      console.error('');
      console.error('This will cause production blank screens due to async icon loading.');
      console.error('See frontend/CRITICAL-VITE-CONFIG.md for details.');
      return false;
    }

    // Check index.html doesn't reference lucide-vendor chunks
    const html = await readFile(htmlPath, 'utf8');
    if (html.includes('lucide-vendor') || html.includes('lucide_vendor')) {
      console.error('❌ VERIFICATION FAILED: index.html references lucide-vendor chunk!');
      console.error('');
      console.error('The HTML file is loading lucide-react as a separate chunk.');
      console.error('This causes race conditions and blank screens in production.');
      return false;
    }

    console.log('✅ Lucide bundle verification passed!');
    console.log('');
    console.log('Verified:');
    console.log('  - No lucide-specific chunks in dist/assets/js/');
    console.log('  - index.html does not reference lucide-vendor chunks');
    console.log('  - Icons will load synchronously with main bundle');
    return true;

  } catch (error) {
    console.error('❌ VERIFICATION ERROR:', error.message);
    console.error('');
    console.error('Could not verify lucide bundling strategy.');
    console.error('Ensure the build completed successfully before running this script.');
    return false;
  }
}

// Run verification
const success = await verifyLucideBundling();
process.exit(success ? 0 : 1);
