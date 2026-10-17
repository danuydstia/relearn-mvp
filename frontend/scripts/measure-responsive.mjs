import { chromium } from 'playwright'

/**
 * Geometry check for the responsive dashboard (Batch 3).
 *
 *   node scripts/measure-responsive.mjs <baseUrl>
 *
 * Prints the measured box of every structural element at the three design
 * widths next to the value taken from the Figma frames:
 *   390  → design 2:6326   960 → design 2:6871   1440 → design 2:7899
 *
 * Only widths, x-offsets and fixed heights are compared — text-driven heights
 * differ because the design uses Montserrat and the app does not.
 */
const BASE = process.argv[2] || 'http://localhost:4173'

const USER = { id: 1, name: 'Alex Lee', email: 'alex@example.com', role: 'student' }
const MATERIAL = { id: 1, original_name: 'a.pdf', mime_type: 'application/pdf', size: 1, status: 'processing' }

const EXPECTATIONS = {
  'mobile-390': {
    sidebarRail: null,
    topBar: { x: 0, y: 0, w: 390, h: 80 },
    mobileNav: { x: 0, y: 80, w: 390, h: 76 },
    firstSection: { x: 24, w: 342 },
    sectionGap: 32,
  },
  'tablet-960': {
    sidebarRail: { x: 0, w: 88 },
    topBar: { x: 88, h: 80 },
    mobileNav: null,
    firstSection: { x: 120, w: 808 },
    sectionGap: 32,
    performance: { x: 120, w: 392 },
    rightRail: { x: 536, w: 392 },
    accountUsage: { x: 120, y: 1995, w: 808, h: 147 },
    sidebarNavItem: { x: 18, w: 52, h: 44 },
    // The design's mark is a 20x24 portrait lockup; relearn-logo.svg is a square
    // 2000x2000 canvas, so at h-6 it renders 24 wide. Position and height match.
    sidebarBrandMark: { x: 18, y: 32, w: 24, h: 24 },
  },
  'desktop-1440': {
    sidebarRail: { x: 0, w: 232 },
    topBar: { x: 232, h: 80 },
    mobileNav: null,
    firstSection: { x: 272, w: 1128 },
    leftColumn: { x: 272, w: 760 },
    rightRail: { x: 1060, w: 340 },
    accountUsage: null,
    note: null,
    sidebarNavItem: { x: 20, w: 192, h: 44 },
  },
}

const VIEWPORTS = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-960', width: 960, height: 1200 },
  { name: 'desktop-1440', width: 1440, height: 900 },
]

function measure() {
  const box = (el) => {
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
  }
  const visible = (el) => !!el && el.getBoundingClientRect().width > 0
  const byText = (text, selector = 'p, h2, span, button') =>
    [...document.querySelectorAll(selector)].find(
      (e) => e.children.length === 0 && e.textContent.trim() === text && visible(e),
    )

  const navs = [...document.querySelectorAll('nav')]
  const aside = document.querySelector('aside')
  // The rail is the bordered column the sticky <aside> fills; it is 88/232 wide
  // in the design *including* its 1px border, so measure the rail, not the aside.
  const rail = aside?.parentElement
  const sections = [...document.querySelectorAll('main section')]
  const accountUsageCard = byText('Usage details will appear here.')?.closest(
    'div[class*="rounded-[12px]"]',
  )
  const noteText = [...document.querySelectorAll('main p')].find((e) =>
    e.textContent.trim().startsWith('Example student data'),
  )

  return {
    sidebarRail: box(rail),
    topBar: box(document.querySelector('header')),
    mobileNav: box(navs.find((n) => !n.closest('aside'))),
    firstSection: box(sections[0]),
    invitation: box(sections[0]),
    continueLearning: box(sections[1]),
    recentLearning: box(sections[2]),
    performance: box(sections[3]),
    leftColumn: box(sections[1]?.parentElement),
    rightRail: box(sections[4]?.parentElement),
    accountUsage: box(accountUsageCard),
    note: box(noteText),
    sidebarNavItem: box(aside?.querySelector('a')),
    sidebarBrandMark: box([...(aside?.querySelectorAll('img') ?? [])].find(visible)),
    sectionGaps: sections.slice(1).map((s, i) => {
      const prev = sections[i].getBoundingClientRect()
      return Math.round(s.getBoundingClientRect().top - prev.bottom)
    }),
  }
}

const browser = await chromium.launch()

for (const viewport of VIEWPORTS) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
  await page.addInitScript(() => window.localStorage.setItem('token', 'verify-token'))
  await page.route('**/api/v1/auth/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(USER) }),
  )
  await page.route('**/api/v1/materials', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [MATERIAL] }) }),
  )
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)

  const actual = await page.evaluate(measure)
  const expected = EXPECTATIONS[viewport.name]

  console.log(`\n=== ${viewport.name} (${viewport.width}px) ===`)
  for (const [key, want] of Object.entries(expected)) {
    let got = actual[key]
    // A display:none element still exists with a 0x0 box — treat it as absent.
    if (got && got.w === 0 && got.h === 0) got = null

    if (want === null) {
      console.log(`  ${key.padEnd(20)} expected absent → ${got ? `PRESENT ${JSON.stringify(got)}` : 'absent ok'}`)
      continue
    }
    const parts = Object.entries(want).map(([dim, v]) => {
      const g = got ? got[dim] : undefined
      // y and h are driven by text metrics (the design is Montserrat, the app
      // isn't), so allow a little slack there. x and w are compared exactly.
      const slack = dim === 'y' || dim === 'h' ? 15 : 0
      const ok = g !== undefined && Math.abs(g - v) <= slack
      return `${dim}=${g} (${ok ? 'ok' : `MISMATCH want ${v}`})`
    })
    console.log(`  ${key.padEnd(20)} ${parts.join('  ')}`)
  }
  console.log(`  section gaps         ${JSON.stringify(actual.sectionGaps)}`)
  await page.close()
}

await browser.close()
