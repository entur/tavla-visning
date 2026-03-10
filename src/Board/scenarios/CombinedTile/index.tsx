import { BoardTile, DEFAULT_COMBINED_COLUMNS } from '@board/components/BoardTile'
import { useCombinedTileData } from '@/Board/hooks/useTileData'
import type { TileDB } from '@/Shared/types/db-types/boards'
import { CombinedTileDeviation } from '../Table/components/StopPlaceDeviation'
import type { TileVariants } from '@/Shared/components/Tile'

type Props = {
	combinedTile: TileDB[]
	size?: TileVariants['size']
}

export function CombinedTile({ combinedTile, size }: Props) {
	const tileData = useCombinedTileData(combinedTile)

	return (
		<BoardTile
			{...tileData}
			columns={DEFAULT_COMBINED_COLUMNS}
			customDeviation={<CombinedTileDeviation situations={tileData.situations} />}
			size={size}
		/>
	)
}
