import { useEffect, useState } from 'react'
import { getServerNow } from '@/Shared/utils/serverTime'

const DEFAULT_INTERVAL_MS = 30000

/**
 * Returns the current server time, re-rendering the caller on an interval so
 * time-based filtering keeps working even when no new data arrives (e.g. the
 * browser is offline and SWR has stopped retrying).
 */
export function useServerNow(intervalMs: number = DEFAULT_INTERVAL_MS): number {
	const [now, setNow] = useState(() => getServerNow())

	useEffect(() => {
		const interval = setInterval(() => setNow(getServerNow()), intervalMs)
		return () => clearInterval(interval)
	}, [intervalMs])

	return now
}
