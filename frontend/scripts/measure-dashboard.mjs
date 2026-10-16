import { chromium } from 'playwright'

/**
 * Objective 1:1 check: measures the built dashboard and prints it next to the
 * geometry taken from the Figma file, so drift is detected numerically rather
 * than by eye.
 *
 *   node scripts/measure-dashboard.mjs <baseUrl>
 */
const BASE = process.argv[2] || 'http://localhost:4173'

// Expected values, read from the Figma nodes (all heights in px).
const EXPECTED = {
  'invitation height': 115,
  'Continue Learning section': { featured: 330, compact: 177, heading: 44 },
  'Recent Learning section': { card: 198 },
  'Learning Performance section': {},
  'Your Community section': {},
  'Small steps, real progress section': {},
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await page.addInitScript(() => window.localStorage.setItem('token', 'verify-token'))
await page.route('**/api/v1/auth/me', (route) =>
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ id: 1, name: 'Alex Lee', email: 'a@b.c', role: 'student' }),
  }),
)
await page.route('**/api/v1/materials', (route) =>
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ data: [{ id: 1, original_name: 'x.pdf', status: 'processing' }] }),
  }),
)

for (let attempt = 0; ; attempt++) {
  try {
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' })
    break
  } catch (err) {
    if (attempt >= 20) throw err
    await new Promise((r) => setTimeout(r, 500))
  }
}
await page.waitForTimeout(300)

const report = await page.evaluate(() => {
  const round = (n) => Math.round(n)
  const box = (el) => {
    const r = el.getBoundingClientRect()
    return { x: round(r.x), y: round(r.y), w: round(r.width), h: round(r.height) }
  }

  const out = { sections: {}, type: {}, columns: {} }

  // Left / right column widths (left column owns the "Continue Learning" section)
  const firstSection = document.querySelector('main h2')?.closest('section')
  const leftCol = firstSection?.parentElement
  if (leftCol) {
    out.columns.left = box(leftCol)
    const rightCol = leftCol.nextElementSibling
    if (rightCol) out.columns.right = box(rightCol)
  }

  // Invitation
  const headline = [...document.querySelectorAll('main p')].find(
    (p) => p.textContent.trim() === 'What will you learn today?',
  )
  if (headline) {
    const cs = getComputedStyle(headline)
    out.type.headline = { fontSize: cs.fontSize, lineHeight: cs.lineHeight }
    out.sections['Learning invitation'] = box(headline.closest('section'))
  }

  // Every h2 section + its direct children
  for (const h2 of document.querySelectorAll('main h2')) {
    const sec = h2.closest('section')
    if (!sec) continue
    const cs = getComputedStyle(h2)
    out.type[`h2 ${h2.textContent.trim()}`] = { fontSize: cs.fontSize, lineHeight: cs.lineHeight }
    out.sections[h2.textContent.trim()] = {
      height: box(sec).h,
      children: [...sec.children].map((el) => ({
        h: box(el).h,
        label: el.querySelector('h2') ? 'heading' : el.textContent.trim().slice(0, 26),
      })),
    }
  }

  return out
})

console.log(JSON.stringify(report, null, 2))
console.log('\n--- Figma reference ---')
console.log(JSON.stringify(EXPECTED, null, 2))

await browser.close()
