import type { TTransportMode } from '@/types/graphql-schema'

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
	language?: BoardLanguage
}

export type BoardId = string

export type BoardFooter = {
	footer?: string
}

export type CombinedTilesDB = { ids: BoardId[] }

export type BoardTheme = 'dark' | 'light'
export type BoardLanguage = 'nb' | 'en'
export type TransportPalette =
	| 'default'
	| 'blue-bus'
	| 'green-bus'
	| 'atb'
	| 'fram'
	| 'svipper'
	| 'reis'
	| 'brakar'

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

export type FilterQuayDB = {
	id: string
	selectedLines: string[]
}

export type TileViewMode = 'expandNextDeparture' | 'default'

export type QuaysFilterDB = {
	type: 'quaysFilter'
	quays: FilterQuayDB[]
}

export type StopPlaceFilterDB = {
	type: 'stopPlaceFilter'
	selectedTransportModes: TTransportMode[]
	selectedLines: string[]
}

export type TileFilterDB = QuaysFilterDB | StopPlaceFilterDB

export type TileDB = {
	stopPlaceId: string
	/** @deprecated Bruk filter i stedet. */
	quays: QuayDB[]
	name: string
	uuid: string
	filter?: TileFilterDB

	walkingDistance?: BoardWalkingDistanceDB
	drivingDistance?: BoardDrivingDistanceDB
	offset?: number
	displayName?: string
	columns?: TileColumnDB[]
	county?: string
	viewMode?: TileViewMode
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

export type BoardDrivingDistanceDB = {
	distance?: number
}
