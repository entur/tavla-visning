import { createContext, useContext } from 'react'

type BoardContextValue = {
	isArrivals: boolean
}

const BoardContext = createContext<BoardContextValue>({ isArrivals: false })

export function useBoardContext(): BoardContextValue {
	return useContext(BoardContext)
}

export { BoardContext }
