import { useBoardContext } from '@/Board/context'
import { GetQuayQuery, StopPlaceQuery } from '@/graphql'
import { useQueries, useQuery } from '@/Shared/hooks/useQuery'
import { useServerNow } from '@/Shared/hooks/useServerNow'
import type { QuayDB, TileDB } from '@/Shared/types/db-types/boards'
import { getPlatformLabel } from '@/Shared/utils/translations'
import type { TDepartureFragment, TSituationFragment } from '@/types/graphql-operations'
import type { TEstimatedCallFilterInput, TTransportMode } from '@/types/graphql-schema'
import {
	combineSituations,
	getAccumulatedTileSituations,
	type TileSituation,
} from '../scenarios/Board/utils'
import { useCycler } from '../scenarios/Table/useCycler'

export type TDepartureWithTileUuid = TDepartureFragment & { tileUuid?: string }
export type TSituationWithOrigin = TSituationFragment & { origin?: string }

export type CustomName = {
	uuid: string
	customName: string
}

interface TileData {
	displayName?: string
	estimatedCalls: TDepartureFragment[]
	situations: TSituationFragment[]
	uniqueSituations: TileSituation[]
	currentSituationIndex: number
	isLoading: boolean
	error?: Error
	hasData: boolean
	customNames?: CustomName[]
}

export type TileDataSource = 'quays' | 'stopPlace'

function filterPastDepartures(
	departures: TDepartureFragment[],
	now: number,
	isArrivals?: boolean,
): TDepartureFragment[] {
	return departures.filter((departure) => {
		const holdTime = isArrivals ? now + ARRIVAL_HOLD_TIME_MINUTES * 60 * 1000 : now
		const time = isArrivals ? departure.expectedArrivalTime : departure.expectedDepartureTime
		return new Date(time).getTime() >= holdTime
	})
}

/**
 * Bestemmer hvilken datakilde som skal brukes for å hente avganger for en gitt tile.
 *
 * @param tile
 * @returns Enten'quays' eller 'stopPlace', som indikerer hvilken datakilde som skal brukes for å hente avganger for den gitte tile.
 */
export function resolveTileDataSource(tile: Pick<TileDB, 'quays' | 'filter'>): TileDataSource {
	if (tile.filter?.type === 'quaysFilter') {
		// Hvis det er 0 valgte quays, er filteret å betrakte som et helt stoppested
		return tile.filter.quays.length > 0 ? 'quays' : 'stopPlace'
	}
	if (tile.filter?.type === 'stopPlaceFilter') return 'stopPlace'
	if (tile.quays && tile.quays.length > 0) return 'quays'
	return 'stopPlace'
}

export function getQuaysToQuery(tile: Pick<TileDB, 'filter' | 'quays'>): QuayDB[] {
	if (tile.filter?.type === 'quaysFilter') return tile.filter.quays
	return tile.quays ?? []
}

export function getStopPlaceFilterValues(tile: Pick<TileDB, 'filter'>): {
	whitelistedLines?: string[]
	whitelistedModes?: TTransportMode[]
} {
	if (tile.filter?.type === 'stopPlaceFilter') {
		return {
			whitelistedLines: tile.filter.whitelistedLines,
			whitelistedModes: tile.filter.whitelistedModes,
		}
	}
	return {}
}

// Selectorer i `select` ORes, men ulike felt (lines/transportModes) i samme selector ANDes. Linjer og
// moduser legges derfor i hver sin selector – ellers ville f.eks. "buss AND trikk AND Linje 1" være umulig å matche.
export function buildEstimatedCallFilters(
	whitelistedLines?: string[],
	whitelistedModes?: TTransportMode[],
): TEstimatedCallFilterInput[] | undefined {
	const lineFilter = whitelistedLines?.length ? { lines: whitelistedLines } : undefined

	const modeFilter = whitelistedModes?.length
		? { transportModes: whitelistedModes.map((transportMode) => ({ transportMode })) }
		: undefined

	const select = [lineFilter, modeFilter].filter(isNotNullOrUndefined)

	return select.length > 0 ? [{ select }] : undefined
}

const ARRIVAL_HOLD_TIME_MINUTES = -5
const DEFAULT_NUMBER_OF_DEPARTURES = 20

