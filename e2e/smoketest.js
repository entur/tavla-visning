import { Builder, By, until } from 'selenium-webdriver'

const BROWSERSTACK_HUB = `https://${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`
const TEST_URL = process.env.TEST_URL || 'https://vis-tavla.dev.entur.no'
const TEST_PATH = '/stop/NSR:StopPlace:59872'

const BSTACK_COMMON = {
  projectName: 'tavla-visning',
  buildName: process.env.BUILD_ID || 'local',
}

const BROWSER = {
  browserName: 'chrome',
  browserVersion: '53.0',
  'bstack:options': { ...BSTACK_COMMON, os: 'Linux', sessionName: 'smoketest-chrome-53-linux' },
}

function setSessionStatus(driver, status, reason) {
  // JSON.stringify the payload so quotes/newlines in the reason can't produce invalid JSON
  const payload = JSON.stringify({
    action: 'setSessionStatus',
    arguments: { status, reason: String(reason).slice(0, 255) },
  })
  return driver.executeScript(`browserstack_executor: ${payload}`)
}

function formatError(err) {
  const stack = err.stack ? err.stack.split('\n').slice(1, 4).join('\n  ') : '(no stack)'
  return [`  name:    ${err.name}`, `  message: ${err.message}`, `  ${stack}`].join('\n')
}

if (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY) {
  console.error('Missing BROWSERSTACK_USERNAME or BROWSERSTACK_ACCESS_KEY')
  process.exit(1)
}

console.log('View build on BrowserStack: https://automate.browserstack.com/projects/tavla-visning/builds/\n')

const sessionName = BROWSER['bstack:options'].sessionName
const target = `${TEST_URL}${TEST_PATH}`
console.log(`Starting: ${sessionName}`)

// `driver` stays undefined if `.build()` fails (e.g. BrowserStack rejects the
// capabilities), so every driver-dependent step below is guarded.
let driver
try {
  driver = await new Builder().usingServer(BROWSERSTACK_HUB).withCapabilities(BROWSER).build()

  await driver.get(target)
  // The `.smoketest` class exists solely as a stable hook for this test, so it
  // won't break if theming CSS classes are renamed, moved or removed.
  await driver.wait(until.elementLocated(By.css('.smoketest')), 20000)
  await setSessionStatus(driver, 'passed', 'Page loaded and rendered')
  console.log(`PASSED: ${sessionName}`)
} catch (err) {
  console.error(`FAILED: ${sessionName}\n${formatError(err)}`)
  // Best-effort status update; ignore failures so the original error propagates.
  if (driver) {
    try {
      await setSessionStatus(driver, 'failed', err.message)
    } catch {}
  }
  process.exitCode = 1
} finally {
  if (driver) {
    try {
      await driver.quit()
    } catch (quitErr) {
      console.error(`  (could not quit ${sessionName}: ${quitErr.message})`)
    }
  }
}
