import { BaseTile, DEFAULT_COLUMNS } from '@/Board/components/BaseTile'
import { useQuaysTileData } from '@/Board/hooks/useTileData'
import type { TileVariants } from '@/Shared/components/Tile'
import type { TileDB } from '@/Shared/types/db-types/boards'

type Props = TileDB & { size?: TileVariants['size'] }

export function QuaysTile(props: Props) {
	const tileData = useQuaysTileData(props)

	return (
		<BaseTile
			{...tileData}
			columns={props.columns ?? DEFAULT_COLUMNS}
			walkingDistance={props.walkingDistance}
			size={props.size}
		/>
	)
}
