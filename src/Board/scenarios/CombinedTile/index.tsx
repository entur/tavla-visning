import {
	BoardTile,
	DEFAULT_COMBINED_COLUMNS_ARRIVALS,
	DEFAULT_COMBINED_COLUMNS_DEPARTURES,
} from '@board/components/BoardTile'
import { useBoardContext } from '@/Board/context'
import { type CacheStatus, getCacheStatus, useCombinedTileData } from '@/Board/hooks/useTileData'
import type { TileVariants } from '@/Shared/components/Tile'
import type { TileDB } from '@/Shared/types/db-types/boards'
import { CombinedTileDeviation } from '../Table/components/StopPlaceDeviation'
import { useEffect } from 'react'

type Props = {
	combinedTile: TileDB[]
	size?: TileVariants['size']
	onCachedDataChange?: (tileId: string, status: CacheStatus) => void
}

export function CombinedTile({ combinedTile, size, onCachedDataChange }: Props) {
	const { isArrivals } = useBoardContext()
	const tileData = useCombinedTileData(combinedTile, isArrivals)
	const cacheStatus = getCacheStatus(tileData)

	useEffect(() => {
		onCachedDataChange?.('combined', {
			showingCachedData: cacheStatus.showingCachedData,
			lastUpdated: cacheStatus.lastUpdated,
		})
	}, [onCachedDataChange, cacheStatus.showingCachedData, cacheStatus.lastUpdated])

	return (
		<BoardTile
			{...tileData}
			columns={isArrivals ? DEFAULT_COMBINED_COLUMNS_ARRIVALS : DEFAULT_COMBINED_COLUMNS_DEPARTURES}
			customDeviation={<CombinedTileDeviation situations={tileData.situations} />}
			size={size}
		/>
	)
}
