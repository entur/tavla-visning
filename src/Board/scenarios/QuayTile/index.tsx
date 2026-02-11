import { BaseTile, DEFAULT_COLUMNS } from '@/Board/components/BaseTile'
import { useQuayTileData } from '@/Board/hooks/useTileData'
import type { TileVariants } from '@/Shared/components/Tile'
import type { QuayTileDB } from '@/Shared/types/db-types/boards'

export function QuayTile(props: QuayTileDB & { size?: TileVariants['size'] }) {
	const tileData = useQuayTileData(props)

	return (
		<BaseTile
			{...tileData}
			columns={props.columns ?? DEFAULT_COLUMNS}
			walkingDistance={props.walkingDistance}
			size={props.size}
		/>
	)
}
