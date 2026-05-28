import { useReloadDaily } from '@hooks/useReloadDaily'
import { PageWrapper } from '@components/PageWrapper.tsx'
import { Header } from './Shared/components/Header'
import { Board } from './Board/scenarios/Board'
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
		meta: {},
		tiles: [tile],
	}
}

function StopPage() {
	const pathParts = window.location.pathname.split('/').filter(Boolean)
	const nsr = pathParts[1] || ''

	useReloadDaily()

	const board = buildSyntheticBoard(nsr)

	return (
		<PageWrapper>
			<Header theme="dark" />
			<Board board={board} />
			<InfoMessage board={board} showEnturLogo={true} />
		</PageWrapper>
	)
}

export default StopPage
