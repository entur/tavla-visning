import { GetQuayQuery, StopPlaceQuery } from '@/graphql'
import { useQueries, useQuery } from '@/Shared/hooks/useQuery'
import type { LineWithDirectionDB, TileDB } from '@/Shared/types/db-types/boards'
import type { TDepartureFragment, TSituationFragment } from '@/types/graphql-schema'
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

const ARRIVAL_HOLD_TIME_MINUTES = -5
const DEFAULT_NUMBER_OF_DEPARTURES = 20
const DIRECTION_NUMBER_OF_DEPARTURES = 50
const DIRECTION_DEPARTURES_PER_LINE_AND_DESTINATION = 10

export function useQuaysTileData(
	{ quays, offset, displayName, name }: TileDB,
	isArrivals?: boolean,
): TileData {
	const hasSelectedQuays = !!quays && quays.length > 0

	const quayQueries = hasSelectedQuays
		? quays.map((q) => ({
				query: GetQuayQuery,
				variables: {
					quayId: q.id,
					whitelistedLines: q.whitelistedLines,
					arrivalDeparture: isArrivals ? ('arrivals' as const) : undefined,
				},
				options: {
					poll: true,
					offset: (offset ?? 0) + (isArrivals ? ARRIVAL_HOLD_TIME_MINUTES : 0),
				},
			}))
		: []

	const { data: quaysData, isLoading: quaysLoading, error: quaysError } = useQueries(quayQueries)

	const quayResults = quaysData?.map((d) => d.quay).filter(isNotNullOrUndefined) ?? []

	const quaysSituations = quayResults.flatMap((quay) => {
		const spSituations = quay.stopPlace?.situations ?? []
		const qSituations = quay.situations ?? []
		return [...spSituations, ...qSituations]
	})

	const departures = quayResults
		.flatMap((quay) => quay.estimatedCalls)
		.filter(isNotNullOrUndefined)
		.sort((a, b) => {
			const timeA = isArrivals ? a.expectedArrivalTime : a.expectedDepartureTime
			const timeB = isArrivals ? b.expectedArrivalTime : b.expectedDepartureTime
			return new Date(timeA).getTime() - new Date(timeB).getTime()
		})

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
	{ stopPlaceId, whitelistedLines, linesWithDirection, offset, displayName, name }: TileDB,
	isArrivals?: boolean,
): TileData {
	const usesLinesWithDirection = linesWithDirection !== undefined

	const {
		data: stopPlaceData,
		isLoading: stopPlaceLoading,
		error: stopPlaceError,
	} = useQuery(
		StopPlaceQuery,
		{
			stopPlaceId: stopPlaceId,
			whitelistedLines: usesLinesWithDirection
				? whitelistedLinesFromDirection(linesWithDirection)
				: whitelistedLines,
			numberOfDepartures: usesLinesWithDirection
				? DIRECTION_NUMBER_OF_DEPARTURES
				: DEFAULT_NUMBER_OF_DEPARTURES,
			numberOfDeparturesPerLineAndDestinationDisplay: usesLinesWithDirection
				? DIRECTION_DEPARTURES_PER_LINE_AND_DESTINATION
				: undefined,
			arrivalDeparture: isArrivals ? ('arrivals' as const) : undefined,
		},
		{ poll: true, offset: (offset ?? 0) + (isArrivals ? ARRIVAL_HOLD_TIME_MINUTES : 0) },
	)

	const filteredCalls = (stopPlaceData?.stopPlace?.estimatedCalls ?? []).filter((dep) =>
		shouldIncludeByLineDirection(dep, linesWithDirection ?? []),
	)

	const stopPlaceSituations = getAccumulatedTileSituations(
		filteredCalls,
		stopPlaceData?.stopPlace?.situations,
	)

	const currentSituationIndex = useCycler(stopPlaceSituations ?? [], 10000)

	return {
		displayName: (displayName ?? name) || stopPlaceData?.stopPlace?.name,
		estimatedCalls: filteredCalls,
		situations: stopPlaceData?.stopPlace?.situations ?? [],
		uniqueSituations: stopPlaceSituations ?? [],
		currentSituationIndex,
		isLoading: stopPlaceLoading,
		error: stopPlaceError,
		hasData: !!stopPlaceData?.stopPlace,
	}
}

