import { delay } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import type { BoardDB } from '../types/db-types/boards'

type Message = { type: 'refresh'; payload: BoardDB } | { type: 'update' } | { type: 'timeout' }

function useRefresh(initialBoard: BoardDB | null, backend_url: string) {
	const [board, setBoard] = useState<BoardDB | null>(initialBoard)
	console.log(
		'useRefresh - initialBoard:',
		initialBoard,
		'backend_url:',
		backend_url,
		'board:',
		board,
	)

	const subscribe = useCallback(async () => {
		if (!initialBoard?.id) {
			return
		}
		try {
			const res = await fetch(`${backend_url}/subscribe/${initialBoard.id}`)
			console.log('Subscribe response for board:', initialBoard.id, 'response:', res)
			if (!res.ok) {
				console.error('Failed to subscribe for board updates')
				return delay(subscribe, 10000)
			}
			const message = (await res.json()) as Message
			console.log('Received board update message:', message)
			switch (message.type) {
				case 'refresh': {
					console.log('Refreshing board data')
					setBoard(message.payload)
					subscribe()
					break
				}
				case 'update': {
					console.log('Board update available, reloading page')
					window.location.reload()
					break
				}
				case 'timeout': {
					console.log('Subscription timeout, re-subscribing')
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
