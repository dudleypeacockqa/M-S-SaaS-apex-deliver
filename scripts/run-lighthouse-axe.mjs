import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const run = (command, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, { stdio: 'inherit', shell: true, ...options })
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
const docsDir = path.join(projectRoot, 'docs', 'testing', 'lighthouse')
const dateStamp = new Date().toISOString().split('T')[0]
const outputDir = process.env.AUDIT_OUTPUT_DIR ?? path.join(docsDir, dateStamp)
fs.mkdirSync(outputDir, { recursive: true })

const targetUrl = process.env.LIGHTHOUSE_AUDIT_URL ?? 'http://127.0.0.1:4173/'
const label = process.env.LIGHTHOUSE_AUDIT_LABEL ?? 'local-preview'
const htmlReportPath = path.join(outputDir, `lighthouse-${label}.html`)
const jsonReportPath = path.join(outputDir, `lighthouse-${label}.json`)
const axeReportPath = path.join(outputDir, `axe-${label}.json`)

const env = { ...process.env }

const writeMetadata = () => {
  const metadataPath = path.join(outputDir, 'metadata.json')
  const payload = {
    targetUrl,
    label,
    generatedAt: new Date().toISOString(),
    htmlReport: path.relative(projectRoot, htmlReportPath),
    jsonReport: path.relative(projectRoot, jsonReportPath),
    axeReport: path.relative(projectRoot, axeReportPath),
  }
  fs.writeFileSync(metadataPath, JSON.stringify(payload, null, 2))
}

try {
  await run(
    `${npxCmd} lighthouse ${targetUrl} --output html --output-path "${htmlReportPath}"`,
    { cwd: projectRoot, env }
  )
  await run(
    `${npxCmd} lighthouse ${targetUrl} --output json --output-path "${jsonReportPath}"`,
    { cwd: projectRoot, env }
  )
  await run(
    `${npxCmd} axe ${targetUrl} --load-delay 5000 --timeout 60000 --save "${axeReportPath}"`,
    { cwd: projectRoot, env }
  )
  writeMetadata()
  console.log(`Reports written to ${path.relative(projectRoot, outputDir)}`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
