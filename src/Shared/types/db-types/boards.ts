import type { TTransportMode } from '../../../types/graphql-schema'

export type BoardDB = {
	id?: BoardId
	meta: BoardMetaDB
	tiles: TileDB[]
	isCombinedTiles?: boolean
	isArrivals?: boolean
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
}

export type BoardFontSize = 'small' | 'medium' | 'large'

export type QuayDB = {
	id: string
	whitelistedLines: string[]
}

export type LineWithDirectionDB = {
	lineId: string
	frontTexts: string[]
}

export type TileDB = {
	stopPlaceId: string
	quays: QuayDB[]
	name: string
	uuid: string
	linesWithDirection?: LineWithDirectionDB[]

	//TODO: Old architecture - remove once completely migrated
	type?: string
	placeId?: string
	whitelistedLines?: string[]
	// -----

	whitelistedTransportModes?: TTransportMode[]
	walkingDistance?: BoardWalkingDistanceDB
	offset?: number
	displayName?: string
	columns?: TileColumnDB[]
}

export type TileColumnDB =
	| 'aimedTime'
	| 'arrivalTime'
	| 'line'
	| 'destination'
	| 'name'
	| 'platform'
	| 'time'
	| 'fromStopPlace'

export type BoardWalkingDistanceDB = {
	distance?: number
	visible?: boolean
}
