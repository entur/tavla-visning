import { GetQuaysQuery, StopPlaceQuery } from '@/graphql'
import { useQueries, useQuery } from '@/Shared/hooks/useQuery'
import type { BoardTileDB, QuayDB, StopPlaceTileDB } from '@/Shared/types/db-types/boards'
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

interface BaseTileData {
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

export function useQuaysTileData({
	quays,
	whitelistedLines,
	whitelistedTransportModes,
	offset,
	displayName,
	name,
}: BoardTileDB): BaseTileData {
	const hasEmptyWhitelist = quays?.some(
		(q) => !q.whitelistedLines || q.whitelistedLines.length === 0,
	)
	const hasQuays = quays && quays.length > 0

	const computedWhitelistedLines = hasQuays
		? hasEmptyWhitelist
			? undefined
			: [...new Set(quays.flatMap((q) => q.whitelistedLines ?? []))]
		: whitelistedLines

	const { data, isLoading, error } = useQuery(
		GetQuaysQuery,
		{
			quayIds: quays?.map((q) => q.id),
			whitelistedLines: computedWhitelistedLines,
			whitelistedTransportModes,
		},
		{ poll: true, offset: offset ?? 0 },
	)

	const quaySituations = data?.quays?.flatMap((quay) => {
		const stopPlaceSituations = quay?.stopPlace?.situations ?? []
		const quaySituations = quay?.situations ?? []
		return [...stopPlaceSituations, ...quaySituations]
	})

	const departures = (
		data?.quays?.flatMap((quay) => quay?.estimatedCalls).filter(isNotNullOrUndefined) ?? []
	).sort((a, b) => {
		const timeA = new Date(a.expectedDepartureTime ?? a.aimedDepartureTime).getTime()
		const timeB = new Date(b.expectedDepartureTime ?? b.aimedDepartureTime).getTime()
		return timeA - timeB
	})

	const uniqueSituations = getAccumulatedTileSituations(departures, quaySituations)

	const currentSituationIndex = useCycler(quaySituations ?? [], 10000)

	return {
		displayName: displayName ?? name,
		estimatedCalls: departures,
		situations: quaySituations ?? [],
		uniqueSituations: uniqueSituations,
		currentSituationIndex,
		isLoading,
		error,
		hasData: !!(data?.quays && data.quays.length > 0),
	}
}

export function useStopPlaceTileData({
	placeId,
	whitelistedLines,
	whitelistedTransportModes,
	offset,
	displayName,
}: StopPlaceTileDB): BaseTileData {
	const { data, isLoading, error } = useQuery(
		StopPlaceQuery,
		{
			stopPlaceId: placeId,
			whitelistedTransportModes,
			whitelistedLines,
		},
		{ poll: true, offset: offset ?? 0 },
	)

	const uniqueSituations = getAccumulatedTileSituations(
		data?.stopPlace?.estimatedCalls,
		data?.stopPlace?.situations,
	)

	const currentSituationIndex = useCycler(uniqueSituations ?? [], 10000)

	return {
		displayName: displayName ?? data?.stopPlace?.name ?? '',
		estimatedCalls: data?.stopPlace?.estimatedCalls ?? [],
		situations: data?.stopPlace?.situations ?? [],
		uniqueSituations: uniqueSituations ?? [],
		currentSituationIndex,
		isLoading,
		error,
		hasData: !!data?.stopPlace,
	}
}

const isTileWithQuays = (tile: BoardTileDB): tile is BoardTileDB & { quays: QuayDB[] } =>
	!!tile.quays && tile.quays.length > 0

export function useCombinedTileData(combinedTile: BoardTileDB[]): BaseTileData {
	const quaysQueries = combinedTile.filter(isTileWithQuays).map((tile) => ({
		query: GetQuaysQuery,
		variables: {
			quayIds: tile.quays?.map((q) => q.id) ?? [],
			whitelistedLines: tile.whitelistedLines,
			whitelistedTransportModes: tile.whitelistedTransportModes,
		},
		options: { poll: true, offset: tile.offset },
	}))

	const stopPlaceQueries = combinedTile
		.filter((tile) => !isTileWithQuays(tile)) // If it's not a quays tile, treat it as a stopPlace
		.map((tile) => ({
			query: StopPlaceQuery,
			variables: {
				stopPlaceId: tile.placeId,
				whitelistedTransportModes: tile.whitelistedTransportModes,
				whitelistedLines: tile.whitelistedLines,
			},
			options: { offset: tile.offset, poll: true },
		}))

	const {
		data: stopPlaceData,
		error: stopPlaceError,
		isLoading: stopPlaceLoading,
	} = useQueries(stopPlaceQueries)

	const { data: quaysData, error: quaysError, isLoading: quaysLoading } = useQueries(quaysQueries)

	// Combine all estimated calls and sort them
	const estimatedCalls = [
		...(stopPlaceData?.flatMap((data, index) => {
			const tile = combinedTile.filter((t) => !isTileWithQuays(t))[index]
			return (data.stopPlace?.estimatedCalls ?? []).map((call) => ({
				...call,
				tileUuid: tile?.uuid,
			}))
		}) ?? []),
		...(quaysData?.flatMap((data, index) => {
			const tile = combinedTile.filter(isTileWithQuays)[index]
			return data?.quays?.flatMap((quay) =>
				(quay?.estimatedCalls ?? []).map((call) => ({
					...call,
					tileUuid: tile?.uuid,
				})),
			)
		}) ?? []),
	]

	const sortedEstimatedCalls = estimatedCalls.sort((a, b) => {
		const timeA = new Date(a.expectedDepartureTime ?? a.aimedDepartureTime).getTime()
		const timeB = new Date(b.expectedDepartureTime ?? b.aimedDepartureTime).getTime()
		return (Number.isNaN(timeA) ? Infinity : timeA) - (Number.isNaN(timeB) ? Infinity : timeB)
	})

	// Combine situations with origin information
	const situations: TSituationWithOrigin[] = [
		...(stopPlaceData?.flatMap((data) => {
			const origin = data?.stopPlace?.name ?? ''
			const situations = data?.stopPlace?.situations ?? []
			return situations.map((situation) => ({
				origin,
				...situation,
			}))
		}) ?? []),
		...(quaysData?.flatMap((data) =>
			data?.quays?.flatMap((quay) => {
				const origin = quay?.name ?? ''
				const situations = quay?.situations ?? []
				return situations.map((situation) => ({
					origin,
					...situation,
				}))
			}),
		) ?? []),
	]

	const combinedSituations: TSituationWithOrigin[] = combineSituations(situations)

	const uniqueSituations = getAccumulatedTileSituations(sortedEstimatedCalls, combinedSituations)

	const currentSituationIndex = useCycler(uniqueSituations ?? [], 10000)

	const customNames: CustomName[] = combinedTile
		.map((tile) => (tile.displayName ? { uuid: tile.uuid, customName: tile.displayName } : null))
		.filter(isNotNullOrUndefined) as CustomName[]

	return {
		displayName: undefined,
		estimatedCalls: sortedEstimatedCalls,
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
