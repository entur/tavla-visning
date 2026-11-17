import { readBooleanQueryParamValue } from './queryParam'

const DISABLE_HEARTBEAT_STORAGE_KEY = 'tavla_disable_heartbeat'
const DISABLE_HEARTBEAT_QUERY_PARAM = 'disableHeartbeat'

/**
 * Leser lagret Heartbeat-verdi fra localStorage om heartbeat skal deaktiveres
 *
 * @returns Representerer om heartbeat skal deaktiveres
 */
function readDisableHeartbeatValue(): boolean {
	try {
		return localStorage.getItem(DISABLE_HEARTBEAT_STORAGE_KEY) === 'true'
	} catch {
		return false
	}
}

/**
 * Skriver om heartbeat skal deaktiveres
 *
 * @param enabled Om heartbeat skal deaktiveres
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
 * Leser query-parmeterne som er satt, og evt lagret fra før og returnerer om heartbeatlogging skal være deaktivert
 *
 * @returns boolean Representerer om hearbeat skal deaktiveres
 */
export function isHeartbeatDisabled(): boolean {
	const queryParamValue = readBooleanQueryParamValue(DISABLE_HEARTBEAT_QUERY_PARAM)
	if (queryParamValue !== null) {
		writeDisableHeartbeatValue(queryParamValue)
		return queryParamValue
	}

	return readDisableHeartbeatValue()
}
