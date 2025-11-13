import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
async function run() {
  const passthroughArgs = process.argv.slice(2)
  const vitestEntrypoint = path.join(projectRoot, 'node_modules', 'vitest', 'vitest.mjs')

  const nodeArgs = [
    '--conditions=module-sync',
    vitestEntrypoint,
    ...passthroughArgs,
  ]

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
