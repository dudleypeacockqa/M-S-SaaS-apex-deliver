#!/usr/bin/env node
/**
 * Capture Master Admin UI evidence by visiting each surface with a Clerk sign-in ticket.
 *
 * Usage:
 *   $env:CLERK_SIGN_IN_TOKEN="<token>"; node scripts/capture-master-admin-evidence.mjs
 */
import { chromium } from 'playwright'
import path from 'node:path'
import fs from 'node:fs'

const clerkTicket = process.env.CLERK_SIGN_IN_TOKEN
if (!clerkTicket) {
  console.error('CLERK_SIGN_IN_TOKEN env var is required')
  process.exit(1)
}

const baseUrl = process.env.MASTER_ADMIN_BASE_URL ?? 'https://ma-saas-platform.onrender.com'
const evidenceRoot = path.resolve('docs/testing/master-admin/2025-11-21')
const screenshotDir = path.join(evidenceRoot, 'screenshots')
fs.mkdirSync(screenshotDir, { recursive: true })

const gotoOptions = { waitUntil: 'domcontentloaded', timeout: 90000 }

const surfaces = [
  { path: '/master-admin', file: '01-dashboard.png', waitFor: 'text=Master Admin Dashboard' },
  { path: '/master-admin/activity', file: '02-activity.png', waitFor: 'text=Activity Tracker' },
  { path: '/master-admin/prospects', file: '03-pipeline.png', waitFor: 'text=Prospect Pipeline' },
  { path: '/master-admin/campaigns', file: '04-campaigns.png', waitFor: 'text=Campaign Manager' },
  { path: '/master-admin/content', file: '05-content.png', waitFor: 'text=Content Studio' },
  { path: '/master-admin/leads', file: '06-leads.png', waitFor: 'text=Lead Capture' },
  { path: '/master-admin/collateral', file: '07-collateral.png', waitFor: 'text=Sales Collateral' },
]

const apiTenantId = process.env.MASTER_ADMIN_TENANT_ID ?? 'qa-dge-tenant'
const apiEndpoints = [
  { path: '/api/master-admin/dashboard', file: 'backend-dashboard.json' },
  { path: '/api/master-admin/activities', file: 'backend-activities.json' },
  { path: '/api/master-admin/prospects', file: 'backend-prospects.json' },
  { path: '/api/master-admin/deals', file: 'backend-deals.json' },
  { path: '/api/master-admin/campaigns', file: 'backend-campaigns.json' },
  { path: '/api/master-admin/content-scripts', file: 'backend-content-scripts.json' },
  { path: '/api/master-admin/content-pieces', file: 'backend-content-pieces.json' },
  { path: '/api/master-admin/lead-captures', file: 'backend-leads.json' },
  { path: '/api/master-admin/collateral', file: 'backend-collateral.json' },
]

const logDir = path.join(evidenceRoot, 'logs')
fs.mkdirSync(logDir, { recursive: true })

const log = (...args) => console.log('[master-admin-evidence]', ...args)

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()

log('Navigating to base URL with Clerk ticket…')
await page.goto(`${baseUrl}/?__clerk_ticket=${encodeURIComponent(clerkTicket)}`, gotoOptions)
await page.waitForTimeout(2000)

for (const surface of surfaces) {
  const url = new URL(surface.path, baseUrl).href
  log(`Capturing ${url}`)
  await page.goto(url, gotoOptions)
  if (surface.waitFor) {
    await page.waitForSelector(surface.waitFor, { timeout: 15000 }).catch(() => log(`warning: selector ${surface.waitFor} not found`))
  }
  const target = path.join(screenshotDir, surface.file)
  await page.screenshot({ path: target, fullPage: true })
  log(`Saved ${target}`)
}

for (const endpoint of apiEndpoints) {
  const url = new URL(endpoint.path, baseUrl).href
  log(`Fetching ${url}`)
  try {
    const result = await page.evaluate(
      async ({ url, tenant }) => {
        const res = await fetch(url, {
          headers: {
            'X-Master-Tenant-Id': tenant,
            'Accept': 'application/json',
          },
        })
        const text = await res.text()
        const headers = Array.from(res.headers.entries())
        return { status: res.status, statusText: res.statusText, text, headers }
      },
      { url, tenant: apiTenantId },
    )
    const target = path.join(logDir, endpoint.file)
    fs.writeFileSync(target, result.text ?? '', 'utf-8')
    const metaTarget = path.join(logDir, endpoint.file.replace(/\.json$/, '.meta.json'))
    fs.writeFileSync(metaTarget, JSON.stringify({ url, tenant: apiTenantId, status: result.status, statusText: result.statusText, headers: result.headers }, null, 2))
    log(`Saved ${target}`)
  } catch (error) {
    log(`Error fetching ${url}:`, error.message)
  }
}

await browser.close()
log('Done capturing evidence.')

