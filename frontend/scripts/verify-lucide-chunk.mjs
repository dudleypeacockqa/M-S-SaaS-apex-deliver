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

const run = async () => {
  await ensureFileExists(htmlPath)
  const html = await fs.readFile(htmlPath, 'utf8')
  if (html.includes('lucide-vendor')) {
    fail('dist/index.html still references a lucide-vendor chunk')
  }

  const assetsDir = path.join(distDir, 'assets')
  await ensureFileExists(assetsDir)

  const lucideChunks = []
  const walk = async (dir) => {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(entryPath)
      } else if (entry.name.includes('lucide-vendor')) {
        lucideChunks.push(path.relative(distDir, entryPath))
      }
    }
  }
  await walk(assetsDir)

  if (lucideChunks.length > 0) {
    fail(`Found lucide-vendor chunk(s): ${lucideChunks.join(', ')}`)
  }

  console.log('✅ Lucide bundle verification passed: no lucide-specific chunks detected')
}

run()
