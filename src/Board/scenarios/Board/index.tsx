import { Tile } from '@components/Tile'
import { TileGrid } from '@/Board/scenarios/Board/components/TileGrid'
import { SingleTile } from '@board/scenarios/SingleTile'
import type { BoardDB } from '@/Shared/types/db-types/boards'
import { CombinedTile } from '../CombinedTile'
import { defaultFontSize, getFontScale } from './utils'

function Board({ board }: { board: BoardDB }) {
	if (!board.tiles || !board.tiles.length)
		return (
			<Tile state="no_data">
				<p>Du har ikke lagt til noen stoppesteder ennå.</p>
			</Tile>
		)

	const tiles = board.tiles
	const fontScaleClass = getFontScale(board.meta?.fontSize || defaultFontSize(board))

	const getTileSize = (tileIndex: number) => {
		if (tiles.length % 2 === 1 && tileIndex === 0) {
			return 'tall'
		}
		return 'normal'
	}

	return (
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
				/>
			) : (
				tiles.map((tile, index) => {
					return <SingleTile key={tile.uuid} {...tile} size={getTileSize(index)} />
				})
			)}
		</TileGrid>
	)
}

export { Board }
