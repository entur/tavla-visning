const DISABLE_HEARTBEAT_STORAGE_KEY = 'tavla_disable_heartbeat'
const DISABLE_HEARTBEAT_QUERY_PARAM = 'disableHeartbeat'

/**
 * Leser query-parameteret for å sjekke om heartbeat skal deaktiveres
 *
 * @returns boolean Representerer om hearbeat skal deaktiveres
 * @returns null Hvis query-parameteret ikke er satt
 */
function readQueryParam(): boolean | null {
	if (typeof window === 'undefined') return null

	const search = window.location.search
	if (!search) return null

	try {
		const params = new URLSearchParams(search)
		const value = params.get(DISABLE_HEARTBEAT_QUERY_PARAM)
		if (value === 'true') return true
		if (value === 'false') return false
	} catch {
		if (search.includes(`${DISABLE_HEARTBEAT_QUERY_PARAM}=true`)) return true
		if (search.includes(`${DISABLE_HEARTBEAT_QUERY_PARAM}=false`)) return false
	}

	return null
}

/**
 * Leser lagret verdi fra localStorage for å sjekke om heartbeat skal deaktiveres
 *
 * @returns booolean Representerer om hearbeat skal deaktiveres basert på lagret verdi
 */
function readStoredValue(): boolean {
	try {
		return localStorage.getItem(DISABLE_HEARTBEAT_STORAGE_KEY) === 'true'
	} catch {
		return false
	}
}

/**
 * Skriver om heartbeat skal deaktiveres
 *
 * @param enabled boolean Om heartbeat skal deaktiveres
 * @returns void
 */
function writeValue(enabled: boolean): void {
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
	const queryParam = readQueryParam()
	if (queryParam !== null) {
		writeValue(queryParam)
		return queryParam
	}

	return readStoredValue()
}
