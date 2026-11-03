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

export type LineWithDirectionDB = {
	lineId: string
	frontTexts: string[]
}

export type QuaysFilterDB = {
	type: 'quaysFilter'
	quays: QuayDB[]
}

export type StopPlaceFilterDB = {
	type: 'stopPlaceFilter'
	whitelistedModes: TTransportMode[]
	whitelistedLines: string[]
}

export type TileFilterDB = QuaysFilterDB | StopPlaceFilterDB

export type TileDB = {
	stopPlaceId: string
	/** @deprecated Bruk filter i stedet. Beholdes som fallback inntil alle boards er migrert. */
	quays: QuayDB[]
	name: string
	uuid: string
	filter?: TileFilterDB

	/** @deprecated */
	linesWithDirection?: LineWithDirectionDB[]

	walkingDistance?: BoardWalkingDistanceDB
	drivingDistance?: BoardDrivingDistanceDB
	offset?: number
	displayName?: string
	columns?: TileColumnDB[]
	county?: string
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
