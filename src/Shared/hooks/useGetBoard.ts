import { useEffect, useReducer, useRef } from 'react'
import type { BoardDB } from '../types/db-types/boards'
import { BOARD_API_URL } from '../assets/env'
import { PREVIEW_BOARDS } from '../assets/preveiwBoards'

export interface BoardApiResponse {
	board: BoardDB
	folderLogo?: string
	error?: string
}

interface UseGetBoardReturn {
	board: BoardDB | null
	folderLogo?: string
	loading: boolean
	error: string | null
}

type BoardStatus = 'loading' | 'success' | 'error'

interface BoardState {
	board: BoardDB | null
	folderLogo?: string
	status: BoardStatus
	error: string | null
}

type BoardAction =
	| { type: 'SUCCESS'; board: BoardDB; folderLogo?: string }
	| { type: 'LOADING'; message: string }
	| { type: 'ERROR'; message: string }

const initialState: BoardState = {
	board: null,
	folderLogo: undefined,
	status: 'loading',
	error: null,
}

function boardReducer(state: BoardState, action: BoardAction): BoardState {
	switch (action.type) {
		case 'SUCCESS':
			return {
				board: action.board,
				folderLogo: action.folderLogo,
				status: 'success',
				error: null,
			}
		case 'LOADING':
			return {
				board: null,
				folderLogo: undefined,
				status: 'loading',
				error: null,
			}
		case 'ERROR':
			return {
				board: null,
				folderLogo: undefined,
				status: 'error',
				error: action.message,
			}
		default:
			return state
	}
}

const TRUSTED_MESSAGE_ORIGINS = ['https://tavla.entur.no', 'https://tavla.dev.entur.no']
const DEMO_BOARD_TIMEOUT = 5000

/**
 * Custom hook for fetching a board by ID
 * Supports three sources:
 * - 'preview-*': Local preview boards
 * - 'demo': Demo board from parent iframe via postMessage
 * - Regular ID: Fetch from API
 *
 * @param boardId - The ID of the board to fetch
 * @returns Object containing board data, loading state, and error state
 */
export function useGetBoard(boardId: string): UseGetBoardReturn {
	const [boardState, dispatch] = useReducer(boardReducer, initialState)
	const demoBoardReceivedRef = useRef(false)

	useEffect(() => {
		// Handle preview boards
		if (boardId.startsWith('preview-')) {
			const previewBoard = PREVIEW_BOARDS.find((b) => b.id === boardId)
			if (previewBoard) {
				dispatch({ type: 'SUCCESS', board: previewBoard })
			} else {
				dispatch({ type: 'ERROR', message: 'Preview board not found' })
			}
			return
		}

		// Handle demo board from parent iframe via postMessage
		if (boardId === 'demo') {
			dispatch({ type: 'LOADING', message: 'demo-loading' })
			demoBoardReceivedRef.current = false
			let timeoutId: ReturnType<typeof setTimeout> | undefined

			const isTrustedOrigin = (origin: string): boolean => {
				return TRUSTED_MESSAGE_ORIGINS.includes(origin) || origin.includes('localhost')
			}

			const handleMessageFromParent = (event: MessageEvent): void => {
				if (!isTrustedOrigin(event.origin)) {
					console.warn('useGetBoard: Ignoring message from untrusted origin:', event.origin)
					return
				}

				if (event.data?.type === 'DEMO_BOARD' && event.data?.board) {
					demoBoardReceivedRef.current = true
					dispatch({ type: 'SUCCESS', board: event.data.board })

					if (timeoutId) {
						clearTimeout(timeoutId)
						timeoutId = undefined
					}
				}
			}

			window.addEventListener('message', handleMessageFromParent)

			if (window.parent !== window) {
				window.parent.postMessage({ type: 'READY_FOR_DEMO_BOARD' }, '*')

				timeoutId = setTimeout(() => {
					if (!demoBoardReceivedRef.current) {
						console.warn('useGetBoard: Demo board not received from parent within timeout')
						dispatch({ type: 'ERROR', message: 'Demo board data not received from parent window' })
					}
				}, DEMO_BOARD_TIMEOUT)
			}

			return () => {
				window.removeEventListener('message', handleMessageFromParent)
				if (timeoutId) {
					clearTimeout(timeoutId)
				}
			}
		}

		// Fetch board from API
		dispatch({ type: 'LOADING', message: 'fetch-loading' })

		async function fetchBoard(): Promise<void> {
			try {
				const res = await fetch(`${BOARD_API_URL}/api/board?id=${encodeURIComponent(boardId)}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					cache: 'no-store',
				})

				if (!res.ok) {
					throw new Error(`API returned status ${res.status}`)
				}

				const data: BoardApiResponse = await res.json()

				if (!data.board) {
					throw new Error('No board in response')
				}

				dispatch({ type: 'SUCCESS', board: data.board, folderLogo: data.folderLogo })
			} catch (err) {
				console.error('useGetBoard: Failed to fetch board', err)
				dispatch({ type: 'ERROR', message: err instanceof Error ? err.message : 'Unknown error' })
			}
		}

		fetchBoard()
	}, [boardId])

	return {
		board: boardState.board,
		folderLogo: boardState.folderLogo,
		loading: boardState.status === 'loading',
		error: boardState.error,
	}
}
