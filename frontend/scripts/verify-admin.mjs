import { chromium } from 'playwright'

/**
 * Verification for Batch 5 (admin console shell, Overview) and Batch 5.2a
 * (Users).
 *
 *   node scripts/verify-admin.mjs <baseUrl> <outDir>
 *
 * Screenshots the console at 1440 (the design canvas) and at 1280 (the desktop
 * floor), then asserts the structural geometry against the Figma frames
 * "Admin / Ringkasan" (10:62423):
 *   sidebar 232 · top bar 80 · content gutters 32 · inner width 1144
 *   5 × KPI card 216×128 with 16px gaps
 *   analytics row 360 / 456 / 296, all 270 tall
 *   operational row 700 / 428, both 224 tall
 * and "Admin / Pengguna" (10:62689):
 *   4 × summary card 274×64 with 16px gaps
 *   filter row 40 tall: 316 search + 144 export
 *   table 44px header + ten 44px rows, columns 32/588/120/80/140/128/24
 *
 * The identity column is 588 rather than the design's 426 because the AI quota
 * column (162) is not part of this pass and its width is folded in.
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

const USERS = {
  data: [
    { id: 41, name: 'Nadia Putri', email: 'nadia.putri@gmail.com', role: 'student', plan: 'pro', status: 'active', created_at: '2026-09-12T03:00:00+07:00' },
    { id: 40, name: 'Fajar Ramadhan', email: 'fajar.ramadhan@gmail.com', role: 'student', plan: 'pro', status: 'active', created_at: '2026-09-10T03:00:00+07:00' },
    { id: 39, name: 'Bima Prakoso', email: 'bima.prakoso@gmail.com', role: 'student', plan: 'free', status: 'active', created_at: '2026-09-08T03:00:00+07:00' },
    { id: 38, name: 'Siti Aisyah', email: 'siti.aisyah@gmail.com', role: 'student', plan: 'pro', status: 'active', created_at: '2026-09-05T03:00:00+07:00' },
    { id: 37, name: 'Rizky Hidayat', email: 'rizky.hidayat@gmail.com', role: 'student', plan: 'free', status: 'suspended', created_at: '2026-08-28T03:00:00+07:00' },
    { id: 36, name: 'Dewi Lestari', email: 'dewi.lestari@gmail.com', role: 'student', plan: 'pro', status: 'active', created_at: '2026-08-21T03:00:00+07:00' },
    { id: 35, name: 'Agus Setiawan', email: 'agus.setiawan@gmail.com', role: 'student', plan: 'free', status: 'active', created_at: '2026-08-14T03:00:00+07:00' },
    { id: 34, name: 'Putri Handayani', email: 'putri.handayani@gmail.com', role: 'student', plan: 'pro', status: 'active', created_at: '2026-08-02T03:00:00+07:00' },
    { id: 33, name: 'Hendra Wijaya', email: 'hendra.wijaya@gmail.com', role: 'student', plan: 'free', status: 'suspended', created_at: '2026-07-19T03:00:00+07:00' },
    { id: 7, name: 'Dwi Pratama', email: 'dwi@relearn.id', role: 'admin', plan: 'pro', status: 'active', created_at: '2026-04-01T03:00:00+07:00' },
  ],
  meta: { total: 1248, page: 1, per_page: 10, last_page: 125, from: 1, to: 10 },
  summary: { total: 1248, active: 1190, suspended: 58, pro: 240 },
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

function measureUsers() {
  const box = (el) => {
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
  }

  const main = document.querySelector('main')
  const cards = [...main.querySelectorAll('div[class*="h-[64px]"]')]
  const grids = [...main.querySelectorAll('div[class*="grid-cols-["]')]
  const headerRow = grids[0] ?? null
  const rows = grids.slice(1)
  const search = main.querySelector('input[type="search"]')?.parentElement ?? null
  const exportButton = [...main.querySelectorAll('button')].find(
    (b) => b.textContent.trim() === 'Export CSV',
  )
  const perPage = main.querySelector('select[aria-label="Rows per page"]')

  return {
    sidebar: box(document.querySelector('aside')),
    topbar: box(document.querySelector('header')),
    content: box(main.querySelector(':scope > div')),
    title: box(main.querySelector('h1')),
    titleFont: main.querySelector('h1') ? getComputedStyle(main.querySelector('h1')).fontSize : null,
    cardCount: cards.length,
    card1: box(cards[0]),
    card4: box(cards[3]),
    cardGaps: cards
      .slice(1)
      .map((el, i) =>
        Math.round(el.getBoundingClientRect().x - cards[i].getBoundingClientRect().right),
      ),
    summaryLabels: [...main.querySelectorAll('div[class*="h-[64px]"] p')].map((p) =>
      p.textContent.trim(),
    ),
    search: box(search),
    exportButton: box(exportButton),
    headerRow: box(headerRow),
    rowCount: rows.length,
    firstRow: box(rows[0]),
    lastRow: box(rows[rows.length - 1]),
    table: box(headerRow?.parentElement ?? null),
    columns: headerRow ? getComputedStyle(headerRow).gridTemplateColumns : null,
    columnCount: headerRow ? headerRow.children.length : 0,
    columnLabels: headerRow
      ? [...headerRow.querySelectorAll('p, button')].map((el) => el.textContent.trim())
      : [],
    checkboxes: main.querySelectorAll('input[type="checkbox"]').length,
    pageLabel:
      [...main.querySelectorAll('p')]
        .map((p) => p.textContent.trim())
        .find((text) => text.includes(' of ') && text.includes('users')) ?? null,
    perPage: perPage ? perPage.value : null,
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
  await page.route('**/api/v1/admin/users*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(USERS) }),
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

