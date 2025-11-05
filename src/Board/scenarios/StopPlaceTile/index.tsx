import { BaseTile } from '@/Board/components/BaseTile'
import { useStopPlaceTileData } from '@/Board/hooks/useTileData'
import type { StopPlaceTileDB, TileColumnDB } from '@/Shared/types/db-types/boards'

export function StopPlaceTile(props: StopPlaceTileDB & { className?: string }) {
	const tileData = useStopPlaceTileData(props)
	const DEFAULT_COLUMNS: TileColumnDB[] = ['line', 'destination', 'time']

	return (
		<BaseTile
			className={props.className}
			{...tileData}
			columns={props.columns ?? DEFAULT_COLUMNS}
			walkingDistance={props.walkingDistance}
		/>
	)
}
