import { useEffect } from 'react'

export function useReloadDaily() {
	useEffect(() => {
		const refreshTimeout = setTimeout(
			() => {
				window.location.reload()
			},
			24 * 60 * 60 * 1000,
		)
		return () => clearTimeout(refreshTimeout)
	}, [])
}
