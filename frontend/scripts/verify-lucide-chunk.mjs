#!/usr/bin/env node

import { promises as fs } from 'node:fs'
import path from 'node:path'

const distDir = path.resolve(process.cwd(), 'dist')
const htmlPath = path.join(distDir, 'index.html')

const fail = (message) => {
  console.error(`Lucide bundle verification failed: ${message}`)
  process.exit(1)
}

const ensureFileExists = async (filePath) => {
  try {
    await fs.access(filePath)
  } catch {
    fail(`Required file missing: ${filePath}`)
  }
}

const collectLucideChunks = async (dir, chunks) => {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await collectLucideChunks(entryPath, chunks)
    } else if (entry.name.includes('lucide-vendor')) {
      chunks.push(path.relative(distDir, entryPath))
    }
  }
}

const run = async () => {
  await ensureFileExists(htmlPath)

  const assetsDir = path.join(distDir, 'assets')
  await ensureFileExists(assetsDir)

  const lucideChunks = []
  await collectLucideChunks(assetsDir, lucideChunks)

  // Verify NO lucide-vendor chunks exist (they should be bundled normally)
  if (lucideChunks.length > 0) {
    fail(`Found problematic lucide-vendor chunks: ${lucideChunks.join(', ')}. Lucide should NOT be in a separate chunk!`)
  }

  console.log(`✅ Lucide bundle verification passed: no lucide-vendor chunks detected`)
}

run()
