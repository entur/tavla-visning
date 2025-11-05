import { BaseTile, DEFAULT_COMBINED_COLUMNS } from '@/Board/components/BaseTile'
import { useCombinedTileData } from '@/Board/hooks/useTileData'
import type { BoardTileDB } from '@/Shared/types/db-types/boards'
import { CombinedTileDeviation } from '../Table/components/StopPlaceDeviation'

export function CombinedTile({
	combinedTile,
	className,
}: {
	combinedTile: BoardTileDB[]
	className?: string
}) {
	const tileData = useCombinedTileData(combinedTile)

	return (
		<BaseTile
			{...tileData}
			columns={DEFAULT_COMBINED_COLUMNS}
			customDeviation={<CombinedTileDeviation situations={tileData.situations} />}
			className={className}
		/>
	)
}
