import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

describe('Render redirects configuration', () => {
  const redirectsPath = resolve(__dirname, '../../public/_redirects')
  const redirectsContent = readFileSync(redirectsPath, 'utf-8')

  const assertRedirect = (from: string, to: string, status = '301') => {
    const expectedLine = `${from} ${to} ${status}`
    expect(redirectsContent).toContain(expectedLine)
  }

  it('contains legacy legal page redirects', () => {
    assertRedirect('/privacy', '/legal/privacy')
    assertRedirect('/terms', '/legal/terms')
    assertRedirect('/cookies', '/legal/cookies')
  })

  it('redirects legacy IntelliFlow paths to the FinanceFlo platform section', () => {
    assertRedirect('/ipaas', '/ipaas/intelliflow')
    assertRedirect('/ipaas/*', '/ipaas/intelliflow')
  })
})
