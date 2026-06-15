import { ErrorBoundary } from '@board/components/ErrorBoundary'
import { PageWrapper } from '@components/PageWrapper.tsx'
import { BACKEND_API_URL } from '@/Shared/assets/env'
import { useHeartbeat } from '@/Shared/hooks/useHeartbeat'
import { useRefresh } from '@/Shared/hooks/useRefresh'
import { useReloadDaily } from '@/Shared/hooks/useReloadDaily'
import { Board } from './Board/scenarios/Board'
import { BoardStatus } from './error'
import { Header } from './Shared/components/Header'
import { InfoMessage } from './Shared/components/InfoMessage'
import { useGetBoard } from './Shared/hooks/useGetBoard'

function BoardPage() {
	const getBoardId = () => {
		const pathParts = window.location.pathname.split('/').filter(Boolean)

		const boardId = pathParts[pathParts.length - 1]

		if (!boardId) {
			window.location.href = 'https://tavla.entur.no'
			return ''
		}

		return boardId
	}

	const { board, folderLogo, loading, error } = useGetBoard(getBoardId())

	const refreshedBoard = useRefresh(board, BACKEND_API_URL) ?? board
	const updatedBoard = refreshedBoard ?? board

	useHeartbeat(board, BACKEND_API_URL)
	useReloadDaily()

	const theme = updatedBoard?.theme ?? 'dark'
	const title = updatedBoard?.meta?.title
		? `${updatedBoard.meta.title} | Entur tavla`
		: 'Entur Tavla'

	return (
		<PageWrapper theme={theme} transportPalette={updatedBoard?.transportPalette} title={title}>
			{loading || error || !updatedBoard ? (
				<BoardStatus loading={loading} error={error} board={updatedBoard} />
			) : (
				<ErrorBoundary boardId={updatedBoard.id}>
					<Header
						theme={updatedBoard.theme}
						hideLogo={updatedBoard.hideLogo}
						hideClock={updatedBoard.hideClock}
						folderLogo={folderLogo}
						isArrivals={updatedBoard.isArrivals ?? false}
					/>

					<Board board={updatedBoard} />

					<InfoMessage
						board={updatedBoard}
						showEnturLogo={updatedBoard?.hideLogo || !!folderLogo}
					/>
				</ErrorBoundary>
			)}
		</PageWrapper>
	)
}

export default BoardPage
