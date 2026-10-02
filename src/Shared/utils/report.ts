import { LOG_REPORT_URL } from '@/Shared/assets/env'

export type LogCode = 'display_error' | 'unknown' | 'fetch_journey_planner' | 'fetch_board'
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
	level?: ReportLevel,
): void {
	if (!LOG_REPORT_URL) return
	if (!isReportableBoardId(boardId)) return
	if (!level) level = 'error'

	const online = typeof navigator !== 'undefined' ? navigator.onLine : undefined

	fetch(LOG_REPORT_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ boardId, level, code, message, errorName, online }),
		keepalive: true,
	}).catch(() => {})
}

export function reportSuccess(boardId: string, code: LogCode, level?: ReportLevel): void {
	if (!LOG_REPORT_URL) return
	if (!isReportableBoardId(boardId)) return
	if (!level) level = 'info'

	fetch(LOG_REPORT_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ boardId, level, code, message: `${code} ok` }),
		keepalive: true,
	}).catch(() => {})
}
