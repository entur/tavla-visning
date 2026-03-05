import { GetQuaysQuery, StopPlaceQuery } from '@/graphql'
import { useQueries, useQuery } from '@/Shared/hooks/useQuery'
import type { BoardTileDB, QuayDB } from '@/Shared/types/db-types/boards'
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
	stopPlaceId,
	quays,
	whitelistedLines,
	whitelistedTransportModes,
	offset,
	displayName,
	name,
}: BoardTileDB): BaseTileData {
	const hasSelectedQuays = !!quays && quays.length > 0
	const mergedQuayLines = hasSelectedQuays
		? [...new Set(quays.flatMap((q) => q.whitelistedLines ?? []))]
		: undefined

	// When quays is empty (all quays selected), use StopPlace query with stopPlaceId
	const {
		data: stopPlaceData,
		isLoading: stopPlaceLoading,
		error: stopPlaceError,
	} = useQuery(
		StopPlaceQuery,
		{
			stopPlaceId: stopPlaceId,
			whitelistedTransportModes,
			whitelistedLines,
		},
		{ poll: true, offset: offset ?? 0, enabled: !hasSelectedQuays },
	)

	// When specific quays are selected, use GetQuays query with per-quay whitelisted lines
	const {
		data: quaysData,
		isLoading: quaysLoading,
		error: quaysError,
	} = useQuery(
		GetQuaysQuery,
		{
			quayIds: hasSelectedQuays ? quays.map((q) => q.id) : [],
			whitelistedLines: mergedQuayLines?.length ? mergedQuayLines : undefined,
			whitelistedTransportModes,
		},
		{ poll: true, offset: offset ?? 0, enabled: hasSelectedQuays },
	)

	// Derive StopPlace-based data (all quays selected)
	const stopPlaceSituations = getAccumulatedTileSituations(
		stopPlaceData?.stopPlace?.estimatedCalls,
		stopPlaceData?.stopPlace?.situations,
	)

	// Derive GetQuays-based data (specific quays selected)
	const quaySituations = quaysData?.quays?.flatMap((quay) => {
		const spSituations = quay?.stopPlace?.situations ?? []
		const qSituations = quay?.situations ?? []
		return [...spSituations, ...qSituations]
	})

	const departures = (
		quaysData?.quays?.flatMap((quay) => quay?.estimatedCalls).filter(isNotNullOrUndefined) ?? []
	).sort((a, b) => {
		const timeA = new Date(a.expectedDepartureTime).getTime()
		const timeB = new Date(b.expectedDepartureTime).getTime()
		return timeA - timeB
	})

	const quaysUniqueSituations = getAccumulatedTileSituations(departures, quaySituations)

	// Pick the active data based on whether specific quays are selected
	const activeSituations = hasSelectedQuays ? quaySituations : stopPlaceData?.stopPlace?.situations
	const currentSituationIndex = useCycler(activeSituations ?? [], 10000)

	if (!hasSelectedQuays) {
		return {
			displayName: displayName ?? name ?? stopPlaceData?.stopPlace?.name ?? '',
			estimatedCalls: stopPlaceData?.stopPlace?.estimatedCalls ?? [],
			situations: stopPlaceData?.stopPlace?.situations ?? [],
			uniqueSituations: stopPlaceSituations ?? [],
			currentSituationIndex,
			isLoading: stopPlaceLoading,
			error: stopPlaceError,
			hasData: !!stopPlaceData?.stopPlace,
		}
	}

	return {
		displayName: displayName ?? name,
		estimatedCalls: departures,
		situations: quaySituations ?? [],
		uniqueSituations: quaysUniqueSituations,
		currentSituationIndex,
		isLoading: quaysLoading,
		error: quaysError,
		hasData: !!quaysData?.quays,
	}
}

