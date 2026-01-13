import { delay } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import type { BoardDB } from '../types/db-types/boards'

type Message = { type: 'refresh'; payload: BoardDB } | { type: 'update' } | { type: 'timeout' }

function useRefresh(initialBoard: BoardDB | null, backend_url: string) {
	const [board, setBoard] = useState<BoardDB | null>(initialBoard)

	const subscribe = useCallback(async () => {
		if (!initialBoard?.id) {
			return
		}
		try {
			const res = await fetch(`${backend_url}/subscribe/${initialBoard.id}`)
			if (!res.ok) {
				console.error('Failed to subscribe for board updates')
				return delay(subscribe, 10000)
			}
			const message = (await res.json()) as Message
			switch (message.type) {
				case 'refresh': {
					setBoard(message.payload)
					subscribe()
					break
				}
				case 'update': {
					window.location.reload()
					break
				}
				case 'timeout': {
					subscribe()
					break
				}
			}
		} catch (error) {
			console.error('Error while subscribing for board updates', error)
			delay(subscribe, 10000)
		}
	}, [initialBoard?.id, backend_url])

	useEffect(() => {
		const timeout = setTimeout(subscribe, 10000)
		return () => {
			clearTimeout(timeout)
		}
	}, [subscribe])

	return board
}

export { useRefresh }
