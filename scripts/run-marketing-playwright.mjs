import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'

const run = (command, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, {
      stdio: 'inherit',
      shell: true,
      ...options,
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(`${command} exited with code ${code}`))
    })
  })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const frontendDir = path.join(projectRoot, 'frontend')
const env = { ...process.env }

if (!env.MARKETING_BASE_URL) {
  env.MARKETING_BASE_URL = 'http://127.0.0.1:4173'
}

const configPath = path.join(projectRoot, 'playwright.dev.config.ts')

try {
  await run(`${npmCmd} run build`, { cwd: frontendDir, env })
  await run(`${npxCmd} playwright test --config "${configPath}"`, {
    cwd: projectRoot,
    env,
  })
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
