import { useEffect } from 'react'
import { Header } from './Shared/components/Header'
import { Board } from './Board/scenarios/Board'
import { InfoMessage } from './Shared/components/InfoMessage'
import { useGetBoard } from './Shared/hooks/useGetBoard'
import { BoardStatus } from './error'
import { useRefresh } from '@/Shared/hooks/useRefresh'
import { useHeartbeat } from '@/Shared/hooks/useHeartbeat'

function getBackendUrl() {
	return import.meta.env.PROD ? 'https://tavla-api.entur.no' : 'https://tavla-api.dev.entur.no'
}

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

	const backend_url = getBackendUrl()

	const refreshedBoard = useRefresh(board, backend_url) ?? board
	const updatedBoard = refreshedBoard ?? board

	useHeartbeat(board, backend_url)

	const theme = updatedBoard?.theme ?? 'dark'
	const title = updatedBoard?.meta?.title
		? `${updatedBoard.meta.title} | Entur tavla`
		: 'Entur Tavla'

	useEffect(() => {
		const refreshTimeout = setTimeout(
			() => {
				window.location.reload()
			},
			24 * 60 * 60 * 1000,
		)
		return () => clearTimeout(refreshTimeout)
	}, [])

	return (
		<div
			className="w-full root h-full min-h-screen box-inherit bg-(--main-background-color) text-[3vmin]"
			data-theme={theme}
			data-transport-palette={updatedBoard?.transportPalette}
		>
			<div>
				<title>{title}</title>
			</div>

			<div className="flex flex-col bg-background h-screen w-full overflow-hidden p-3.5">
				{loading || error || !updatedBoard ? (
					<BoardStatus loading={loading} error={error} board={updatedBoard} />
				) : (
					<>
						<Header
							theme={updatedBoard.theme}
							hideLogo={updatedBoard.hideLogo}
							hideClock={updatedBoard.hideClock}
							folderLogo={folderLogo}
						/>

						<Board board={updatedBoard} />

						<InfoMessage board={updatedBoard} showEnturLogo={updatedBoard?.hideLogo} />
					</>
				)}
			</div>
		</div>
	)
}

export default BoardPage
