import { describe, expect, it, vi, afterEach } from 'vitest'

import { WORKSPACE_NAV_ITEMS } from './const'

describe('workspace navigation configuration', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('only exposes master admin navigation to master_admin role', async () => {
    // We need to re-import because WORKSPACE_NAV_ITEMS is evaluated at module load time
    vi.stubEnv('VITE_ENABLE_MASTER_ADMIN', 'true')
    const { WORKSPACE_NAV_ITEMS: items } = await import('./const?update=' + Date.now())
    
    const masterAdminNav = items.find((item) => item.id === 'master-admin')
    expect(masterAdminNav).toBeDefined()
    expect(masterAdminNav?.roles).toEqual(['master_admin'])
  })
})
