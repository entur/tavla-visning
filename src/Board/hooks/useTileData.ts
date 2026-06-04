import { GetQuayQuery, StopPlaceQuery } from '@/graphql'
import { useQueries, useQuery } from '@/Shared/hooks/useQuery'
import type { TileDB } from '@/Shared/types/db-types/boards'
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

const ARRIVAL_LINGER_MINUTES = -5

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
				options: { poll: true, offset: (offset ?? 0) + (isArrivals ? ARRIVAL_LINGER_MINUTES : 0) },
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
	{ stopPlaceId, whitelistedLines, offset, displayName, name }: TileDB,
	isArrivals?: boolean,
): TileData {
	const {
		data: stopPlaceData,
		isLoading: stopPlaceLoading,
		error: stopPlaceError,
	} = useQuery(
		StopPlaceQuery,
		{
			stopPlaceId: stopPlaceId,
			whitelistedLines, // --- Support for old boards with  whitelisted lines. This is not used anymore, but breaks if not supported for legacy boards.
			arrivalDeparture: isArrivals ? ('arrivals' as const) : undefined,
		},
		{ poll: true, offset: (offset ?? 0) + (isArrivals ? ARRIVAL_LINGER_MINUTES : 0) },
	)

	const stopPlaceSituations = getAccumulatedTileSituations(
		stopPlaceData?.stopPlace?.estimatedCalls,
		stopPlaceData?.stopPlace?.situations,
	)

	const currentSituationIndex = useCycler(stopPlaceSituations ?? [], 10000)

	return {
		displayName: (displayName ?? name) || stopPlaceData?.stopPlace?.name,
		estimatedCalls: stopPlaceData?.stopPlace?.estimatedCalls ?? [],
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
	const lingerOffset = isArrivals ? ARRIVAL_LINGER_MINUTES : 0
	const tileHasSelectedQuays = (tile: TileDB): boolean => tile.quays.length > 0

	const quayQueryMeta = combinedTile.filter(tileHasSelectedQuays).flatMap((tile) =>
		tile.quays.map((q) => ({
			query: GetQuayQuery,
			variables: {
				quayId: q.id,
				whitelistedLines: q.whitelistedLines,
				arrivalDeparture,
			},
			options: { poll: true, offset: (tile.offset ?? 0) + lingerOffset },
			tileUuid: tile.uuid,
		})),
	)

	const quayQueries = quayQueryMeta.map(({ tileUuid: _, ...q }) => q)

	const stopPlaceQueries = combinedTile
		.filter((tile) => !tileHasSelectedQuays(tile))
		.map((tile) => ({
			query: StopPlaceQuery,
			variables: {
				stopPlaceId: tile.stopPlaceId,
				whitelistedLines: tile.whitelistedLines,
				arrivalDeparture,
			},
			options: { offset: (tile.offset ?? 0) + lingerOffset, poll: true },
		}))

	const {
		data: stopPlaceData,
		error: stopPlaceError,
		isLoading: stopPlaceLoading,
	} = useQueries(stopPlaceQueries)

	const { data: quaysData, error: quaysError, isLoading: quaysLoading } = useQueries(quayQueries)

	const estimatedCalls = [
		...(stopPlaceData?.flatMap((data, index) => {
			const tile = combinedTile.filter((t) => !tileHasSelectedQuays(t))[index]
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

function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined
}
