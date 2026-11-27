import { ErrorBoundary } from '@board/components/ErrorBoundary'
import { PageWrapper } from '@components/PageWrapper.tsx'
import { useHeartbeat } from '@hooks/useHeartbeat'
import { useReloadDaily } from '@hooks/useReloadDaily'
import { useState } from 'react'
import { BACKEND_API_URL } from '@/Shared/assets/env'
import { Board } from './Board/scenarios/Board'
import { Header } from './Shared/components/Header'
import { InfoMessage } from './Shared/components/InfoMessage'
import type { BoardDB, TileDB } from './Shared/types/db-types/boards'

function buildSyntheticBoard(nsr: string): BoardDB {
	const isQuay = nsr.startsWith('NSR:Quay:')

	const tile: TileDB = isQuay
		? {
				stopPlaceId: '',
				name: '',
				uuid: 'direktelenke',
				filter: { type: 'quaysFilter', quays: [{ id: nsr, selectedLines: [] }] },
			}
		: {
				stopPlaceId: nsr,
				name: '',
				filter: { type: 'stopPlaceFilter', selectedTransportModes: [], selectedLines: [] },
				uuid: 'direktelenke',
			}

	return {
		meta: {
			fontSize: 'medium',
		},
		id: nsr,
		tiles: [tile],
		language: 'nb',
	}
}

function StopPage() {
	const pathParts = window.location.pathname.split('/').filter(Boolean)
	const nsr = pathParts[1] || ''

	useReloadDaily()

	const board = buildSyntheticBoard(nsr)
	const language = board.language ?? 'nb'
	useHeartbeat(board, BACKEND_API_URL, true)

	const brand = new URLSearchParams(window.location.search).get('brand') ?? undefined

	const [displayName, setDisplayName] = useState<string>()
	const title = displayName ? `${displayName} | Entur Tavla` : undefined

	return (
		<ErrorBoundary boardId={board.id} language={language}>
			<PageWrapper transportPalette={brand} title={title} language={language}>
				<Header theme="dark" />
				<Board board={board} onDisplayNameChange={setDisplayName} />
				<InfoMessage board={board} showEnturLogo={false} />
			</PageWrapper>
		</ErrorBoundary>
	)
}

export default StopPage
