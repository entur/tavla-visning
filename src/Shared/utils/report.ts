import { LOG_REPORT_URL } from '@/Shared/assets/env'

export type ErrorCode = 'display_error' | 'unknown' | 'fetch_journey_planner' | 'fetch_board'

const BOARD_ID_PATTERN = /^[a-zA-Z0-9]{20}$/
const NSR_ID_PATTERN = /^NSR:(Quay|StopPlace):\d+$/i

function isReportableBoardId(boardId: string): boolean {
	return !!boardId && (BOARD_ID_PATTERN.test(boardId) || NSR_ID_PATTERN.test(boardId))
}

export function reportError(
	boardId: string,
	errorCode: ErrorCode,
	message: string,
	errorName?: string,
): void {
	if (!LOG_REPORT_URL) return
	if (!isReportableBoardId(boardId)) return

	const online = typeof navigator !== 'undefined' ? navigator.onLine : undefined

	fetch(LOG_REPORT_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ boardId, errorCode, message, errorName, online }),
		keepalive: true,
	}).catch(() => {})
}

export function reportSuccess(boardId: string, errorCode: ErrorCode): void {
	if (!LOG_REPORT_URL) return
	if (!isReportableBoardId(boardId)) return

	fetch(LOG_REPORT_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ boardId, errorCode, status: 'ok' }),
		keepalive: true,
	}).catch(() => {})
}
