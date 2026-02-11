import { Tile, type TileVariants } from '@components/Tile'
import type { BoardTileDB, BoardDB } from '@/Shared/types/db-types/boards'
import { CombinedTile } from '../CombinedTile'
import { QuayTile } from '../QuayTile'
import { StopPlaceTile } from '../StopPlaceTile'
import { getFontScale, defaultFontSize } from './utils'
import { TileGrid } from '@/Board/scenarios/Board/components/TileGrid'

function BoardTile({ tileSpec, size }: { tileSpec: BoardTileDB; size?: TileVariants['size'] }) {
	switch (tileSpec.type) {
		case 'stop_place':
			return <StopPlaceTile {...tileSpec} size={size} />
		case 'quay':
			return <QuayTile {...tileSpec} size={size} />
	}
}

function Board({ board }: { board: BoardDB }) {
	if (!board.tiles || !board.tiles.length)
		return (
			<Tile state="no_data">
				<p>Du har ikke lagt til noen stoppesteder ennå.</p>
			</Tile>
		)

	const combinedTiles = getCombinedTiles(board)
	const separateTiles = getSeparateTiles(board)
	const totalTiles = separateTiles.length + combinedTiles.length
	const fontScaleClass = getFontScale(board.meta?.fontSize || defaultFontSize(board))

	const getTileSize = (tileIndex: number) => {
		if (totalTiles % 2 === 1 && tileIndex === 0) {
			return 'tall'
		}
		return 'normal'
	}

	return (
		<TileGrid
			tileCount={totalTiles}
			fontScale={fontScaleClass}
			data-transport-palette={board.transportPalette}
			data-theme={board.theme}
		>
			{separateTiles.map((tile, index) => {
				return <BoardTile key={tile.uuid} tileSpec={tile} size={getTileSize(index)} />
			})}
			{combinedTiles.map((combinedTile, index) => (
				<CombinedTile
					key={combinedTile.map((tile) => tile.uuid).join('-')}
					combinedTile={combinedTile}
					size={getTileSize(separateTiles.length - 1 + index)}
				/>
			))}
		</TileGrid>
	)
}

export { Board }

function getCombinedTiles(board: BoardDB) {
	const combinedTileIds = board.combinedTiles?.map((c) => c.ids) ?? []
	return combinedTileIds?.map((ids) => board.tiles.filter((t) => ids.includes(t.uuid))) || []
}

function getSeparateTiles(board: BoardDB) {
	const combinedTileIds = board.combinedTiles?.map((c) => c.ids) ?? []
	return board.tiles.filter((t) => !combinedTileIds?.flat().includes(t.uuid))
}