export function useQuaysTileData(
	{ filter, quays, offset, displayName, name }: TileDB,
	isArrivals?: boolean,
): TileData {
	const { boardId } = useBoardContext()
	const now = useServerNow()
	const quaysToQuery = getQuaysToQuery({ filter, quays })
	const hasSelectedQuays = quaysToQuery.length > 0

	const quayQueries = hasSelectedQuays
		? quaysToQuery.map((q) => ({
				query: GetQuayQuery,
				variables: {
					quayId: q.id,
					filters: buildEstimatedCallFilters(q.whitelistedLines),
					arrivalDeparture: isArrivals ? ('arrivals' as const) : undefined,
				},
				options: {
					poll: true,
					offset: (offset ?? 0) + (isArrivals ? ARRIVAL_HOLD_TIME_MINUTES : 0),
				},
			}))
		: []

	const {
		data: quaysData,
		isLoading: quaysLoading,
		error: quaysError,
	} = useQueries(quayQueries, boardId)

	const quayResults = quaysData?.map((d) => d.quay).filter(isNotNullOrUndefined) ?? []

	const quaysSituations = quayResults.flatMap((quay) => {
		const spSituations = quay.stopPlace?.situations ?? []
		const qSituations = quay.situations ?? []
		return [...spSituations, ...qSituations]
	})

	const departures = filterPastDepartures(
		quayResults
			.flatMap((quay) => quay.estimatedCalls)
			.filter(isNotNullOrUndefined)
			.sort((a, b) => {
				const timeA = isArrivals ? a.expectedArrivalTime : a.expectedDepartureTime
				const timeB = isArrivals ? b.expectedArrivalTime : b.expectedDepartureTime
				return new Date(timeA).getTime() - new Date(timeB).getTime()
			}),
		now,
		isArrivals,
	)

	const accumulatedQuaysSituations = getAccumulatedTileSituations(departures, quaysSituations)

	const quaysSituationIndex = useCycler(accumulatedQuaysSituations ?? [], 10000)

	return {
		displayName: (displayName ?? name) || quayResults[0]?.name,
		estimatedCalls: departures,
		situations: quaysSituations ?? [],
		uniqueSituations: accumulatedQuaysSituations,
		currentSituationIndex: quaysSituationIndex,
		isLoading: quaysLoading,
		error: quaysError,
		hasData: quayResults.length > 0,
	}
}

export function useStopPlaceTileData(
	{ stopPlaceId, filter, offset, displayName, name, quays }: TileDB,
	isArrivals?: boolean,
): TileData {
	const { language, boardId } = useBoardContext()
	const now = useServerNow()
	const { whitelistedLines, whitelistedModes } = getStopPlaceFilterValues({ filter })

	const {
		data: stopPlaceData,
		isLoading: stopPlaceLoading,
		error: stopPlaceError,
	} = useQuery(
		StopPlaceQuery,
		{
			stopPlaceId: stopPlaceId,
			filters: buildEstimatedCallFilters(whitelistedLines, whitelistedModes),
			numberOfDepartures: DEFAULT_NUMBER_OF_DEPARTURES,
			arrivalDeparture: isArrivals ? ('arrivals' as const) : undefined,
		},
		{
			poll: true,
			offset: (offset ?? 0) + (isArrivals ? ARRIVAL_HOLD_TIME_MINUTES : 0),
			boardId,
		},
	)

	const filteredCalls = filterPastDepartures(
		stopPlaceData?.stopPlace?.estimatedCalls ?? [],
		now,
		isArrivals,
	).slice(0, DEFAULT_NUMBER_OF_DEPARTURES)

	// tile.quays er kun relevant som fallback når filter mangler
	const selectedQuayIds = filter ? [] : (quays?.map((q) => q.id) ?? [])
	const relevantQuays = (stopPlaceData?.stopPlace?.quays ?? [])
		.filter(isNotNullOrUndefined)
		.filter((quay) => selectedQuayIds.length === 0 || selectedQuayIds.includes(quay.id))

	const platformLabel = getPlatformLabel(
		(stopPlaceData?.stopPlace?.transportMode ?? []).filter(isNotNullOrUndefined),
		language,
	)

	const selectedQuaysSituations: TSituationWithOrigin[] = relevantQuays.flatMap((quay) =>
		quay.situations.map((situation) => ({
			...situation,
			origin: quay.publicCode ? `${platformLabel} ${quay.publicCode}` : undefined,
		})),
	)

	const situations = combineSituations([
		...(stopPlaceData?.stopPlace?.situations ?? []),
		...selectedQuaysSituations,
	])

	const stopPlaceSituations = getAccumulatedTileSituations(filteredCalls, situations)

	const currentSituationIndex = useCycler(stopPlaceSituations ?? [], 10000)

	return {
		displayName: (displayName ?? name) || stopPlaceData?.stopPlace?.name,
		estimatedCalls: filteredCalls,
		situations,
		uniqueSituations: stopPlaceSituations ?? [],
		currentSituationIndex,
		isLoading: stopPlaceLoading,
		error: stopPlaceError,
		hasData: !!stopPlaceData?.stopPlace,
	}
}

