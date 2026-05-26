import { useEffect } from 'react'
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

	useEffect(() => {
		const refreshTimeout = setTimeout(
			() => {
				window.location.reload()
			},
			24 * 60 * 60 * 1000,
		)
		return () => clearTimeout(refreshTimeout)
	}, [])

	const board = buildSyntheticBoard(nsr)

	return (
		<div
			className="w-full root h-full min-h-screen box-inherit bg-(--main-background-color)"
			data-theme="dark"
			data-color-mode="dark"
		>
			<div>
				<title>Entur Tavla</title>
			</div>

			<div className="flex flex-col bg-background h-screen w-full overflow-hidden p-3.5">
				<Header theme="dark" />
				<Board board={board} />
				<InfoMessage board={board} showEnturLogo={true} />
			</div>
		</div>
	)
}

export default StopPage
