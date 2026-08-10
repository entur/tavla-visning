import type { BoardLanguage } from '@/Shared/types/db-types/boards'
import { createContext, useContext } from 'react'

type BoardContextValue = {
	isArrivals: boolean
	language: BoardLanguage
}

const BoardContext = createContext<BoardContextValue>({
	isArrivals: false,
	language: 'nb',
})

export function useBoardContext(): BoardContextValue {
	return useContext(BoardContext)
}

export { BoardContext }
