import { chromium } from 'playwright'

/**
 * Verification for Batch 5 (admin console shell + Overview).
 *
 *   node scripts/verify-admin.mjs <baseUrl> <outDir>
 *
 * Screenshots the console at 1440 (the design canvas) and at 1280 (the desktop
 * floor), then asserts the structural geometry against the Figma frame
 * "Admin / Ringkasan" (10:62423):
 *   sidebar 232 · top bar 80 · content gutters 32 · inner width 1144
 *   5 × KPI card 216×128 with 16px gaps
 *   analytics row 360 / 456 / 296, all 270 tall
 *   operational row 700 / 428, both 224 tall
 *
 * Also checks the access rules: a student never sees the console, and viewports
 * under 1280 get the "needs a wider screen" notice instead of a collapsed shell.
 */
const BASE = process.argv[2] || 'http://localhost:5173'
const OUT = process.argv[3] || 'C:/Users/steve/AppData/Local/Temp/opencode'

const ADMIN = { id: 7, name: 'Dwi Pratama', email: 'admin@relearn.test', role: 'admin', plan: 'pro' }
const STUDENT = { id: 1, name: 'Alex Lee', email: 'alex@example.com', role: 'student', plan: 'free' }

const OVERVIEW = {
  generated_at: '2026-10-18T09:00:00+07:00',
  users: { total: 1248, free: 1008, pro: 240, new_this_month: 144, growth_percent: 13.0 },
  user_growth: [
    { month: '2026-05', label: 'May', total: 872 },
    { month: '2026-06', label: 'Jun', total: 921 },
    { month: '2026-07', label: 'Jul', total: 977 },
    { month: '2026-08', label: 'Aug', total: 1054 },
    { month: '2026-09', label: 'Sep', total: 1104 },
    { month: '2026-10', label: 'Oct', total: 1248 },
  ],
  materials: { total: 312, processing: 3, failed: 5 },
}

function measure() {
  const box = (el) => {
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
  }
  const visible = (el) => !!el && el.getBoundingClientRect().width > 0
  const byText = (text, selector = 'p, h1, h2, span, a, button') =>
    [...document.querySelectorAll(selector)].find(
      (e) => e.children.length === 0 && e.textContent.trim() === text && visible(e),
    )

  const main = document.querySelector('main')
  const kpis = [...document.querySelectorAll('main div[class*="h-[128px]"]')]
  const charts = [...document.querySelectorAll('main section[class*="h-[270px]"]')]
  const ops = [...document.querySelectorAll('main section[class*="h-[224px]"]')]
  const gaps = kpis.slice(1).map((el, i) => Math.round(el.getBoundingClientRect().x - kpis[i].getBoundingClientRect().right))

  return {
    sidebar: box(document.querySelector('aside')),
    topbar: box(document.querySelector('header')),
    content: box(document.querySelector('main > div')),
    title: box(document.querySelector('main h1')),
    titleFont: document.querySelector('main h1') ? getComputedStyle(document.querySelector('main h1')).fontSize : null,
    exportButton: box(
      [...document.querySelectorAll('main button')].find(
        (b) => b.textContent.trim() === 'Export summary',
      ),
    ),
    kpiCount: kpis.length,
    kpi1: box(kpis[0]),
    kpi5: box(kpis[4]),
    kpiGaps: gaps,
    growthCard: box(charts[0]),
    revenueCard: box(charts[1]),
    aiCard: box(charts[2]),
    transactionsCard: box(ops[0]),
    attentionCard: box(ops[1]),
    kpiTotal: byText('Total users')?.parentElement?.parentElement?.querySelectorAll('p')[1]?.textContent?.trim(),
    kpiTotalDetail: byText('Total users')?.parentElement?.parentElement?.querySelectorAll('p')[2]?.textContent?.trim(),
    transactionRows: ops[0]?.querySelectorAll('div[class*="h-8"]').length ?? 0,
    attentionItems: ops[1]?.querySelectorAll('div[class*="gap-[16px]"] > div').length ?? 0,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
  }
}

const browser = await chromium.launch()

async function open(width, height, { user = ADMIN, path = '/admin/overview' } = {}) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  await page.addInitScript(() => window.localStorage.setItem('token', 'verify-token'))
  await page.route('**/api/v1/auth/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(user) }),
  )
  await page.route('**/api/v1/admin/overview', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(OVERVIEW) }),
  )
  await page.route('**/api/v1/materials', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) }),
  )
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(250)
  return page
}

function report(label, expected, actual) {
  console.log(`\n  ── ${label} ──`)
  for (const [key, want] of Object.entries(expected)) {
    if (want === null) {
      console.log(`    ${key.padEnd(16)} expected absent → ${actual[key] ? 'PRESENT' : 'absent ok'}`)
      continue
    }
    const got = actual[key]
    const parts = Object.entries(want).map(([dim, v]) => {
      const g = got ? got[dim] : undefined
      const slack = dim === 'y' || dim === 'h' ? 20 : 0
      const ok = g !== undefined && Math.abs(g - v) <= slack
      return `${dim}=${g} (${ok ? 'ok' : `MISMATCH want ${v}`})`
    })
    console.log(`    ${key.padEnd(16)} ${parts.join('  ')}`)
  }
}