export function useCombinedTileData(combinedTile: TileDB[], isArrivals?: boolean): TileData {
	const { boardId } = useBoardContext()
	const now = useServerNow()
	const arrivalDeparture = isArrivals ? ('arrivals' as const) : undefined
	const holdTimeOffset = isArrivals ? ARRIVAL_HOLD_TIME_MINUTES : 0

	const tileDataSource = (tile: TileDB): TileDataSource => resolveTileDataSource(tile)
	const isQuayTile = (tile: TileDB) => tileDataSource(tile) === 'quays'

	const quayQueryMeta = combinedTile.filter(isQuayTile).flatMap((tile) =>
		getQuaysToQuery(tile).map((q) => ({
			query: GetQuayQuery,
			variables: {
				quayId: q.id,
				filters: buildEstimatedCallFilters(q.whitelistedLines),
				arrivalDeparture,
			},
			options: { poll: true, offset: (tile.offset ?? 0) + holdTimeOffset },
			tileUuid: tile.uuid,
		})),
	)

	const quayQueries = quayQueryMeta.map(({ tileUuid: _, ...q }) => q)

	const stopPlaceQueryMeta = combinedTile
		.filter((tile) => !isQuayTile(tile))
		.map((tile) => {
			const { whitelistedLines, whitelistedModes } = getStopPlaceFilterValues(tile)
			return {
				query: StopPlaceQuery,
				variables: {
					stopPlaceId: tile.stopPlaceId,
					filters: buildEstimatedCallFilters(whitelistedLines, whitelistedModes),
					numberOfDepartures: DEFAULT_NUMBER_OF_DEPARTURES,
					arrivalDeparture,
				},
				options: { offset: (tile.offset ?? 0) + holdTimeOffset, poll: true },
				tile,
			}
		})

	const stopPlaceQueries = stopPlaceQueryMeta.map(({ tile: _, ...q }) => q)

	const {
		data: stopPlaceData,
		error: stopPlaceError,
		isLoading: stopPlaceLoading,
	} = useQueries(stopPlaceQueries, boardId)

	const {
		data: quaysData,
		error: quaysError,
		isLoading: quaysLoading,
	} = useQueries(quayQueries, boardId)

	const estimatedCalls = [
		...(stopPlaceData?.flatMap((data, index) => {
			const tile = stopPlaceQueryMeta[index]?.tile

			return (data.stopPlace?.estimatedCalls ?? []).map((call) => ({
				...call,
				tileUuid: tile?.uuid,
			}))
		}) ?? []),
		...(quaysData?.flatMap((data, index) => {
			const meta = quayQueryMeta[index]
			return (data?.quay?.estimatedCalls ?? []).map((call) => ({
				...call,
				tileUuid: meta?.tileUuid,
			}))
		}) ?? []),
	]

	const departures = filterPastDepartures(
		(estimatedCalls.filter(isNotNullOrUndefined) ?? []).sort((a, b) => {
			const timeA = isArrivals ? a.expectedArrivalTime : a.expectedDepartureTime
			const timeB = isArrivals ? b.expectedArrivalTime : b.expectedDepartureTime
			return new Date(timeA).getTime() - new Date(timeB).getTime()
		}),
		now,
		isArrivals,
	)

	const situations: TSituationWithOrigin[] = [
		...(stopPlaceData?.flatMap((data) => {
			const origin = data?.stopPlace?.name ?? ''
			const situations = data?.stopPlace?.situations ?? []
			return situations.map((situation) => ({
				origin,
				...situation,
			}))
		}) ?? []),
		...(quaysData?.flatMap((data) => {
			const quay = data?.quay
			if (!quay) return []
			const origin = quay.name ?? ''
			const quaySituations = quay.situations ?? []
			const spSituations = quay.stopPlace?.situations ?? []
			return [...quaySituations, ...spSituations].map((situation) => ({
				origin,
				...situation,
			}))
		}) ?? []),
	]

	const combinedSituations = combineSituations(situations)
	const uniqueSituations = getAccumulatedTileSituations(departures, combinedSituations)
	const currentSituationIndex = useCycler(uniqueSituations ?? [], 10000)

	const customNames: CustomName[] = combinedTile
		.map((tile) => (tile.displayName ? { uuid: tile.uuid, customName: tile.displayName } : null))
		.filter(isNotNullOrUndefined) as CustomName[]

	return {
		displayName: undefined,
		estimatedCalls: departures,
		situations: combinedSituations,
		uniqueSituations: uniqueSituations ?? [],
		currentSituationIndex,
		isLoading: stopPlaceLoading || quaysLoading,
		error: stopPlaceError || quaysError,
		hasData: !!(stopPlaceData?.length || quaysData?.length),
		customNames,
	}
}

function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined
}