export function useCombinedTileData(combinedTile: TileDB[], isArrivals?: boolean): TileData {
	const arrivalDeparture = isArrivals ? ('arrivals' as const) : undefined
	const holdTimeOffset = isArrivals ? ARRIVAL_HOLD_TIME_MINUTES : 0

	const usesLinesWithDirection = (tile: TileDB): boolean => tile.linesWithDirection !== undefined
	const tileHasSelectedQuays = (tile: TileDB): boolean =>
		!usesLinesWithDirection(tile) && tile.quays.length > 0

	const quayQueryMeta = combinedTile.filter(tileHasSelectedQuays).flatMap((tile) =>
		tile.quays.map((q) => ({
			query: GetQuayQuery,
			variables: {
				quayId: q.id,
				whitelistedLines: q.whitelistedLines,
				arrivalDeparture,
			},
			options: { poll: true, offset: (tile.offset ?? 0) + holdTimeOffset },
			tileUuid: tile.uuid,
		})),
	)

	const quayQueries = quayQueryMeta.map(({ tileUuid: _, ...q }) => q)

	const stopPlaceQueryMeta = combinedTile
		.filter((tile) => !tileHasSelectedQuays(tile))
		.map((tile) => ({
			query: StopPlaceQuery,
			variables: {
				stopPlaceId: tile.stopPlaceId,
				whitelistedLines: usesLinesWithDirection(tile)
					? whitelistedLinesFromDirection(tile.linesWithDirection)
					: tile.whitelistedLines,
				numberOfDepartures: usesLinesWithDirection(tile)
					? DIRECTION_NUMBER_OF_DEPARTURES
					: DEFAULT_NUMBER_OF_DEPARTURES,
				numberOfDeparturesPerLineAndDestinationDisplay: usesLinesWithDirection(tile)
					? DIRECTION_DEPARTURES_PER_LINE_AND_DESTINATION
					: undefined,
				arrivalDeparture,
			},
			options: { offset: (tile.offset ?? 0) + holdTimeOffset, poll: true },
			tile,
		}))

	const stopPlaceQueries = stopPlaceQueryMeta.map(({ tile: _, ...q }) => q)

	const {
		data: stopPlaceData,
		error: stopPlaceError,
		isLoading: stopPlaceLoading,
	} = useQueries(stopPlaceQueries)

	const { data: quaysData, error: quaysError, isLoading: quaysLoading } = useQueries(quayQueries)

	const estimatedCalls = [
		...(stopPlaceData?.flatMap((data, index) => {
			const tile = stopPlaceQueryMeta[index]?.tile

			return (data.stopPlace?.estimatedCalls ?? [])
				.filter((call) => shouldIncludeByLineDirection(call, tile?.linesWithDirection ?? []))
				.map((call) => ({
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

	const departures = (estimatedCalls.filter(isNotNullOrUndefined) ?? []).sort((a, b) => {
		const timeA = isArrivals ? a.expectedArrivalTime : a.expectedDepartureTime
		const timeB = isArrivals ? b.expectedArrivalTime : b.expectedDepartureTime
		return new Date(timeA).getTime() - new Date(timeB).getTime()
	})

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

export function shouldIncludeByLineDirection(
	departure: TDepartureFragment,
	linesWithDirection: LineWithDirectionDB[],
): boolean {
	const noLinesSelected = linesWithDirection.length === 0

	if (noLinesSelected) {
		// No lines selected → show all departures
		return true
	}

	const departureLineId = departure.serviceJourney?.line?.id
	const matchingLine = linesWithDirection.find((line) => line.lineId === departureLineId)

	if (!matchingLine) {
		//Line not selected → hide the departure
		return false
	}

	if (matchingLine.frontTexts.length === 0) {
		//Line matches, but no front texts are selected → show all directions for this line
		return true
	}

	const departureFrontText = departure.destinationDisplay?.frontText
	if (departureFrontText == null) {
		//Departure has no front text → show it, we don't want to hide departures that are missing data
		return true
	}

	const frontTextMatches = matchingLine.frontTexts.includes(departureFrontText)

	//Line matches, and front text matches → show the departure
	//Line matches, but front text does not match → hide the departure
	return frontTextMatches
}

/**
 * @param linesWithDirection
 * @returns A list of unique lineIds from the linesWithDirection array, or undefined if the array is empty.
 */
function whitelistedLinesFromDirection(
	linesWithDirection: LineWithDirectionDB[] | undefined,
): string[] | undefined {
	const lineIds = [...new Set((linesWithDirection ?? []).map((l) => l.lineId))]
	return lineIds.length > 0 ? lineIds : undefined
}

function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined
}
