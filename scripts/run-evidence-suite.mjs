#!/usr/bin/env node
/**
 * Wave 0 Evidence Suite Orchestrator
 *
 * Orchestrates evidence capture scripts (Master Admin CRUD, BlogAdmin proof,
 * Lighthouse/Axe audits) and emits a normalized `suite-report.json`.
 *
 * Usage:
 *   node scripts/run-evidence-suite.mjs --dry-run --tasks master-admin,blogadmin --output ./docs/evidence/2025-11-22
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

const DEFAULT_TASKS = ['master-admin', 'blogadmin', 'lighthouse']

const TASK_CONFIG = {
  'master-admin': {
    description: 'Executes scripts/exercise-master-admin-crud.mjs via Playwright',
    prereqs: ['CLERK_SIGN_IN_TOKEN'],
    script: path.join(projectRoot, 'scripts', 'exercise-master-admin-crud.mjs'),
  },
  blogadmin: {
    description: 'Captures BlogAdmin proof via Playwright',
    prereqs: ['PLAYWRIGHT_ENABLE_TEST_ROUTES', 'VITE_ENABLE_TEST_ROUTES'],
    script: path.join(projectRoot, 'scripts', 'capture-blogadmin-proof.mjs'),
  },
  lighthouse: {
    description: 'Runs Lighthouse + Axe audits',
    prereqs: [],
    script: path.join(projectRoot, 'scripts', 'run-lighthouse-axe.mjs'),
  },
}

function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    dryRun: false,
    tasks: [...DEFAULT_TASKS],
    date: new Date().toISOString().split('T')[0],
    output: null,
  }

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i]
    if (arg === '--dry-run') {
      options.dryRun = true
      continue
    }
    if (arg === '--date') {
      options.date = args[i + 1]
      i += 1
      continue
    }
    if (arg === '--tasks') {
      const raw = (args[i + 1] ?? '').trim()
      options.tasks = raw
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
      i += 1
      continue
    }
    if (arg === '--output') {
      options.output = args[i + 1]
      i += 1
      continue
    }
  }

  if (!options.output) {
    options.output = path.join(projectRoot, 'docs', 'evidence', options.date)
  }

  return options
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

function relativeToProject(filePath) {
  return path.relative(projectRoot, filePath)
}

async function run() {
  const options = parseArgs()
  ensureDir(options.output)

  const summary = {
    generatedAt: new Date().toISOString(),
    date: options.date,
    dryRun: options.dryRun,
    tasks: [],
  }

  for (const taskName of options.tasks) {
    const config = TASK_CONFIG[taskName]
    if (!config) {
      summary.tasks.push({
        name: taskName,
        status: 'skipped',
        reason: 'Unknown task requested',
      })
      continue
    }

    const taskLogPath = path.join(options.output, `${taskName}.log`)
    ensureDir(path.dirname(taskLogPath))

    const missingPrereqs = config.prereqs.filter((key) => !process.env[key])
    let status = 'pending'
    let reason = ''

    if (options.dryRun) {
      status = 'skipped'
      const missing = missingPrereqs.length ? ` Missing env: ${missingPrereqs.join(', ')}.` : ''
      reason = `Dry run requested.${missing}`
    } else if (missingPrereqs.length) {
      status = 'skipped'
      reason = `Missing required environment variables: ${missingPrereqs.join(', ')}`
    } else {
      status = 'skipped'
      reason = 'Task execution not yet implemented'
    }

    summary.tasks.push({
      name: taskName,
      status,
      reason,
      log: relativeToProject(taskLogPath),
      description: config.description,
      prereqs: config.prereqs,
    })

    if (!fs.existsSync(taskLogPath)) {
      fs.writeFileSync(taskLogPath, '')
    }
  }

  const suiteReportPath = path.join(options.output, 'suite-report.json')
  fs.writeFileSync(suiteReportPath, JSON.stringify(summary, null, 2))

  console.log(`Evidence suite report written to ${relativeToProject(suiteReportPath)}`)
}

run().catch((error) => {
  console.error('[evidence-suite] Fatal error:', error)
  process.exitCode = 1
})

