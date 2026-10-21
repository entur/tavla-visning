import { useEffect, useState } from 'react'
import { getServerNow } from '@/Shared/utils/serverTime'

const DEFAULT_INTERVAL_MS = 30000

/**
 * Returnerer server-nå tidspunktet med jevne mellomrom.
 */
export function useServerNow(intervalMs: number = DEFAULT_INTERVAL_MS): number {
	const [now, setNow] = useState(() => getServerNow())

	useEffect(() => {
		const interval = setInterval(() => setNow(getServerNow()), intervalMs)
		return () => clearInterval(interval)
	}, [intervalMs])

	return now
}
