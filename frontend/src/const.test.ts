import { describe, expect, it } from 'vitest'

import { WORKSPACE_NAV_ITEMS } from './const'

describe('workspace navigation configuration', () => {
  it('only exposes master admin navigation to master_admin role', () => {
    const masterAdminNav = WORKSPACE_NAV_ITEMS.find((item) => item.id === 'master-admin')
    expect(masterAdminNav).toBeDefined()
    expect(masterAdminNav?.roles).toEqual(['master_admin'])
  })
})
