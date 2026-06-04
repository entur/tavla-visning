import { BoardTile, DEFAULT_COMBINED_COLUMNS } from '@board/components/BoardTile'
import { useBoardContext } from '@/Board/context'
import { useCombinedTileData } from '@/Board/hooks/useTileData'
import type { TileVariants } from '@/Shared/components/Tile'
import type { TileDB } from '@/Shared/types/db-types/boards'
import { CombinedTileDeviation } from '../Table/components/StopPlaceDeviation'

type Props = {
	combinedTile: TileDB[]
	size?: TileVariants['size']
}

export function CombinedTile({ combinedTile, size }: Props) {
	const { isArrivals } = useBoardContext()
	const tileData = useCombinedTileData(combinedTile, isArrivals)

	return (
		<BoardTile
			{...tileData}
			columns={DEFAULT_COMBINED_COLUMNS}
			customDeviation={<CombinedTileDeviation situations={tileData.situations} />}
			size={size}
		/>
	)
}
