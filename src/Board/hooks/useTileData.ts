import { useEffect, useState } from 'react'
import { useBoardContext } from '@/Board/context'
import { GetQuayQuery, StopPlaceQuery } from '@/graphql'
import { useQueries, useQuery } from '@/Shared/hooks/useQuery'
import { useServerNow } from '@/Shared/hooks/useServerNow'
import type { FilterQuayDB, QuayDB, TileDB } from '@/Shared/types/db-types/boards'
import { getServerNow } from '@/Shared/utils/serverTime'
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
	lastUpdated: number | null
}

export type CacheStatus = {
	showingCachedData: boolean
	lastUpdated: number | null
}

export function getCacheStatus(tileData: TileData): CacheStatus {
	return {
		showingCachedData: !!tileData.error && tileData.hasData && tileData.estimatedCalls.length > 0,
		lastUpdated: tileData.lastUpdated ?? null,
	}
}

function useLastSuccessfulUpdate(
	hasError: boolean,
	hasData: boolean,
	...dataRefs: unknown[]
): number | null {
	const [lastUpdated, setLastUpdated] = useState<number | null>(null)
	useEffect(() => {
		if (!hasError && hasData) {
			setLastUpdated(getServerNow())
		}
	}, [hasError, hasData, ...dataRefs])
	return lastUpdated
}

export type TileDataSource = 'quays' | 'stopPlace'

const ARRIVAL_HOLD_TIME_MINUTES = -5
const DEFAULT_NUMBER_OF_DEPARTURES = 20

/**
 * Filtrerer bort avganger som allerede har passert gjeldende tidspunkt.
 *
 * For ankomster holdes avgangen synlig i noen minutter etter forventet ankomsttidspunkt,
 * se `ARRIVAL_HOLD_TIME_MINUTES`.
 *
 * @param departures Avganger som skal filtreres
 * @param now Gjeldende tidspunkt (ms) avgangene filtreres mot
 * @param isArrivals Om det er ankomsttid (true) eller avgangstid (false) som skal vurderes
 * @returns Avgangene som skal vises på Tavla
 */
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
 * Et quaysFilter med 0 valgte quays betraktes som et helt stoppested (stopPlace), ikke quays.
 *
 * @param tile Tile (eller utdrag av felter) datakilden skal bestemmes for
 * @returns 'quays' hvis det finnes konkrete quays å spørre mot, ellers 'stopPlace'
 */
export function resolveTileDataSource(tile: Pick<TileDB, 'filter'>): TileDataSource {
	// Hvis det er 0 valgte quays, er filteret å betrakte som et helt stoppested
	return tile.filter?.type === 'quaysFilter' && tile.filter.quays.length > 0 ? 'quays' : 'stopPlace'
}

/**
 * Henter listen med quays en tile skal spørres mot.
 *
 * @param tile Tile (eller utdrag av felter) quays skal hentes for
 * @returns Quays fra filter.quays hvis satt, ellers tomt array
 */
export function getQuaysToQuery(tile: Pick<TileDB, 'filter'>): QuayDB[] | FilterQuayDB[] {
	if (tile.filter?.type === 'quaysFilter') return tile.filter.quays
	return []
}

/**
 * Henter valgte linjer for et quay, uavhengig av om det er et vanlig QuayDB eller et FilterQuayDB.
 *
 * De to typene bruker ulike feltnavn for samme konsept (selectedLines vs. whitelistedLines),
 * så funksjonen normaliserer dette til ett felles resultat.
 *
 * @param quay Quay (QuayDB eller FilterQuayDB) linjer skal hentes for
 * @returns Liste med linje-IDer valgt for quayet
 */
function getQuaySelectedLines(quay: QuayDB | FilterQuayDB): string[] {
	return 'selectedLines' in quay ? quay.selectedLines : quay.whitelistedLines
}

/**
 * Henter linje- og transportmodusfilter for en tile med stopPlace-filter.
 *
 * @param tile Tile (eller utdrag av felter) filteret skal hentes fra
 * @returns Valgte linjer og transportmoduser hvis tile har et stopPlaceFilter, ellers et tomt objekt
 */
export function getStopPlaceFilterValues(tile: Pick<TileDB, 'filter'>): {
	selectedLines?: string[]
	selectedTransportModes?: TTransportMode[]
} {
	if (tile.filter?.type === 'stopPlaceFilter') {
		return {
			selectedLines: tile.filter.selectedLines,
			selectedTransportModes: tile.filter.selectedTransportModes,
		}
	}
	return {}
}

/**
 * Bygger filter for avganger som skal hentes basert på valgte linjer og transportmoduser.
 *
 * Oppretter et array med et filterobjekt som inneholder et array med valgte linjer og et array med valgte transportmoduser.
 * Det benyttes OR-logikk mellom linjer og transportmoduser siden de er i samme select-array.
 *
 * Struktur på filterobjektet som returneres:
 * [
 *   {
 *     select: [
 *       { lines: string[] },
 *       { transportModes: { transportMode: TTransportMode }[] }
 *     ]
 *   }
 * ]
 *
 * @param selectedLines Spesifikke linjer som skal inkluderes i filteret
 * @param selectedTransportModes Transportmoduser som skal inkluderes i filteret
 * @returns undefined hvis ingen filter er satt, ellers et array med filterobjekter
 */
