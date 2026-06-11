import { PageWrapper } from '@components/PageWrapper.tsx'
import { useHeartbeat } from '@hooks/useHeartbeat'
import { useReloadDaily } from '@hooks/useReloadDaily'
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
				quays: [{ id: nsr, whitelistedLines: [] }],
				name: '',
				uuid: 'direktelenke',
			}
		: {
				stopPlaceId: nsr,
				quays: [],
				name: '',
				uuid: 'direktelenke',
			}

	return {
		meta: {
			fontSize: 'medium',
		},
		id: nsr,
		tiles: [tile],
	}
}

function StopPage() {
	const pathParts = window.location.pathname.split('/').filter(Boolean)
	const nsr = pathParts[1] || ''

	useReloadDaily()

	const board = buildSyntheticBoard(nsr)
	useHeartbeat(board, BACKEND_API_URL, true)

	const brand = new URLSearchParams(window.location.search).get('brand') ?? ''

	return (
		<PageWrapper transportPalette={brand}>
			<Header theme="dark" />
			<Board board={board} />
			<InfoMessage board={board} showEnturLogo={true} />
		</PageWrapper>
	)
}

export default StopPage
