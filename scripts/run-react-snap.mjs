import { spawnSync } from 'node:child_process'

const shouldSkip = process.env.REACT_SNAP_SKIP === 'true' || process.env.VITE_ENABLE_TEST_ROUTES === 'true'

if (shouldSkip) {
  console.log('[react-snap] Skipped (test routes or REACT_SNAP_SKIP flag).')
  process.exit(0)
}

const bin = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const result = spawnSync(bin, ['react-snap'], {
  stdio: 'inherit',
  shell: true,
})

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}
