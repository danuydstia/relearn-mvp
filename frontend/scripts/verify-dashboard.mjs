import assert from 'node:assert/strict'
import { chromium } from 'playwright'

/**
 * Renders the dashboard at the design width and screenshots it so the
 * implementation can be compared against the Figma render.
 *
 *   node scripts/verify-dashboard.mjs <baseUrl> <outDir>
 *
 * Mocks the auth + materials API so the page renders without a live backend.
 * Also opens the "Popup Upload Materials" dialog (design 91:4786) and checks
 * its geometry plus the title derived for the upload request.
 */
const BASE = process.argv[2] || 'http://localhost:4173'
const OUT = process.argv[3] || '.'

const USER = { id: 1, name: 'Alex Lee', email: 'alex@example.com', role: 'student' }
const EXAMPLE_MATERIAL = {
  id: 1,
  title: 'Statistics — Week 03',
  file_path: 'materials/example.pdf',
  file_type: 'pdf',
  status: 'completed',
}

const MODAL = { width: 774, height: 512 }
const SOURCE_CARD = { width: 692, height: 346 }

function assertSize(label, box, expected) {
  assert.ok(box, `${label}: not rendered`)
  assert.ok(
    Math.abs(box.width - expected.width) <= 1,
    `${label}: width ${box.width}, expected ${expected.width}`,
  )
  assert.ok(
    Math.abs(box.height - expected.height) <= 1,
    `${label}: height ${box.height}, expected ${expected.height}`,
  )
}

async function openDashboard(browser, materials) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  const uploads = []

  await page.addInitScript(() => window.localStorage.setItem('token', 'verify-token'))

  await page.route('**/api/v1/auth/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(USER) }),
  )

  await page.route('**/api/v1/materials', (route) => {
    if (route.request().method() === 'POST') {
      uploads.push(route.request().postDataBuffer()?.toString('latin1') ?? '')
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Material uploaded successfully',
          data: { ...EXAMPLE_MATERIAL, id: 2, title: 'lecture-04' },
        }),
      })
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: materials }),
    })
  })

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

  return { page, uploads }
}

async function shoot(browser, { name, materials }) {
  const { page } = await openDashboard(browser, materials)

  // Neither a completed list nor an empty one should show placeholder states.
  assert.equal(
    await page.getByText('Processing your material...').count(),
    0,
    `${name}: unexpected placeholder processing card`,
  )
  assert.equal(
    await page.getByText('Something went wrong while processing this material.').count(),
    0,
    `${name}: unexpected placeholder failure card`,
  )

  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })

  // Both entry points open the same dialog; the empty state has no CTA row.
  const trigger = materials.length === 0 ? /Input Your Material/ : /New Learning Session/

  await page.getByRole('button', { name: trigger }).click()

  const dialog = page.locator('[role="dialog"]')
  await dialog.waitFor()
  await page.waitForTimeout(300)

  const dialogBox = await dialog.boundingBox()
  const cardBox = await page.getByRole('button', { name: /Document/ }).boundingBox()

  assertSize('modal', dialogBox, MODAL)
  assertSize('source card', cardBox, SOURCE_CARD)

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  assert.ok(overflow <= 0, `modal introduces ${overflow}px horizontal overflow`)

  await page.screenshot({ path: `${OUT}/${name}-modal.png` })

  // Escape must close it and restore the page.
  await page.keyboard.press('Escape')
  await dialog.waitFor({ state: 'detached' })

  await page.close()
  console.log(
    `wrote ${OUT}/${name}.png + ${name}-modal.png (modal ${dialogBox.width}×${dialogBox.height}, card ${cardBox.width}×${cardBox.height})`,
  )
}

async function verifyUpload(browser) {
  const { page, uploads } = await openDashboard(browser, [EXAMPLE_MATERIAL])

  await page.getByRole('button', { name: /New Learning Session/ }).click()

  const [chooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: /Document/ }).click(),
  ])

  await chooser.setFiles({
    name: 'lecture-04.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4\n'),
  })

  await page.locator('[role="dialog"]').waitFor({ state: 'detached' })
  await page.waitForTimeout(300)

  assert.equal(uploads.length, 1, 'expected exactly one upload request')
  assert.ok(uploads[0].includes('name="title"'), 'upload request is missing the title field')
  assert.ok(uploads[0].includes('lecture-04'), 'title was not derived from the filename')

  // The uploaded material replaces the card and no placeholder spinner remains.
  await page.getByText('lecture-04').first().waitFor()
  assert.equal(
    await page.getByText('Processing your material...').count(),
    0,
    'completed upload should not leave a processing card behind',
  )
  assert.equal(
    await page.getByText('Something went wrong while processing this material.').count(),
    0,
    'completed upload should not show the failure card',
  )

  await page.close()
  console.log('upload request carried a derived title; no placeholder states remain')
}

const browser = await chromium.launch()
await shoot(browser, { name: 'build-dashboard', materials: [EXAMPLE_MATERIAL] })
await shoot(browser, { name: 'build-dashboard-empty', materials: [] })
await verifyUpload(browser)
await browser.close()
