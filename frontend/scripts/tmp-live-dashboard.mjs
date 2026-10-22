import { chromium } from 'playwright'

const login = await fetch('http://localhost:8000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@gmail.com', password: '12345678' }),
}).then((r) => r.json())

const token = login.token

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.addInitScript((t) => window.localStorage.setItem('token', t), token)

page.on('response', (r) => {
  if (r.url().includes('/materials') || r.url().includes('/auth/me')) {
    console.log('NET', r.request().method(), r.url(), r.status())
  }
})
page.on('console', (m) => {
  if (m.type() === 'error') console.log('CONSOLE', m.text())
})

await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

console.log('processing cards:', await page.getByText('Processing your material...').count())
console.log('error cards:', await page.getByText('Something went wrong while processing this material.').count())
console.log('empty states:', await page.getByText('No content uploaded yet').count())
console.log('alerts:', await page.getByRole('alert').allTextContents())
console.log('cards:', await page.locator('main, body').first().innerText().then((t) => t.slice(0, 600)))

await page.screenshot({ path: 'C:/Users/steve/AppData/Local/Temp/opencode/live-dashboard.png', fullPage: true })
await browser.close()
