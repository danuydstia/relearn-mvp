import { chromium } from 'playwright'

/**
 * Verifies the plan-aware dashboard chrome (Batch 2).
 *
 *   node scripts/verify-plan.mjs <baseUrl> <outDir>
 *
 * Mocks the auth + materials API, then reports the sidebar account-usage
 * geometry and badges for the Free and Pro states. When the page is served by
 * `vite dev` it also clicks the DevPlanSwitcher and asserts the
 * `PUT /dev/plan` round-trip flips the UI. In a production build the switcher
 * is absent by design, and that is reported rather than treated as a failure.
 */
const BASE = process.argv[2] || 'http://localhost:4173'
const OUT = process.argv[3] || '.'

/** Shape the mocked `/auth/me` payload for a given plan. */
const mockUser = (plan) => ({
  id: 1,
  name: 'Alex Lee',
  email: 'alex@example.com',
  role: 'student',
  plan,
})

/** Runs in the browser: measures the plan-aware chrome. */
const READ = () => {
  const aside = document.querySelector('aside')
  const block = aside.children[aside.children.length - 1]
  const isBadge = (node) => /^(Free|Pro)$/.test(node.textContent.trim())
  const sidebarBadge = [...block.querySelectorAll('span')].find(isBadge)
  const topbarBadge = [...document.querySelectorAll('header span')].find(isBadge)

  return {
    accountUsageHeight: Math.round(block.getBoundingClientRect().height),
    sidebarBadge: sidebarBadge ? sidebarBadge.textContent.trim() : null,
    sidebarBadgeBg: sidebarBadge ? getComputedStyle(sidebarBadge).backgroundColor : null,
    topbarBadge: topbarBadge ? topbarBadge.textContent.trim() : null,
    hasExplorePro: !!block.querySelector('a[href="/pro"]'),
    hasDevSwitcher: !!document.querySelector('button[title^="Development only"]'),
  }
}

const browser = await chromium.launch()

async function open(initialPlan, name) {
  const state = { plan: initialPlan, puts: [] }
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })

  await page.addInitScript(() => window.localStorage.setItem('token', 'verify-token'))

  await page.route('**/api/v1/auth/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockUser(state.plan)) }),
  )
  await page.route('**/api/v1/materials', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) }),
  )
  await page.route('**/api/v1/dev/plan', (route) => {
    state.plan = JSON.parse(route.request().postData() || '{}').plan
    state.puts.push(state.plan)
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUser(state.plan)),
    })
  })

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
  console.log(`wrote ${OUT}/${name}.png`)

  return { page, state }
}

const results = {}

{
  const { page, state } = await open('free', 'build-dashboard-free')
  results.free = { ...(await page.evaluate(READ)), puts: state.puts }
  await page.close()
}

{
  const { page, state } = await open('pro', 'build-dashboard-pro')
  results.pro = { ...(await page.evaluate(READ)), puts: state.puts }
  await page.close()
}

{
  const { page, state } = await open('free', 'build-dashboard-switcher')
  const switcher = page.locator('button[title^="Development only"]').first()

  if (await switcher.count()) {
    await switcher.click()
    await page.waitForFunction(
      () => {
        const aside = document.querySelector('aside')
        const block = aside.children[aside.children.length - 1]
        return [...block.querySelectorAll('span')].some((s) => s.textContent.trim() === 'Pro')
      },
      null,
      { timeout: 8000 },
    )
    results.afterSwitch = { ...(await page.evaluate(READ)), puts: state.puts }
  } else {
    results.afterSwitch = 'skipped — dev switcher absent (expected in a production build)'
  }

  await page.close()
}

console.log(JSON.stringify(results, null, 2))
await browser.close()