// ── Landing after sign-in ────────────────────────────────────────────────────
// An admin arrives at the console; a student still arrives at the dashboard.
async function landingAfterLogin(user) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  await page.route('**/api/v1/auth/login', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user, token: 'verify-token' }),
    }),
  )
  await page.route('**/api/v1/auth/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(user) }),
  )
  await page.route('**/api/v1/admin/overview', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(OVERVIEW) }),
  )
  await page.route('**/api/v1/materials', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) }),
  )

  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', user.email)
  await page.fill('input[type="password"]', 'verify-password')
  await page.getByRole('button', { name: /log in/i }).click()
  await page.waitForTimeout(900)
  const landed = new URL(page.url()).pathname
  await page.close()
  return landed
}

console.log('\n=== Landing after sign-in ===')
console.log(`    admin    → ${await landingAfterLogin(ADMIN)} (want /admin/overview)`)
console.log(`    student  → ${await landingAfterLogin(STUDENT)} (want /dashboard)`)

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

// ── Admin Users at 1440 and 1280 (design 10:62689) ───────────────────────────
const EXPECTED_USERS_1440 = {
  sidebar: { x: 0, w: 232 },
  topbar: { x: 232, w: 1208, h: 80 },
  content: { x: 264, w: 1144 },
  card1: { x: 264, w: 274, h: 64 },
  card4: { x: 1134, w: 274, h: 64 },
  search: { x: 264, w: 316, h: 40 },
  exportButton: { x: 1264, w: 144, h: 40 },
  headerRow: { x: 264, w: 1144, h: 44 },
  firstRow: { x: 264, w: 1144, h: 44 },
  table: { x: 264, w: 1144, h: 484 },
}

const usersWide = await open(1440, 1024, { path: '/admin/users' })
await usersWide.screenshot({ path: `${OUT}/admin-users-1440.png`, fullPage: true })
console.log('\n=== Admin Users @ 1440×1024 (design 10:62689) ===')
const usersMetrics = await usersWide.evaluate(measureUsers)
report('Geometry', EXPECTED_USERS_1440, usersMetrics)
console.log(
  `    summary          ${usersMetrics.cardCount} cards (want 4), gaps ${usersMetrics.cardGaps.join('/')} (want 16/16/16)`,
)
console.log(`    summary values   ${usersMetrics.summaryLabels.join(' · ')}`)
console.log(
  `    table            header ${usersMetrics.headerRow?.h}px (want 44), ${usersMetrics.rowCount} rows (want 10) at ${usersMetrics.firstRow?.h}px (want 44)`,
)
console.log(`    columns          ${usersMetrics.columns}`)
console.log(`    column labels    ${usersMetrics.columnLabels.join(' | ')}`)
console.log(
  `    selection        ${usersMetrics.checkboxes} row checkboxes (want 10)`,
)
console.log(
  `    pagination       "${usersMetrics.pageLabel}"  per-page=${usersMetrics.perPage} (want 10)`,
)
console.log(`    page overflow    ${usersMetrics.overflow}px (want 0)`)
await usersWide.close()

const usersFloor = await open(1280, 900, { path: '/admin/users' })
await usersFloor.screenshot({ path: `${OUT}/admin-users-1280.png`, fullPage: true })
const usersFloorMetrics = await usersFloor.evaluate(measureUsers)
console.log('\n=== Admin Users @ 1280×900 (desktop floor) ===')
console.log(
  `    shell            content=${usersFloorMetrics.content?.w} search=${usersFloorMetrics.search?.w} overflow=${usersFloorMetrics.overflow}px (want 0)`,
)
console.log(
  `    cards            card1=${usersFloorMetrics.card1?.w} card4=${usersFloorMetrics.card4?.w} rows=${usersFloorMetrics.rowCount}`,
)
await usersFloor.close()

await browser.close()
console.log(`\nScreenshots written to ${OUT}`)
