import {
	BoardTile,
	DEFAULT_COLUMNS_ARRIVALS,
	DEFAULT_COLUMNS_DEPARTURES,
} from '@board/components/BoardTile'
import { useBoardContext } from '@/Board/context'
import { useQuaysTileData, useStopPlaceTileData } from '@/Board/hooks/useTileData'
import type { TileVariants } from '@/Shared/components/Tile'
import type { TileDB } from '@/Shared/types/db-types/boards'

type Props = TileDB & {
	size?: TileVariants['size']
}

export function SingleTile(props: Props) {
	const hasSelectedQuays = !!props.quays && props.quays.length > 0

	return hasSelectedQuays ? <QuaysTile {...props} /> : <StopPlaceTile {...props} />
}

function QuaysTile(props: Props) {
	const { isArrivals } = useBoardContext()
	const tileData = useQuaysTileData(props, isArrivals)

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
