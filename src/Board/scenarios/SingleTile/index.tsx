import { BoardTile, DEFAULT_COLUMNS } from '@board/components/BoardTile'
import { useQuaysTileData, useStopPlaceTileData } from '@/Board/hooks/useTileData'
import type { TileVariants } from '@/Shared/components/Tile'
import type { TileDB } from '@/Shared/types/db-types/boards'

type Props = TileDB & { size?: TileVariants['size'] }

export function SingleTile(props: Props) {
	const hasSelectedQuays = !!props.quays && props.quays.length > 0

	return hasSelectedQuays ? <QuaysTile {...props} /> : <StopPlaceTile {...props} />
}

function QuaysTile(props: Props) {
	const tileData = useQuaysTileData(props)

	return (
		<BoardTile
			{...tileData}
			columns={props.columns ?? DEFAULT_COLUMNS}
			walkingDistance={props.walkingDistance}
			size={props.size}
		/>
	)
}

function StopPlaceTile(props: Props) {
	const tileData = useStopPlaceTileData(props)

	return (
		<BoardTile
			{...tileData}
			columns={props.columns ?? DEFAULT_COLUMNS}
			walkingDistance={props.walkingDistance}
			size={props.size}
		/>
	)
}
