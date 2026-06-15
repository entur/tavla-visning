import { ERROR_REPORT_URL } from '@/Shared/assets/env'

export type ErrorCode = 'display_error' | 'unknown'

const BOARD_ID_PATTERN = /^[a-zA-Z0-9]{20}$/

export function reportError(boardId: string, errorCode: ErrorCode): void {
	if (!ERROR_REPORT_URL) return
	if (!boardId || !BOARD_ID_PATTERN.test(boardId)) return

	fetch(ERROR_REPORT_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ boardId: boardId, errorCode: errorCode }),
		keepalive: true,
	}).catch(() => {})
}
