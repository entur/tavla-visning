import { SingleTile } from '@board/scenarios/SingleTile'
import { Tile } from '@components/Tile'
import type { CacheStatus } from '@/Board/hooks/useTileData'
import { BoardContext } from '@/Board/context'
import { TileGrid } from '@/Board/scenarios/Board/components/TileGrid'
import type { BoardDB } from '@/Shared/types/db-types/boards'
import { getUiLabel } from '@/Shared/utils/translations'
import { CombinedTile } from '../CombinedTile'
import { getFontScale } from './utils'
import { Paragraph } from '@entur/typography'
import { ValidationInfoFilledIcon } from '@entur/icons'
import { useCallback, useState } from 'react'
import { useServerNow } from '@/Shared/hooks/useServerNow'

function Board({ board }: { board: BoardDB }) {
	const [cacheStatuses, setCacheStatuses] = useState<Record<string, CacheStatus>>({})
	const now = useServerNow()

	const handleCachedDataChange = useCallback((tileId: string, status: CacheStatus) => {
		setCacheStatuses((prev) => ({ ...prev, [tileId]: status }))
	}, [])

	if (!board.tiles?.length)
		return (
			<Tile state="no_data">
				<p>{getUiLabel('noStopPlacesAdded', board.language ?? 'nb')}</p>
			</Tile>
		)

	const tiles = board.tiles
	const fontScaleClass = getFontScale(board.meta?.fontSize)
	const language = board.language ?? 'nb'

	const getTileSize = (tileIndex: number) => {
		if (tiles.length % 2 === 1 && tileIndex === 0) {
			return 'tall'
		}
		return 'normal'
	}

	const tilesShowingCachedData = Object.values(cacheStatuses).filter(
		(status) => status.showingCachedData,
	)
	const oldestLastUpdated = tilesShowingCachedData.length
		? Math.min(...tilesShowingCachedData.map((status) => status.lastUpdated ?? now))
		: null
	const minutesAgo = oldestLastUpdated ? Math.floor((now - oldestLastUpdated) / 60000) : 0

	return (
		<BoardContext.Provider
			value={{
				boardId: board.id,
				isArrivals: board.isArrivals ?? false,
				language,
			}}
		>
			{tilesShowingCachedData.length > 0 && minutesAgo > 1 && (
				<div className="flex flex-row items-center gap-2">
					<ValidationInfoFilledIcon color="var(--shape-information)" />
					<Paragraph className="m-0">
						{getUiLabel('offlineShowingCachedData', language).replace('{x}', String(minutesAgo))}
					</Paragraph>
				</div>
			)}
			<TileGrid
				tileCount={board.isCombinedTiles ? 1 : tiles.length}
				fontScale={fontScaleClass}
				data-transport-palette={board.transportPalette}
				data-theme={board.theme}
			>
				{board.isCombinedTiles ? (
					<CombinedTile
						key={tiles.map((tile) => tile.uuid).join('-')}
						combinedTile={tiles}
						size="tall"
						onCachedDataChange={handleCachedDataChange}
					/>
				) : (
					tiles.map((tile, index) => {
						return (
							<SingleTile
								key={tile.uuid}
								{...tile}
								size={getTileSize(index)}
								onCachedDataChange={handleCachedDataChange}
							/>
						)
					})
				)}
			</TileGrid>
		</BoardContext.Provider>
	)
}

export { Board }
