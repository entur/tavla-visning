import { getServerNow } from '@/Shared/utils/serverTime'

const STORAGE_KEY = 'tavla_log_queue'
const MAX_AGE_MS = 15 * 60 * 1000

type QueuedLog = {
	url: string
	body: Record<string, unknown> & { timestamp: number }
}

function readQueue(): QueuedLog[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		const parsed = raw ? JSON.parse(raw) : []
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

function writeQueue(queue: QueuedLog[]): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
	} catch {
		// localStorage kan være full eller utilgjengelig - logging skal aldri stoppe tavla
	}
}

function pruneExpired(queue: QueuedLog[]): QueuedLog[] {
	const cutoff = getServerNow() - MAX_AGE_MS
	return queue.filter((entry) => entry.body.timestamp >= cutoff)
}

export function enqueueLog(
	url: string,
	body: Record<string, unknown> & { timestamp: number },
): void {
	writeQueue([...pruneExpired(readQueue()), { url, body }])
}

export function flushLogQueue(): void {
	const queue = pruneExpired(readQueue())
	writeQueue([])

	queue.forEach(({ url, body }) => {
		fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
			keepalive: true,
		}).catch(() => enqueueLog(url, body))
	})
}

if (typeof window !== 'undefined') {
	window.addEventListener('online', flushLogQueue)
	flushLogQueue()
}
