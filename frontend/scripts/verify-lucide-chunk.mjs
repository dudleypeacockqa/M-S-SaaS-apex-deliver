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
    fail('dist/index.html still references a lucide-vendor chunk - this causes blank screens!')
  }

  const assetsDir = path.join(distDir, 'assets')
  await ensureFileExists(assetsDir)

  let lucideChunks = []
  try {
    const files = await fs.readdir(assetsDir, { withFileTypes: true })
    for (const entry of files) {
      if (entry.isDirectory()) {
        if (entry.name === 'js' || entry.name === 'assets') {
          const nested = await fs.readdir(path.join(assetsDir, entry.name))
          lucideChunks = lucideChunks.concat(
            nested.filter((name) => name.includes('lucide-vendor')),
          )
        }
      } else if (entry.name.includes('lucide-vendor')) {
        lucideChunks.push(entry.name)
      }
    }
  } catch (error) {
    fail(`Unable to inspect assets directory: ${error.message}`)
  }

  if (lucideChunks.length > 0) {
    fail(`Found lucide-specific chunks that will cause blank screens: ${lucideChunks.join(', ')}`)
  }

  console.log('✅ Lucide bundle verification passed: no lucide-vendor chunks detected (icons bundled with main)')
}

run()
