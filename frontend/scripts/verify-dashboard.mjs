import { chromium } from 'playwright'

/**
 * Renders the dashboard at the design width and screenshots it so the
 * implementation can be compared against the Figma render.
 *
 *   node scripts/verify-dashboard.mjs <baseUrl> <outDir>
 *
 * Mocks the auth + materials API so the page renders without a live backend.
 */
const BASE = process.argv[2] || 'http://localhost:4173'
const OUT = process.argv[3] || '.'

const USER = { id: 1, name: 'Alex Lee', email: 'alex@example.com', role: 'student' }
const EXAMPLE_MATERIAL = {
  id: 1,
  original_name: 'Statistics — Week 03.pdf',
  mime_type: 'application/pdf',
  size: 1024,
  status: 'processing',
}

async function shoot(browser, { name, materials }) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })

  await page.addInitScript(() => window.localStorage.setItem('token', 'verify-token'))

  await page.route('**/api/v1/auth/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(USER) }),
  )
  await page.route('**/api/v1/materials', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: materials }),
    }),
  )

  // The preview server may still be starting up — retry the first navigation.
  for (let attempt = 0; ; attempt++) {
    try {
      await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' })
      break
    } catch (err) {
      if (attempt >= 20) throw err
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })
  await page.close()
  console.log(`wrote ${OUT}/${name}.png`)
}

const browser = await chromium.launch()
await shoot(browser, { name: 'build-dashboard', materials: [EXAMPLE_MATERIAL] })
await shoot(browser, { name: 'build-dashboard-empty', materials: [] })
await browser.close()
