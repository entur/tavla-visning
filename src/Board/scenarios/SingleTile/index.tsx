import {
	BoardTile,
	DEFAULT_COLUMNS_ARRIVALS,
	DEFAULT_COLUMNS_DEPARTURES,
} from '@board/components/BoardTile'
import { useBoardContext } from '@/Board/context'
import {
	type CacheStatus,
	getCacheStatus,
	resolveTileDataSource,
	useQuaysTileData,
	useStopPlaceTileData,
} from '@/Board/hooks/useTileData'
import type { TileVariants } from '@/Shared/components/Tile'
import type { TileDB } from '@/Shared/types/db-types/boards'
import { useEffect } from 'react'

type Props = TileDB & {
	size?: TileVariants['size']
	onCachedDataChange?: (tileId: string, status: CacheStatus) => void
}

export function SingleTile(props: Props) {
	return resolveTileDataSource(props) === 'quays' ? (
		<QuaysTile {...props} />
	) : (
		<StopPlaceTile {...props} />
	)
}

function QuaysTile(props: Props) {
	const { isArrivals } = useBoardContext()
	const tileData = useQuaysTileData(props, isArrivals)
	const cacheStatus = getCacheStatus(tileData)

	useEffect(() => {
		props.onCachedDataChange?.(props.uuid, {
			showingCachedData: cacheStatus.showingCachedData,
			lastUpdated: cacheStatus.lastUpdated,
		})
	}, [props.onCachedDataChange, props.uuid, cacheStatus.showingCachedData, cacheStatus.lastUpdated])

	return (
		<BoardTile
			{...tileData}
			columns={
				props.columns ?? (isArrivals ? DEFAULT_COLUMNS_ARRIVALS : DEFAULT_COLUMNS_DEPARTURES)
			}
			walkingDistance={props.walkingDistance}
			drivingDistance={props.drivingDistance}
			size={props.size}
		/>
	)
}

function StopPlaceTile(props: Props) {
	const { isArrivals } = useBoardContext()
	const tileData = useStopPlaceTileData(props, isArrivals)
	const cacheStatus = getCacheStatus(tileData)

	useEffect(() => {
		props.onCachedDataChange?.(props.uuid, {
			showingCachedData: cacheStatus.showingCachedData,
			lastUpdated: cacheStatus.lastUpdated,
		})
	}, [props.onCachedDataChange, props.uuid, cacheStatus.showingCachedData, cacheStatus.lastUpdated])

	return (
		<BoardTile
			{...tileData}
			columns={
				props.columns ?? (isArrivals ? DEFAULT_COLUMNS_ARRIVALS : DEFAULT_COLUMNS_DEPARTURES)
			}
			walkingDistance={props.walkingDistance}
			drivingDistance={props.drivingDistance}
			size={props.size}
		/>
	)
}
