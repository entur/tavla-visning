import { readBooleanQueryParamValue } from './queryParam'

const DISABLE_HEARTBEAT_STORAGE_KEY = 'tavla_disable_heartbeat'
const DISABLE_HEARTBEAT_QUERY_PARAM = 'disableHeartbeat'

/**
 * Reads the stored heartbeat-disabled value from localStorage.
 *
 * @returns Whether heartbeat should be disabled
 */
function readDisableHeartbeatValue(): boolean {
	try {
		return localStorage.getItem(DISABLE_HEARTBEAT_STORAGE_KEY) === 'true'
	} catch {
		return false
	}
}

/**
 * Writes whether heartbeat should be disabled.
 *
 * @param enabled Whether heartbeat should be disabled
 * @returns void
 */
function writeDisableHeartbeatValue(enabled: boolean): void {
	try {
		if (enabled) {
			localStorage.setItem(DISABLE_HEARTBEAT_STORAGE_KEY, 'true')
		} else {
			localStorage.removeItem(DISABLE_HEARTBEAT_STORAGE_KEY)
		}
	} catch {}
}

/**
 * Reads the `disableHeartbeat` query param, falling back to the previously stored value, and
 * returns whether heartbeat should be disabled.
 *
 * @returns Whether heartbeat should be disabled
 */
export function isHeartbeatDisabled(): boolean {
	const queryParamValue = readBooleanQueryParamValue(DISABLE_HEARTBEAT_QUERY_PARAM)
	if (queryParamValue !== null) {
		writeDisableHeartbeatValue(queryParamValue)
		return queryParamValue
	}

	return readDisableHeartbeatValue()
}
