import { chromium } from 'playwright'

/**
 * Responsive verification for the dashboard (Batch 3).
 *
 *   node scripts/verify-responsive.mjs <baseUrl> <outDir>
 *
 * Screenshots the dashboard at the three design widths — 390 (mobile),
 * 960 (tablet) and 1440 (desktop) — with and without materials, and also
 * captures the mobile "More" sheet. The auth + materials API is mocked so the
 * page renders without a live backend.
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

const VIEWPORTS = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-960', width: 960, height: 1200 },
  { name: 'desktop-1440', width: 1440, height: 900 },
]

async function newPage(browser, viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
  await page.addInitScript(() => window.localStorage.setItem('token', 'verify-token'))
  await page.route('**/api/v1/auth/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(USER) }),
  )
  return page
}

async function goto(page, path) {
  for (let attempt = 0; ; attempt++) {
    try {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
      break
    } catch (err) {
      if (attempt >= 20) throw err
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }
  await page.waitForTimeout(400)
}

const browser = await chromium.launch()

for (const viewport of VIEWPORTS) {
  for (const [suffix, materials] of [
    ['', [EXAMPLE_MATERIAL]],
    ['-empty', []],
  ]) {
    const page = await newPage(browser, viewport)
    await page.route('**/api/v1/materials', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: materials }),
      }),
    )
    await goto(page, '/dashboard')
    const name = `responsive-dashboard-${viewport.name}${suffix}`
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })
    console.log(`wrote ${OUT}/${name}.png`)
    await page.close()
  }
}

// Mobile "More" sheet — there is no design for it, so capture it for review.
{
  const page = await newPage(browser, VIEWPORTS[0])
  await page.route('**/api/v1/materials', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) }),
  )
  await goto(page, '/dashboard')
  await page.getByRole('button', { name: 'More' }).click()
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${OUT}/responsive-more-sheet.png` })
  console.log(`wrote ${OUT}/responsive-more-sheet.png`)
  await page.close()
}

await browser.close()
