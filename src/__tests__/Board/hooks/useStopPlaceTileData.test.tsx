import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import type { TSituationWithOrigin } from '@/Board/hooks/useTileData'
import { useStopPlaceTileData } from '@/Board/hooks/useTileData'
import type { TileDB } from '@/Shared/types/db-types/boards'
import type { TStopPlaceQuery } from '@/types/graphql-operations'

const { useQueryMock } = vi.hoisted(() => ({ useQueryMock: vi.fn() }))

vi.mock('@/Shared/hooks/useQuery', () => ({
	useQuery: useQueryMock,
	useQueries: vi.fn(() => ({ data: undefined, isLoading: false, error: undefined })),
}))

const situation = (id: string) => ({ id, description: [], summary: [], validityPeriod: null })

const tile: TileDB = {
	stopPlaceId: 'NSR:StopPlace:1',
	quays: [],
	name: 'Tile',
	uuid: 'tile-1',
	filter: { type: 'stopPlaceFilter', selectedLines: [], selectedTransportModes: [] },
}

const stopPlaceFixture: TStopPlaceQuery = {
	stopPlace: {
		name: 'Testplassen',
		transportMode: ['bus'],
		estimatedCalls: [],
		situations: [],
		quays: [
			{ id: 'NSR:Quay:1', publicCode: 'A', situations: [situation('sit-1')] },
			{ id: 'NSR:Quay:2', publicCode: 'B', situations: [situation('sit-2')] },
		],
	},
}

function Harness({
	onResult,
}: {
	onResult: (result: ReturnType<typeof useStopPlaceTileData>) => void
}) {
	onResult(useStopPlaceTileData(tile))
	return null
}

describe('useStopPlaceTileData', () => {
	it('inkluderer situasjoner fra alle stoppestedets quays', () => {
		useQueryMock.mockReturnValue({ data: stopPlaceFixture, isLoading: false, error: undefined })

		let result: ReturnType<typeof useStopPlaceTileData> | undefined
		act(() => {
			createRoot(document.createElement('div')).render(<Harness onResult={(r) => (result = r)} />)
		})

		const situations = result?.situations as TSituationWithOrigin[]
		expect(situations.map((s) => s.id)).toEqual(expect.arrayContaining(['sit-1', 'sit-2']))
		expect(situations.map((s) => s.origin)).toEqual(
			expect.arrayContaining(['Plattform A', 'Plattform B']),
		)
	})
})
