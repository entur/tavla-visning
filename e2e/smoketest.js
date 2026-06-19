import { Builder, By, until } from 'selenium-webdriver'

const BROWSERSTACK_HUB = `https://${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`
const TEST_URL = process.env.TEST_URL || 'https://vis-tavla.dev.entur.no'
const TEST_PATH = '/stop/NSR:StopPlace:59872'

const BSTACK_COMMON = {
  projectName: 'tavla-visning',
  buildName: process.env.BUILD_ID || 'local',
}

const BROWSERS = [
  {
    browserName: 'chrome',
    browserVersion: '49.0',
    'bstack:options': { ...BSTACK_COMMON, os: 'Windows', osVersion: '10', sessionName: 'smoketest-chromium-49' },
  },
  {
    browserName: 'firefox',
    browserVersion: '52.0',
    'bstack:options': { ...BSTACK_COMMON, os: 'Windows', osVersion: '10', sessionName: 'smoketest-firefox-52' },
  },
  {
    browserName: 'safari',
    browserVersion: '11.0',
    'bstack:options': { ...BSTACK_COMMON, os: 'OS X', osVersion: 'High Sierra', sessionName: 'smoketest-safari-11' },
  },
  {
    browserName: 'edge',
    browserVersion: '80.0',
    'bstack:options': { ...BSTACK_COMMON, os: 'Windows', osVersion: '10', sessionName: 'smoketest-edge-80' },
  },
]

// JSON.stringify the payload so quotes/newlines in the reason can't produce invalid JSON
function setSessionStatus(driver, status, reason) {
  const payload = JSON.stringify({
    action: 'setSessionStatus',
    arguments: { status, reason: String(reason).slice(0, 255) },
  })
  return driver.executeScript(`browserstack_executor: ${payload}`)
}

async function runTest(capabilities) {
  const sessionName = capabilities['bstack:options'].sessionName
  const target = `${TEST_URL}${TEST_PATH}`
  console.log(`Starting: ${sessionName}`)

  let driver
  try {
    driver = await new Builder().usingServer(BROWSERSTACK_HUB).withCapabilities(capabilities).build()

    await driver.get(target)
    await driver.wait(until.elementLocated(By.css('[data-theme]')), 20000)
    await setSessionStatus(driver, 'passed', 'Page loaded and rendered')

    console.log(`PASSED: ${sessionName}`)
  } catch (err) {
    console.error(
      `FAILED: ${sessionName}\n` +
        `  name:    ${err.name}\n` +
        `  message: ${err.message}\n` +
        // Include up to 3 lines of the stack trace (excluding the first "Error:" line), or indicate if unavailable
        `  ${err.stack ? err.stack.split('\n').slice(1, 4).join('\n  ') : '(no stack)'}`

    )
    if (driver) {
      try { await setSessionStatus(driver, 'failed', err.message) } catch {}
    }
    throw err
  } finally {
    if (driver) {
      try { await driver.quit() } catch (err) {
        console.error(`  (could not quit ${sessionName}: ${err.message})`)
      }
    }
  }
}

if (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY) {
  console.error('Missing BROWSERSTACK_USERNAME or BROWSERSTACK_ACCESS_KEY')
  process.exit(1)
}

console.log('View build on BrowserStack: https://automate.browserstack.com/projects/tavla-visning/builds/\n')

Promise.allSettled(BROWSERS.map(runTest))
  .then((results) => {
    const summary = results.map((result, i) => ({
      sessionName: BROWSERS[i]['bstack:options'].sessionName,
      ok: result.status === 'fulfilled',
      reason: result.status === 'rejected' ? result.reason?.message : undefined,
    }))

    const failures = summary.filter((r) => !r.ok)
    console.log('\n=== Smoketest summary ===')
    summary.forEach((r) =>
      console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.sessionName}${r.ok ? '' : ` — ${r.reason}`}`)
    )
    console.log(`${summary.length - failures.length}/${summary.length} passed`)

    process.exit(failures.length > 0 ? 1 : 0)
  })