export function useStopPlaceTileData({
	stopPlaceId,
	whitelistedLines,
	whitelistedTransportModes,
	offset,
	displayName,
}: BoardTileDB): BaseTileData {
	const { data, isLoading, error } = useQuery(
		StopPlaceQuery,
		{
			stopPlaceId: stopPlaceId,
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

const hasStopPlaceId = (tile: BoardTileDB): tile is BoardTileDB & { stopPlaceId: string } =>
	!!tile.stopPlaceId

const tileHasSelectedQuays = (tile: BoardTileDB): tile is BoardTileDB & { quays: QuayDB[] } =>
	!!tile.quays && tile.quays.length > 0

export function useCombinedTileData(combinedTile: BoardTileDB[]): BaseTileData {
	// Tiles with stopPlaceId and selected quays: use GetQuays with per-quay lines
	const quaysQueries = combinedTile
		.filter(hasStopPlaceId)
		.filter(tileHasSelectedQuays)
		.map((tile) => {
			const mergedQuayLines = [
				...new Set(tile.quays?.flatMap((q) => q.whitelistedLines ?? []) ?? []),
			]
			return {
				query: GetQuaysQuery,
				variables: {
					quayIds: tile.quays?.map((q) => q.id) ?? [],
					whitelistedLines: mergedQuayLines.length > 0 ? mergedQuayLines : undefined,
					whitelistedTransportModes: tile.whitelistedTransportModes,
				},
				options: { poll: true, offset: tile.offset },
			}
		})

	// Tiles with stopPlaceId but no selected quays (all quays): use StopPlace query
	const stopPlaceFromQuaysTileQueries = combinedTile
		.filter(hasStopPlaceId)
		.filter((tile) => !tileHasSelectedQuays(tile))
		.map((tile) => ({
			query: StopPlaceQuery,
			variables: {
				stopPlaceId: tile.stopPlaceId,
				whitelistedTransportModes: tile.whitelistedTransportModes,
				whitelistedLines: tile.whitelistedLines,
			},
			options: { offset: tile.offset, poll: true },
		}))

	const {
		data: stopPlaceFromQuaysTileData,
		error: stopPlaceFromQuaysTileError,
		isLoading: stopPlaceFromQuaysTileLoading,
	} = useQueries(stopPlaceFromQuaysTileQueries)

	const { data: quaysData, error: quaysError, isLoading: quaysLoading } = useQueries(quaysQueries)

	// Combine all estimated calls and sort them
	const estimatedCalls = [
		...(stopPlaceFromQuaysTileData?.flatMap((data, index) => {
			const tile = combinedTile.filter(hasStopPlaceId).filter((t) => !tileHasSelectedQuays(t))[
				index
			]
			return (data.stopPlace?.estimatedCalls ?? []).map((call) => ({
				...call,
				tileUuid: tile?.uuid,
			}))
		}) ?? []),
		...(quaysData?.flatMap((data, index) => {
			const tile = combinedTile.filter(hasStopPlaceId).filter(tileHasSelectedQuays)[index]
			return data?.quays?.flatMap((quay) =>
				(quay?.estimatedCalls ?? []).map((call) => ({
					...call,
					tileUuid: tile?.uuid,
				})),
			)
		}) ?? []),
	]

	const sortedEstimatedCalls = estimatedCalls.sort((a, b) => {
		const timeA = new Date(a.expectedDepartureTime).getTime()
		const timeB = new Date(b.expectedDepartureTime).getTime()
		return (Number.isNaN(timeA) ? Infinity : timeA) - (Number.isNaN(timeB) ? Infinity : timeB)
	})

	// Combine situations with origin information
	const situations: TSituationWithOrigin[] = [
		...(stopPlaceFromQuaysTileData?.flatMap((data) => {
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
		isLoading: stopPlaceFromQuaysTileLoading || quaysLoading,
		error: stopPlaceFromQuaysTileError || quaysError,
		hasData: !!(stopPlaceFromQuaysTileData?.length || quaysData?.length),
		customNames,
	}
}
function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined
}
