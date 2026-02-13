import { BaseTile, DEFAULT_COMBINED_COLUMNS } from '@/Board/components/BaseTile'
import { useCombinedTileData } from '@/Board/hooks/useTileData'
import type { BoardTileDB } from '@/Shared/types/db-types/boards'
import { CombinedTileDeviation } from '../Table/components/StopPlaceDeviation'
import type { TileVariants } from '@/Shared/components/Tile'

type Props = {
	combinedTile: BoardTileDB[]
	size?: TileVariants['size']
}

export function CombinedTile({ combinedTile, size }: Props) {
	const tileData = useCombinedTileData(combinedTile)

	return (
		<BaseTile
			{...tileData}
			columns={DEFAULT_COMBINED_COLUMNS}
			customDeviation={<CombinedTileDeviation situations={tileData.situations} />}
			size={size}
		/>
	)
}
