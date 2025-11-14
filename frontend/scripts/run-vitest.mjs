import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const normalizeWorkerCount = (value) => {
  if (!value) {
    return null
  }
  const parsed = Number.parseInt(value, 10)
  if (Number.isFinite(parsed) && parsed > 0) {
    return String(parsed)
  }
  return null
}

async function run() {
  const rawArgs = process.argv.slice(2)
  const passthroughArgs = []
  let workerOverride = process.env.VITEST_MAX_THREADS ?? null
  let singleWorker = false

  for (let i = 0; i < rawArgs.length; i += 1) {
    const arg = rawArgs[i]
    if (arg === '--single-worker' || arg === '--run-in-band') {
      singleWorker = true
      continue
    }
    if (arg === '--workers' || arg === '--max-workers') {
      workerOverride = rawArgs[i + 1] ?? null
      i += 1
      continue
    }
    if (arg.startsWith('--workers=')) {
      workerOverride = arg.split('=')[1]
      continue
    }
    if (arg.startsWith('--max-workers=')) {
      workerOverride = arg.split('=')[1]
      continue
    }
    passthroughArgs.push(arg)
  }

  if (singleWorker) {
    workerOverride = '1'
  }

  const normalizedWorkers = normalizeWorkerCount(workerOverride)
  const vitestEntrypoint = path.join(projectRoot, 'node_modules', 'vitest', 'vitest.mjs')

  if (!process.env.VITEST_POOL) {
    process.env.VITEST_POOL = 'vmThreads'
  }
  if (normalizedWorkers) {
    process.env.VITEST_MAX_THREADS = normalizedWorkers
  } else if (!process.env.VITEST_MAX_THREADS) {
    process.env.VITEST_MAX_THREADS = '4'
  }

  const nodeArgs = ['--conditions=module-sync', vitestEntrypoint, ...passthroughArgs]

  const child = spawn(process.execPath, nodeArgs, {
    stdio: 'inherit',
    cwd: projectRoot,
    env: {
      ...process.env,
      VITEST_POOL_TIMEOUT: process.env.VITEST_POOL_TIMEOUT ?? '120000',
    },
  })

  child.on('close', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal)
      return
    }
    process.exit(code ?? 0)
  })
}

run().catch((error) => {
  console.error('[run-vitest] Failed to execute Vitest runner:', error)
  process.exit(1)
})
