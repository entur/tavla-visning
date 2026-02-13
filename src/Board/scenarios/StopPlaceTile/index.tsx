import { BaseTile } from '@/Board/components/BaseTile'
import { useStopPlaceTileData } from '@/Board/hooks/useTileData'
import type { TileVariants } from '@/Shared/components/Tile'
import type { StopPlaceTileDB, TileColumnDB } from '@/Shared/types/db-types/boards'

type Props = StopPlaceTileDB & { size?: TileVariants['size'] }

export function StopPlaceTile(props: Props) {
	const tileData = useStopPlaceTileData(props)
	const DEFAULT_COLUMNS: TileColumnDB[] = ['line', 'destination', 'time']

	return (
		<BaseTile
			{...tileData}
			columns={props.columns ?? DEFAULT_COLUMNS}
			walkingDistance={props.walkingDistance}
			size={props.size}
		/>
	)
}
