import assert from 'node:assert/strict'
import { chromium } from 'playwright'

/**
 * Renders A03/A04 at the design width, checks their geometry, and follows the
 * dashboard entry points into them.
 *
 *   node scripts/verify-learning.mjs <baseUrl> <outDir>
 *
 * Auth and materials are mocked, so the backend is not required.
 */
const BASE = process.argv[2] || 'http://localhost:5173'
const OUT = process.argv[3] || '.'

const USER = { id: 1, name: 'Alex Lee', email: 'alex@example.com', role: 'student' }
const PATH_URL = '/learning/introduction-to-database-systems'
const MODULE_URL = `${PATH_URL}/modules/relational-database-design`

function assertSize(label, box, expected, tolerance = 1) {
  assert.ok(box, `${label}: not rendered`)
  assert.ok(
    Math.abs(box.width - expected.width) <= tolerance,
    `${label}: width ${box.width}, expected ${expected.width}`,
  )
  assert.ok(
    Math.abs(box.height - expected.height) <= tolerance,
    `${label}: height ${box.height}, expected ${expected.height}`,
  )
}

async function newPage(browser, width, height = 900) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })

  await page.addInitScript(() => window.localStorage.setItem('token', 'verify-token'))

  await page.route('**/api/v1/auth/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(USER) }),
  )

  await page.route('**/api/v1/materials', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    }),
  )

  return page
}

async function goto(page, url) {
  for (let attempt = 0; ; attempt++) {
    try {
      await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle' })
      return
    } catch (err) {
      if (attempt >= 20) throw err
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }
}

async function assertNoOverflow(page, label) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  assert.ok(overflow <= 0, `${label}: ${overflow}px horizontal overflow`)
}

async function shootPath(browser, width, name) {
  const page = await newPage(browser, width)
  await goto(page, PATH_URL)
  await page.getByRole('heading', { level: 1 }).waitFor()
  await page.waitForTimeout(250)

  await assertNoOverflow(page, `${name} path`)

  const heading = page.getByRole('heading', { level: 1 })
  assert.equal(await heading.textContent(), 'Introduction to Database Systems')
  assert.equal(
    await heading.evaluate((el) => getComputedStyle(el).fontSize),
    width >= 768 ? '32px' : '28px',
    `${name}: unexpected H1 size`,
  )

  if (width === 1440) {
    const content = await page.getByTestId('learning-content').boundingBox()
    const modules = await page.getByTestId('learning-path-modules').boundingBox()
    const rail = await page.getByTestId('learning-path-rail').boundingBox()
    const progress = await page.getByTestId('path-progress-card').boundingBox()
    const continueCard = await page.getByTestId('continue-card').boundingBox()
    const quiz = await page.getByTestId('quiz-card').boundingBox()

    assertSize('path content', content, { width: 1128, height: content.height })
    assert.equal(Math.round(modules.width), 748, `modules width ${modules.width}`)
    assert.equal(Math.round(rail.width), 352, `rail width ${rail.width}`)
    assert.equal(Math.round(rail.x - (modules.x + modules.width)), 28, 'column gap')
    assertSize('progress card', progress, { width: 352, height: 177 })
    assertSize('continue card', continueCard, { width: 352, height: 270 })
    assertSize('quiz card', quiz, { width: 352, height: 198 })

    const rows = page.getByTestId('module-row')
    assert.equal(await rows.count(), 4)
    const heights = await rows.evaluateAll((els) => els.map((el) => Math.round(el.offsetHeight)))
    assert.deepEqual(heights, [100, 100, 128, 100], `module heights ${heights.join(', ')}`)
  }

  if (width === 1280) {
    const modules = await page.getByTestId('learning-path-modules').boundingBox()
    const rail = await page.getByTestId('learning-path-rail').boundingBox()
    assert.equal(Math.round(modules.width), 588, `1280 modules width ${modules.width}`)
    assert.equal(Math.round(rail.width), 352, `1280 rail width ${rail.width}`)
    assert.equal(Math.round(rail.x - (modules.x + modules.width)), 28, '1280 column gap')
  }

  if (width === 390) {
    const content = await page.getByTestId('learning-content').boundingBox()
    const modules = await page.getByTestId('learning-path-modules').boundingBox()
    const rail = await page.getByTestId('learning-path-rail').boundingBox()
    assert.equal(Math.round(content.width), 342, `mobile content width ${content.width}`)
    assert.equal(Math.round(modules.width), 342, `mobile modules width ${modules.width}`)
    assert.equal(Math.round(rail.width), 342, `mobile rail width ${rail.width}`)
    assert.ok(rail.y > modules.y, 'mobile rail should stack below the modules')
  }

  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })
  await page.close()
  console.log(`wrote ${OUT}/${name}.png (${width}px)`)
}