const EXPECTED_1440 = {
  sidebar: { x: 0, w: 232 },
  topbar: { x: 232, w: 1208, h: 80 },
  content: { x: 264, w: 1144 },
  exportButton: { w: 184, h: 40 },
  kpi1: { x: 264, w: 216, h: 128 },
  kpi5: { x: 1192, w: 216, h: 128 },
  growthCard: { x: 264, w: 360, h: 270 },
  revenueCard: { x: 640, w: 456, h: 270 },
  aiCard: { x: 1112, w: 296, h: 270 },
  transactionsCard: { x: 264, w: 700, h: 224 },
  attentionCard: { x: 980, w: 428, h: 224 },
}
// ── 1440: the design canvas ──────────────────────────────────────────────────
const wide = await open(1440, 1024)
await wide.screenshot({ path: `${OUT}/admin-overview-1440.png`, fullPage: true })
console.log('=== Admin Overview @ 1440×1024 (design 10:62423) ===')
const wideMetrics = await wide.evaluate(measure)
report('Geometry', EXPECTED_1440, wideMetrics)
console.log(
  `    summary          ${wideMetrics.kpiCount} KPI cards (want 5), gaps ${wideMetrics.kpiGaps.join('/')} (want 16/16/16/16)`,
)
console.log(
  `    live data        total="${wideMetrics.kpiTotal}" (want 1,248)  detail="${wideMetrics.kpiTotalDetail}" (want Free 1,008 · Pro 240)`,
)
console.log(
  `    lists            ${wideMetrics.transactionRows} transaction rows (want 4), ${wideMetrics.attentionItems} attention icons (want 3)`,
)
console.log(`    page overflow    ${wideMetrics.overflow}px (want 0)`)

// ── 1280: the desktop floor ──────────────────────────────────────────────────
const floor = await open(1280, 900)
await floor.screenshot({ path: `${OUT}/admin-overview-1280.png`, fullPage: true })
const floorMetrics = await floor.evaluate(measure)
console.log('\n=== Admin Overview @ 1280×900 (desktop floor) ===')
console.log(
  `    shell            sidebar=${floorMetrics.sidebar?.w} content=${floorMetrics.content?.w} overflow=${floorMetrics.overflow}px (want 0)`,
)
console.log(
  `    cards            kpi1=${floorMetrics.kpi1?.w} growth=${floorMetrics.growthCard?.w} attention=${floorMetrics.attentionCard?.w}`,
)
await floor.close()

// ── Below the floor: notice, no shell ────────────────────────────────────────
const narrow = await open(1279, 900)
await narrow.screenshot({ path: `${OUT}/admin-overview-1279.png`, fullPage: true })
const narrowState = await narrow.evaluate(() => ({
  notice: !!document.body.innerText.includes('needs a wider screen'),
  sidebar: (document.querySelector('aside')?.getBoundingClientRect().width ?? 0) > 0,
  overflow: document.documentElement.scrollWidth - window.innerWidth,
}))
console.log('\n=== Admin Overview @ 1279px (under the floor) ===')
console.log(
  `    notice=${narrowState.notice} (want true)  sidebar=${narrowState.sidebar} (want false)  overflow=${narrowState.overflow}px (want 0)`,
)
await narrow.close()

// ── Access rules ─────────────────────────────────────────────────────────────
const student = await open(1440, 1024, { user: STUDENT })
await student.screenshot({ path: `${OUT}/admin-forbidden-1440.png`, fullPage: true })
const studentState = await student.evaluate(() => ({
  refusal: !!document.body.innerText.includes('Admins only'),
  sidebar: !!document.querySelector('aside'),
}))
console.log('\n=== Student visiting /admin/overview ===')
console.log(`    "Admins only"=${studentState.refusal} (want true)  admin sidebar=${studentState.sidebar} (want false)`)
await student.close()

// ── Sidebar entry for admins, absent for students ────────────────────────────
const entry = await open(1440, 900, { user: ADMIN, path: '/dashboard' })
const forAdmin = await entry.evaluate(() => {
  const aside = document.querySelector('aside')
  return aside ? [...aside.querySelectorAll('a')].some((a) => a.getAttribute('href') === '/admin/overview') : false
})
await entry.close()
const entryStudent = await open(1440, 900, { user: STUDENT, path: '/dashboard' })
const forStudent = await entryStudent.evaluate(() => {
  const aside = document.querySelector('aside')
  return aside ? [...aside.querySelectorAll('a')].some((a) => a.getAttribute('href') === '/admin/overview') : false
})
await entryStudent.close()
console.log('\n=== Student sidebar entry ===')
console.log(`    admin sees Admin entry=${forAdmin} (want true)  student sees admin link=${forStudent} (want false)`)

await browser.close()
console.log(`\nScreenshots written to ${OUT}`)
