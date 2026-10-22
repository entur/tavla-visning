import { LOG_REPORT_URL } from '@/Shared/assets/env'
import { enqueueLog } from '@/Shared/utils/logQueue'
import { getServerNow } from '@/Shared/utils/serverTime'

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

function send(body: Record<string, unknown> & { timestamp: number }): void {
	if (!LOG_REPORT_URL) return

	fetch(LOG_REPORT_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
		keepalive: true,
	}).catch(() => enqueueLog(LOG_REPORT_URL, body))
}

export function reportError(
	boardId: string,
	code: LogCode,
	message: string,
	errorName?: string,
): void {
	if (!isReportableBoardId(boardId)) return

	const online = typeof navigator !== 'undefined' ? navigator.onLine : undefined

	send({ boardId, level: 'error', code, message, errorName, online, timestamp: getServerNow() })
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

export function reportSuccess(boardId: string, code: LogCode, level?: ReportLevel): void {
	if (!isReportableBoardId(boardId)) return
	const levelToReport = level ?? 'info'

	send({
		boardId,
		level: levelToReport,
		code,
		message: `${code} ok`,
		timestamp: getServerNow(),
	})
}
