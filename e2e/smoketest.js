import { Builder, By, until } from 'selenium-webdriver'

const BROWSERSTACK_HUB = `https://${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`
const TEST_URL = process.env.TEST_URL || 'https://vis-tavla.dev.entur.no'
// Oslo S — StopPage route requires no backend DB, fetches directly from Entur GraphQL
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

  // `driver` is hoisted so the catch/finally can reach it. Session creation lives inside
  // the try so a rejected new-session request (e.g. an OS/browser combo not available on
  // BrowserStack Automate) surfaces its real reason here instead of crashing unlogged.
  let driver
  try {
    driver = new Builder()
      .usingServer(BROWSERSTACK_HUB)
      .withCapabilities(capabilities)
      .build()

    const session = await driver.getSession()
    console.log(`  ${sessionName} session ${session.getId()} → ${target}`)

    await driver.get(target)

    // Wait for PageWrapper to set data-theme — confirms React hydrated and legacy polyfills ran
    await driver.wait(until.elementLocated(By.css('[data-theme]')), 20000)

    await setSessionStatus(driver, 'passed', 'Page loaded and rendered')
    console.log(`PASSED: ${sessionName}`)
  } catch (err) {
    // Log the real error FIRST — marking the session must never mask it.
    console.error(
      `FAILED: ${sessionName}\n` +
        `  name:    ${err.name}\n` +
        `  message: ${err.message}\n` +
        `  ${err.stack ? err.stack.split('\n').slice(1, 4).join('\n  ') : '(no stack)'}`
    )
    if (driver) {
      try {
        await setSessionStatus(driver, 'failed', err.message)
      } catch (statusErr) {
        console.error(`  (could not mark ${sessionName} failed: ${statusErr.message})`)
      }
    }
    throw err
  } finally {
    if (driver) {
      try {
        await driver.quit()
      } catch (quitErr) {
        console.error(`  (could not quit ${sessionName}: ${quitErr.message})`)
      }
    }
  }
}

async function main() {
  if (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY) {
    console.error('Missing BROWSERSTACK_USERNAME or BROWSERSTACK_ACCESS_KEY')
    process.exit(1)
  }

  const results = []
  for (const caps of BROWSERS) {
    const sessionName = caps['bstack:options'].sessionName
    try {
      await runTest(caps)
      results.push({ sessionName, ok: true })
    } catch (err) {
      results.push({ sessionName, ok: false, reason: err.message })
    }
  }

  const failures = results.filter((r) => !r.ok)
  console.log('\n=== Smoketest summary ===')
  for (const r of results) {
    console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.sessionName}${r.ok ? '' : ` — ${r.reason}`}`)
  }
  console.log(`${results.length - failures.length}/${results.length} passed`)

  process.exit(failures.length > 0 ? 1 : 0)
}

main()
