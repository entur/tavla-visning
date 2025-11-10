import { BaseTile, DEFAULT_COLUMNS } from '@/Board/components/BaseTile'
import { useQuayTileData } from '@/Board/hooks/useTileData'
import type { QuayTileDB } from '@/Shared/types/db-types/boards'

export function QuayTile(props: QuayTileDB & { className?: string }) {
	const tileData = useQuayTileData(props)

	return (
		<BaseTile
			{...tileData}
			columns={props.columns ?? DEFAULT_COLUMNS}
			walkingDistance={props.walkingDistance}
			className={props.className}
		/>
	)
}
