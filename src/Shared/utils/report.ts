import { LOG_REPORT_URL } from '@/Shared/assets/env'

export type LogCode =
	| 'display_error'
	| 'unknown'
	| 'fetch_journey_planner'
	| 'fetch_board'
	| 'showing_cached_data'
	| 'error_screen_cache_expired'
export type ReportLevel = 'error' | 'warning' | 'info'

const BOARD_ID_PATTERN = /^[a-zA-Z0-9]{20}$/
const NSR_ID_PATTERN = /^NSR:(Quay|StopPlace):\d+$/i

function isReportableBoardId(boardId: string): boolean {
	return !!boardId && (BOARD_ID_PATTERN.test(boardId) || NSR_ID_PATTERN.test(boardId))
}

export function reportError(
	boardId: string,
	code: LogCode,
	message: string,
	errorName?: string,
): void {
	if (!LOG_REPORT_URL) return
	if (!isReportableBoardId(boardId)) return

	const online = typeof navigator !== 'undefined' ? navigator.onLine : undefined

	fetch(LOG_REPORT_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ boardId, level: 'error', code, message, errorName, online }),
		keepalive: true,
	}).catch(() => {})
}

export function reportWarning(
	boardId: string,
	code: LogCode,
	message: string,
	errorName?: string,
): void {
	if (!LOG_REPORT_URL) return
	if (!isReportableBoardId(boardId)) return

	const online = typeof navigator !== 'undefined' ? navigator.onLine : undefined

	fetch(LOG_REPORT_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ boardId, level: 'warning', code, message, errorName, online }),
		keepalive: true,
	}).catch(() => {})
}

const reportedOnceByError = new WeakMap<object, Set<LogCode>>()

/**
 * Som reportWarning, men rapporterer kun én gang per (error-objekt, code)-kombinasjon.
 * Søsken-tiles som deler samme SWR-nøkkel observerer samme error-instans for en gitt
 * mislykket poll, så dette hindrer at ett reelt feilet kall rapporteres én gang per tile.
 * En ny feil-episode gir en ny Error-instans og rapporterer på nytt.
 */
export function reportWarningOnceByError(
	error: Error | undefined,
	boardId: string,
	code: LogCode,
	message: string,
): void {
	if (!error) return
	const seen = reportedOnceByError.get(error) ?? new Set<LogCode>()
	if (seen.has(code)) return
	seen.add(code)
	reportedOnceByError.set(error, seen)
	reportWarning(boardId, code, message, error.name)
}

export function reportSuccess(boardId: string, code: LogCode, level?: ReportLevel): void {
	if (!LOG_REPORT_URL) return
	if (!isReportableBoardId(boardId)) return
	const levelToReport = level ?? 'info'

	fetch(LOG_REPORT_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ boardId, level: levelToReport, code, message: `${code} ok` }),
		keepalive: true,
	}).catch(() => {})
}
