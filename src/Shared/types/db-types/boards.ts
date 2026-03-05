import type { TTransportMode } from '../../../types/graphql-schema'

export type BoardDB = {
	id?: BoardId
	meta: BoardMetaDB
	tiles: BoardTileDB[]
	combinedTiles?: CombinedTilesDB[]
	theme?: BoardTheme
	footer?: BoardFooter
	transportPalette?: TransportPalette
	hideLogo?: boolean
	hideClock?: boolean
}

export type BoardId = string

export type BoardFooter = {
	footer?: string
}

export type CombinedTilesDB = { ids: BoardId[] }

export type BoardTheme = 'dark' | 'light'
export type TransportPalette = 'default' | 'blue-bus' | 'green-bus'

export type BoardMetaDB = {
	title?: string
	created?: number
	dateModified?: number
	fontSize?: BoardFontSize
	location?: LocationDB
}

export type BoardFontSize = 'small' | 'medium' | 'large'

export type Coordinate = { lat: number; lng: number }
export type LocationDB = {
	name?: string
	coordinate?: Coordinate
}

export type QuayDB = {
	id: string
	whitelistedLines: string[]
}

export type BaseTileDB = {
	stopPlaceId: string
	type?: string
	placeId?: string
	quays?: QuayDB[]
	name: string
	uuid: string
	whitelistedLines?: string[]
	whitelistedTransportModes?: TTransportMode[]
	walkingDistance?: BoardWalkingDistanceDB
	offset?: number
	displayName?: string
	columns?: TileColumnDB[]
}

export const TileColumns = {
	aimedTime: 'Planlagt',
	arrivalTime: 'Ankomst',
	line: 'Linje',
	destination: 'Destinasjon',
	name: 'Stoppested',
	platform: 'Plattform',
	time: 'Forventet',
} as const

export type TileColumnDB = keyof typeof TileColumns
export type BoardTileDB = BaseTileDB

export type BoardWalkingDistanceDB = {
	distance?: number
	visible?: boolean
}
