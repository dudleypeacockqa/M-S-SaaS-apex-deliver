import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const LOCALSTORAGE_FLAG = '--localstorage-file'

const stripLocalStorageFlags = (rawOptions) => {
  const tokens = typeof rawOptions === 'string' && rawOptions.length > 0 ? rawOptions.split(' ').filter(Boolean) : []
  const sanitized = []
  let removed = false

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]
    if (token === LOCALSTORAGE_FLAG) {
      removed = true
      if (tokens[i + 1] && !tokens[i + 1].startsWith('--')) {
        i += 1
      }
      continue
    }
    if (token.startsWith(`${LOCALSTORAGE_FLAG}=`)) {
      removed = true
      continue
    }
    sanitized.push(token)
  }

  return { sanitized, removed }
}

const maybeReexecWithSanitizedNodeOptions = () => {
  if (process.env.VITEST_NODE_OPTIONS_FIXED === '1') {
    return false
  }

  const { sanitized, removed } = stripLocalStorageFlags(process.env.NODE_OPTIONS)
  if (!removed) {
    return false
  }

  const env = { ...process.env, VITEST_NODE_OPTIONS_FIXED: '1' }
  if (sanitized.length === 0) {
    delete env.NODE_OPTIONS
  } else {
    env.NODE_OPTIONS = sanitized.join(' ')
  }

  const child = spawn(process.execPath, [__filename, ...process.argv.slice(2)], {
    stdio: 'inherit',
    cwd: process.cwd(),
    env,
  })

  child.on('close', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal)
      return
    }
    process.exit(code ?? 0)
  })

  child.on('error', (error) => {
    console.error('[run-vitest] Failed to restart without NODE_OPTIONS localstorage flags:', error)
    process.exit(1)
  })

  return true
}

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

const sanitizeNodeOptions = () => {
  const { sanitized } = stripLocalStorageFlags(process.env.NODE_OPTIONS)
  if (sanitized.length === 0) {
    delete process.env.NODE_OPTIONS
  } else {
    process.env.NODE_OPTIONS = sanitized.join(' ')
  }
}

async function run() {
  if (maybeReexecWithSanitizedNodeOptions()) {
    return
  }
  const rawArgs = process.argv.slice(2)
  const passthroughArgs = []
  let workerOverride = process.env.VITEST_MAX_THREADS ?? null
  let singleWorker = false

  sanitizeNodeOptions()

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
