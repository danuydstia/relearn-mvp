import { chromium } from 'playwright'

/**
 * Verification for Batch 4 (Profile + Edit Profile).
 *
 *   node scripts/verify-profile.mjs <baseUrl> <outDir>
 *
 * Screenshots both screens at the three designed widths (320 / 375 / 1440) and
 * the Edit Profile form's three designed states (empty name, saved, failed,
 * from the proposal sheet 60:9249), then asserts the structural geometry
 * against the Figma frames:
 *   Profile      60:9005 (1440) · 60:8193 (375) · 60:8043 (320)
 *   Edit Profile 60:9127 (1440) · 60:8281 (375) · 60:8131 (320)
 *
 * Only widths, x-offsets and fixed heights are asserted; text-driven heights
 * differ because the design is set in Montserrat and the app is not.
 */
const BASE = process.argv[2] || 'http://localhost:4173'
const OUT = process.argv[3] || 'C:/Users/steve/AppData/Local/Temp/opencode'

const USER = { id: 1, name: 'Alex Lee', email: 'alex@example.com', role: 'student', plan: 'free' }

/** Content boundary: viewport minus rail minus gutters (design "Content boundary"). */
const content = (viewport) => {
  if (viewport >= 1024) {
    return { x: 272, w: 1128 }
  }
  if (viewport >= 768) {
    return { x: 88 + 32, w: viewport - 88 - 64 }
  }
  return { x: 24, w: viewport - 48 }
}

const EXPECTATIONS = {
  1440: {
    profile: {
      title: { x: 272 },
      identityCard: { x: 272, w: 1128, h: 100 },
      editProfileButton: { x: 1226, w: 150, h: 48 },
      highlights: { x: 272, w: 1128, h: 265 },
      overviewCard: { x: 272, w: 552, h: 265 },
      achievementCard: { x: 848, w: 552, h: 132 },
    },
    editProfile: {
      formCard: { x: 272, w: 600 },
      saveButton: { x: 296, w: 144, h: 48 },
      cancelButton: { x: 452, w: 144, h: 48 },
      preview: { x: 900, w: 500 },
    },
  },
  375: {
    profile: {
      title: { x: 24 },
      identityCard: { x: 24, w: 327, h: 160 },
      editProfileButton: { x: 44, w: 287, h: 48 },
      overviewCard: { x: 24, w: 327, h: 257 },
      achievementCard: { x: 24, w: 327, h: 124 },
    },
    editProfile: {
      formCard: { x: 24, w: 327 },
      saveButton: { x: 44, w: 287, h: 48 },
      cancelButton: { x: 44, w: 287, h: 48 },
      preview: null,
    },
  },
  320: {
    profile: {},
    editProfile: {
      formCard: { x: 24, w: 272 },
      saveButton: { x: 44, w: 232, h: 48 },
    },
  },
  // No Profile frame exists at tablet width; the design only specifies 320/375
  // and 1440, with the rail switching at 768. Asserted here for layout sanity
  // only — single column, 88px rail.
  960: {
    profile: {
      title: { x: 120 },
      identityCard: { x: 120, w: 808 },
      overviewCard: { x: 120, w: 392 },
      achievementCard: { x: 536, w: 392 },
    },
    editProfile: {
      // Below lg the form fills the column, as it does on mobile; from lg it is
      // the designed 600px and the preview wraps beneath it until 1440.
      formCard: { x: 120, w: 808 },
    },
  },
}

function measure(kind) {
  const box = (el) => {
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }
  }
  const visible = (el) => !!el && el.getBoundingClientRect().width > 0
  const byText = (text, selector = 'p, h1, h2, span, a') =>
    [...document.querySelectorAll(selector)].find(
      (e) => e.children.length === 0 && e.textContent.trim() === text && visible(e),
    )

  const sections = [...document.querySelectorAll('main section')]
  const firstSection = sections[0]
  const intro = firstSection?.parentElement

  // The identity card is the bordered surface holding the "Name and avatar" line.
  const identityCard = byText('Name and avatar')?.closest('div[class*="rounded-[12px]"]')
  const highlights = sections[0]?.parentElement

  return {
    title: box(document.querySelector('main h1')),
    identityCard: box(identityCard),
    editProfileButton: box(byText('Edit Profile', 'a, button')),
    highlights: box(highlights),
    overviewCard: box(sections[0]),
    achievementCard: box(sections[1]),
    formCard: box(document.querySelector('main form div[class*="rounded-[12px]"]')),
    saveButton: box(byText('Save', 'button')),
    cancelButton: box(byText('Cancel', 'a')),
    preview: box(byText('Profile preview')?.parentElement),
    nameInput: box(document.querySelector('#profile-name')),
    _intro: box(intro),
  }
}

const browser = await chromium.launch()

async function open(width, height, path, { patchStatus = 200, patchBody } = {}) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  await page.addInitScript(() => window.localStorage.setItem('token', 'verify-token'))
  await page.route('**/api/v1/auth/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(USER) }),
  )
  await page.route('**/api/v1/materials', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) }),
  )
  await page.route('**/api/v1/profile', (route) =>
    route.fulfill({
      status: patchStatus,
      contentType: 'application/json',
      body: JSON.stringify(patchBody ?? { ...USER, name: 'Alex Lee' }),
    }),
  )
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(250)
  return page
}