async function shootLesson(browser, width, name) {
  const page = await newPage(browser, width)
  await goto(page, MODULE_URL)
  await page.getByRole('heading', { level: 1 }).waitFor()
  await page.waitForTimeout(250)

  await assertNoOverflow(page, `${name} lesson`)

  const heading = page.getByRole('heading', { level: 1 })
  assert.equal(await heading.textContent(), 'Relational Database Design')
  assert.equal(
    await heading.evaluate((el) => getComputedStyle(el).fontSize),
    width >= 768 ? '32px' : '28px',
    `${name}: unexpected lesson H1 size`,
  )

  if (width === 1440) {
    const content = await page.getByTestId('lesson-content').boundingBox()
    const outline = await page.getByTestId('lesson-outline').boundingBox()
    const practice = await page.getByTestId('practice-panel').boundingBox()
    const surface = await page.getByTestId('lesson-surface').boundingBox()
    const footer = await page.getByTestId('lesson-footer').boundingBox()

    assertSize('lesson content', content, { width: 1128, height: content.height })
    assertSize('outline', outline, { width: 264, height: 424 })
    assertSize('practice', practice, { width: 264, height: 148 })
    assertSize('lesson surface', surface, { width: 836, height: 622 })
    assert.equal(Math.round(footer.height), 48, `footer height ${footer.height}`)
  }

  if (width === 1280) {
    const outline = await page.getByTestId('lesson-outline').boundingBox()
    const surface = await page.getByTestId('lesson-surface').boundingBox()
    assert.equal(Math.round(outline.width), 264, `1280 outline width ${outline.width}`)
    assert.equal(Math.round(surface.width), 676, `1280 surface width ${surface.width}`)
  }

  if (width === 390) {
    const surface = await page.getByTestId('lesson-surface').boundingBox()
    const outline = await page.getByTestId('lesson-outline').boundingBox()
    assert.equal(Math.round(surface.width), 342, `mobile surface width ${surface.width}`)
    assert.ok(surface.y < outline.y, 'mobile lesson should come before the outline')
  }

  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })
  await page.close()
  console.log(`wrote ${OUT}/${name}.png (${width}px)`)
}

async function verifyLinks(browser) {
  const page = await newPage(browser, 1440)

  await goto(page, '/learning')
  await page.waitForURL(`**${PATH_URL}`)
  assert.equal(new URL(page.url()).pathname, PATH_URL)

  await goto(page, '/dashboard')
  await page.getByText('Continue Learning').waitFor()

  await page.getByRole('link', { name: 'My Learning →' }).click()
  await page.waitForURL(`**${PATH_URL}`)
  assert.equal(new URL(page.url()).pathname, PATH_URL)

  await goto(page, '/dashboard')
  const featuredContinuers = page.locator(`a[href="${MODULE_URL}"]`)
  assert.equal(await featuredContinuers.count(), 2, 'expected mobile + desktop featured CTAs')
  await featuredContinuers.last().click()
  await page.waitForURL(`**${MODULE_URL}`)

  await page.getByRole('link', { name: 'Back to learning path →' }).click()
  await page.waitForURL(`**${PATH_URL}`)

  const pathQuiz = page.getByRole('link', { name: 'Open quiz details →' })
  assert.equal(await pathQuiz.getAttribute('href'), '/quizzes')

  await page.getByRole('link', { name: 'Open module →' }).click()
  await page.waitForURL(`**${MODULE_URL}`)

  const lessonQuiz = page.getByRole('link', { name: 'Take quiz →' })
  assert.equal(await lessonQuiz.getAttribute('href'), '/quizzes')

  const previous = page.getByRole('button', { name: '← Previous: Joins' })
  const next = page.getByRole('button', { name: 'Next lesson →' })
  assert.equal(await previous.isDisabled(), true, 'Previous should be inert')
  assert.equal(await next.isDisabled(), true, 'Next should be inert')

  const nextQuiz = page.getByTestId('practice-panel').getByRole('link', { name: 'Quiz details →' })
  assert.equal(await nextQuiz.getAttribute('href'), '/quizzes')

  await page.close()
  console.log('dashboard + in-page links resolve; previous/next are inert')
}

async function checkStackedWidths(browser, width) {
  const page = await newPage(browser, width)

  await goto(page, PATH_URL)
  await page.getByRole('heading', { level: 1 }).waitFor()
  await assertNoOverflow(page, `${width}px path`)
  const modules = await page.getByTestId('learning-path-modules').boundingBox()
  const rail = await page.getByTestId('learning-path-rail').boundingBox()
  assert.ok(rail.y > modules.y, `${width}px: path columns should stack`)

  await goto(page, MODULE_URL)
  await page.getByRole('heading', { level: 1 }).waitFor()
  await assertNoOverflow(page, `${width}px lesson`)
  const surface = await page.getByTestId('lesson-surface').boundingBox()
  const outline = await page.getByTestId('lesson-outline').boundingBox()
  assert.ok(surface.y < outline.y, `${width}px: lesson should come before the outline`)

  await page.close()
  console.log(`checked ${width}px: stacked, no horizontal overflow`)
}

const browser = await chromium.launch()
await shootPath(browser, 1440, 'build-learning-1440')
await shootPath(browser, 1280, 'build-learning-1280')
await shootPath(browser, 390, 'build-learning-390')
await shootLesson(browser, 1440, 'build-lesson-1440')
await shootLesson(browser, 1280, 'build-lesson-1280')
await shootLesson(browser, 390, 'build-lesson-390')
await checkStackedWidths(browser, 768)
await checkStackedWidths(browser, 1024)
await verifyLinks(browser)
await browser.close()
