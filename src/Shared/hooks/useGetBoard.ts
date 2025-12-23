import { useState, useEffect } from 'react'
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

/**
 * Custom hook for fetching a board by ID
 * @param boardId - The ID of the board to fetch
 * @returns Object containing board data, loading state, and error state
 */
export function useGetBoard(boardId: string): UseGetBoardReturn {
	const [board, setBoard] = useState<BoardDB | null>(null)
	const [folderLogo, setFolderLogo] = useState<string | undefined>(undefined)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function fetchBoard() {
			setLoading(true)
			setError(null)

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

				setBoard(data.board)
				setFolderLogo(data.folderLogo)
			} catch (err) {
				console.error('useGetBoard: Failed to fetch board', err)
				setError(err instanceof Error ? err.message : 'Unknown error')
				setBoard(null)
			} finally {
				setLoading(false)
			}
		}

		if (boardId.startsWith('preview-')) {
			const previewBoard = PREVIEW_BOARDS.find((b) => b.id === boardId)
			if (previewBoard) {
				setBoard(previewBoard)
				setLoading(false)
				setError(null)
				return
			} else {
				setError('Preview board not found')
				setBoard(null)
				setLoading(false)
				return
			}
		}

		fetchBoard()
	}, [boardId])

	return { board, folderLogo, loading, error }
}