export function buildEstimatedCallFilters(
	selectedLines?: string[],
	selectedTransportModes?: TTransportMode[],
): TEstimatedCallFilterInput[] | undefined {
	const lineFilter = selectedLines?.length ? { lines: selectedLines } : undefined

	const modeFilter = selectedTransportModes?.length
		? { transportModes: selectedTransportModes.map((transportMode) => ({ transportMode })) }
		: undefined

	const select = [lineFilter, modeFilter].filter(isNotNullOrUndefined)

	return select.length > 0 ? [{ select }] : undefined
}

/**
 * Henter avgangsdata for en tile som peker på én eller flere konkrete quays.
 *
 * Spør opp hvert quay individuelt via `getQuay`-spørringen, slår sammen avganger og situasjoner
 * på tvers av quayene, filtrerer bort passerte avganger og sorterer resterende etter tid.
 *
 * @param tile Tile-konfigurasjonen (filter, quays, offset, navn) avgangsdata skal hentes for
 * @param isArrivals Om visningen gjelder ankomster (true) eller avganger (false/undefined)
 * @returns Samlet avgangs- og situasjonsdata for tilen, inkludert lasting-/feiltilstand
 */
export function useQuaysTileData(
	{ filter, offset, displayName, name }: TileDB,
	isArrivals?: boolean,
): TileData {
	const { boardId } = useBoardContext()
	const now = useServerNow()
	const quaysToQuery = getQuaysToQuery({ filter })
	const hasSelectedQuays = quaysToQuery.length > 0

	const quayQueries = hasSelectedQuays
		? quaysToQuery.map((q) => ({
				query: GetQuayQuery,
				variables: {
					quayId: q.id,
					filters: buildEstimatedCallFilters(getQuaySelectedLines(q)),
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

	const quayResults = quaysData?.map((d) => d?.quay).filter(isNotNullOrUndefined) ?? []

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
	const lastUpdated = useLastSuccessfulUpdate(!!quaysError, quayResults.length > 0, quaysData)

	return {
		displayName: (displayName ?? name) || quayResults[0]?.name,
		estimatedCalls: departures,
		situations: quaysSituations ?? [],
		uniqueSituations: accumulatedQuaysSituations,
		currentSituationIndex: quaysSituationIndex,
		isLoading: quaysLoading,
		error: quaysError,
		hasData: quayResults.length > 0,
		lastUpdated,
	}
}

/**
 * Henter avgangsdata for en tile som viser et helt stoppested.
 *
 * Spør opp stoppestedet via `StopPlace`-spørringen, filtrerer bort passerte avganger, og kombinerer
 * situasjoner fra stoppestedet med situasjoner fra eventuelt valgte quays.
 *
 * @param tile Tile-data som avgangsdata skal hentes for
 * @param isArrivals Om visningen gjelder ankomster (true) eller avganger (false)
 * @returns Samlet avgangs- og situasjonsdata for tilen, inkludert lasting-/feiltilstand
 */
export function useStopPlaceTileData(
	{ stopPlaceId, filter, offset, displayName, name }: TileDB,
	isArrivals?: boolean,
): TileData {
	const { language, boardId } = useBoardContext()
	const now = useServerNow()
	const { selectedLines, selectedTransportModes } = getStopPlaceFilterValues({ filter })

	const {
		data: stopPlaceData,
		isLoading: stopPlaceLoading,
		error: stopPlaceError,
	} = useQuery(
		StopPlaceQuery,
		{
			stopPlaceId: stopPlaceId,
			filters: buildEstimatedCallFilters(selectedLines, selectedTransportModes),
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

	const relevantQuays = (stopPlaceData?.stopPlace?.quays ?? []).filter(isNotNullOrUndefined)

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

	const lastUpdated = useLastSuccessfulUpdate(
		!!stopPlaceError,
		!!stopPlaceData?.stopPlace,
		stopPlaceData,
	)

	return {
		displayName: (displayName ?? name) || stopPlaceData?.stopPlace?.name,
		estimatedCalls: filteredCalls,
		situations,
		uniqueSituations: stopPlaceSituations ?? [],
		currentSituationIndex,
		isLoading: stopPlaceLoading,
		error: stopPlaceError,
		hasData: !!stopPlaceData?.stopPlace,
		lastUpdated,
	}
}

/**
 * Henter og slår sammen avgangsdata for flere tiles til én kombinert visning (CombinedTile).
 *
 * Resultatene fra alle tilene slås sammen, sorteres på tid og filtreres for passerte avganger,
 * mens situasjoner kombineres og dedupliseres på tvers av tilene.
 *
 * @param combinedTile Listen med tiles som skal kombineres i én visning
 * @param isArrivals Om visningen gjelder ankomster (true) eller avganger (false)
 * @returns Samlet avgangs- og situasjonsdata for den kombinerte tilen
 */
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
				filters: buildEstimatedCallFilters(getQuaySelectedLines(q)),
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
			const { selectedLines, selectedTransportModes } = getStopPlaceFilterValues(tile)
			return {
				query: StopPlaceQuery,
				variables: {
					stopPlaceId: tile.stopPlaceId,
					filters: buildEstimatedCallFilters(selectedLines, selectedTransportModes),
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

	const lastUpdated = useLastSuccessfulUpdate(
		!!(stopPlaceError || quaysError),
		!!(stopPlaceData?.length || quaysData?.length),
		stopPlaceData,
		quaysData,
	)

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
		lastUpdated,
	}
}

/**
 * Typesikkert filter-predikat som fjerner null og undefined fra et array.
 *
 * @param value Verdien som sjekkes
 * @returns true hvis verdien verken er null eller undefined
 */
function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined
}