function report(label, expected, actual) {
  console.log(`\n  ── ${label} ──`)
  for (const [key, want] of Object.entries(expected)) {
    if (want === null) {
      console.log(`    ${key.padEnd(18)} expected absent → ${actual[key] ? 'PRESENT' : 'absent ok'}`)
      continue
    }
    const got = actual[key]
    const parts = Object.entries(want).map(([dim, v]) => {
      const g = got ? got[dim] : undefined
      const slack = dim === 'y' || dim === 'h' ? 20 : 0
      const ok = g !== undefined && Math.abs(g - v) <= slack
      return `${dim}=${g} (${ok ? 'ok' : `MISMATCH want ${v}`})`
    })
    console.log(`    ${key.padEnd(18)} ${parts.join('  ')}`)
  }
}

// ── Profile + Edit Profile at each designed width ────────────────────────────
for (const width of [320, 375, 960, 1440]) {
  const height = width === 1440 ? 1000 : 1400
  const expected = EXPECTATIONS[width] ?? {}

  const profile = await open(width, height, '/profile')
  await profile.screenshot({ path: `${OUT}/profile-${width}.png`, fullPage: true })
  console.log(`\n=== Profile @ ${width}px (content ${content(width).x}..${content(width).x + content(width).w}) ===`)
  report('Profile', expected.profile ?? {}, await profile.evaluate(measure, 'profile'))
  await profile.close()

  const edit = await open(width, height, '/profile/edit')
  await edit.screenshot({ path: `${OUT}/edit-profile-${width}.png`, fullPage: true })
  console.log(`=== Edit Profile @ ${width}px ===`)
  report('Edit Profile', expected.editProfile ?? {}, await edit.evaluate(measure, 'edit'))

  // Empty-name state (design "Name validation example", 60:9252)
  await edit.locator('#profile-name').fill('')
  await edit.locator('#profile-name').blur()
  await edit.waitForTimeout(150)
  await edit.locator('main form').screenshot({ path: `${OUT}/edit-profile-empty-${width}.png` })
  const emptyState = await edit.evaluate(() => {
    const input = document.querySelector('#profile-name')
    const save = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Save')
    const error = [...document.querySelectorAll('p')].find(
      (p) => p.textContent.trim() === 'Enter a name to continue.',
    )
    return {
      borderColor: getComputedStyle(input).borderColor,
      messageShown: !!error,
      messageColor: error ? getComputedStyle(error).color : null,
      saveDisabled: save.disabled,
      saveBg: getComputedStyle(save).backgroundColor,
      saveColor: getComputedStyle(save).color,
    }
  })
  console.log(
    `    empty-name         border=${emptyState.borderColor} (want rgb(165,57,50))  message=${emptyState.messageShown} ${emptyState.messageColor} (want rgb(165,57,50))  saveDisabled=${emptyState.saveDisabled} bg=${emptyState.saveBg} (want rgb(228,227,223)) text=${emptyState.saveColor} (want rgb(119,122,130))`,
  )
  await edit.close()

  // Saved state (design "After a confirmed save", 60:9263)
  const saved = await open(width, height, '/profile/edit')
  await saved.locator('#profile-name').fill('Alex Lee')
  await saved.getByRole('button', { name: 'Save' }).click()
  await saved.waitForSelector('[role="status"]', { timeout: 5000 })
  await saved.screenshot({ path: `${OUT}/edit-profile-saved-${width}.png`, fullPage: true })
  console.log(`    saved              pill: "${await saved.locator('[role="status"]').innerText()}"`)
  await saved.close()

  // Failed state (design "Save failure example", 60:9272)
  const failed = await open(width, height, '/profile/edit', {
    patchStatus: 500,
    patchBody: { message: 'Server error' },
  })
  await failed.locator('#profile-name').fill('Alex Lee')
  await failed.getByRole('button', { name: 'Save' }).click()
  await failed.waitForSelector('[role="alert"]', { timeout: 5000 })
  await failed.screenshot({ path: `${OUT}/edit-profile-failed-${width}.png`, fullPage: true })
  console.log(`    failed             alert: "${await failed.locator('[role="alert"]').innerText()}"`)
  await failed.close()
}

// ── Mobile tab bar no longer overflows at 320px ──────────────────────────────
const narrow = await open(320, 900, '/profile')
const overflow = await narrow.evaluate(() => {
  const nav = [...document.querySelectorAll('nav')].find((n) => !n.closest('aside'))
  const tabs = [...nav.querySelectorAll('a, button')]
  return {
    navWidth: Math.round(nav.getBoundingClientRect().width),
    documentOverflow: document.documentElement.scrollWidth - window.innerWidth,
    tabWidths: tabs.map((t) => Math.round(t.getBoundingClientRect().width)),
    tabRightEdges: tabs.map((t) => Math.round(t.getBoundingClientRect().right)),
  }
})
console.log('\n=== Mobile tab bar @ 320px (design 60:8043: 5 × 59.2, last right edge 308) ===')
console.log(`  nav=${overflow.navWidth}px  tabs=${overflow.tabWidths.join(', ')}  lastRight=${overflow.tabRightEdges.at(-1)}  horizontalOverflow=${overflow.documentOverflow}px (want 0)`)
await narrow.close()

await browser.close()
console.log(`\nScreenshots written to ${OUT}`)
