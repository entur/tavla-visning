import { GetQuayQuery, GetQuaysQuery, StopPlaceQuery } from '@/graphql'
import { useQueries, useQuery } from '@/Shared/hooks/useQuery'
import type {
	BoardTileDB,
	QuayDB,
	QuayTileDB,
	StopPlaceTileDB,
} from '@/Shared/types/db-types/boards'
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

export function useQuayTileData({
	placeId,
	whitelistedLines,
	whitelistedTransportModes,
	offset,
	displayName,
}: QuayTileDB): BaseTileData {
	const { data, isLoading, error } = useQuery(
		GetQuayQuery,
		{
			quayId: placeId,
			whitelistedLines,
			whitelistedTransportModes,
		},
		{ poll: true, offset: offset ?? 0 },
	)

	const combinedStopPlaceQuaySituations: TSituationFragment[] = combineSituations([
		...(data?.quay?.stopPlace?.situations ?? []),
		...(data?.quay?.situations ?? []),
	])

	const uniqueSituations = getAccumulatedTileSituations(
		data?.quay?.estimatedCalls,
		combinedStopPlaceQuaySituations,
	)

	const currentSituationIndex = useCycler(uniqueSituations ?? [], 10000)

	const heading: string = [data?.quay?.name, data?.quay?.publicCode]
		.filter(isNotNullOrUndefined)
		.join(' ')

	return {
		displayName: displayName ?? heading,
		estimatedCalls: data?.quay?.estimatedCalls ?? [],
		situations: combinedStopPlaceQuaySituations,
		uniqueSituations: uniqueSituations ?? [],
		currentSituationIndex,
		isLoading,
		error,
		hasData: !!data?.quay,
	}
}

export function useQuaysTileData({
	quays,
	whitelistedLines,
	whitelistedTransportModes,
	offset,
	displayName,
	name,
}: BoardTileDB): BaseTileData {
	const { data, isLoading, error } = useQuery(
		GetQuaysQuery,
		{
			quayIds: quays?.map((q) => q.id),
			whitelistedLines,
			whitelistedTransportModes,
		},
		{ poll: true, offset: offset ?? 0 },
	)

	const quaySituations = data?.quays?.flatMap((quay) => {
		const stopPlaceSituations = quay?.stopPlace?.situations ?? []
		const quaySituations = quay?.situations ?? []
		return [...stopPlaceSituations, ...quaySituations]
	})

	const departures =
		data?.quays?.flatMap((quay) => quay?.estimatedCalls).filter(isNotNullOrUndefined) ?? []

	const uniqueSituations = getAccumulatedTileSituations(departures, quaySituations)

	const currentSituationIndex = useCycler(quaySituations ?? [], 10000)

	return {
		displayName: displayName ?? name,
		estimatedCalls:
			data?.quays?.flatMap((quay) => quay?.estimatedCalls).filter(isNotNullOrUndefined) ?? [],
		situations: quaySituations ?? [],
		uniqueSituations: uniqueSituations,
		currentSituationIndex,
		isLoading,
		error,
		hasData: !!data?.quays,
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

	const quayQueries = combinedTile
		.filter(({ type }) => type === 'quay')
		.filter((tile) => !isTileWithQuays(tile))
		.map((tile) => ({
			query: GetQuayQuery,
			variables: {
				quayId: tile.placeId,
				whitelistedTransportModes: tile.whitelistedTransportModes,
				whitelistedLines: tile.whitelistedLines,
			},
			options: { offset: tile.offset, poll: true },
		}))

	const stopPlaceQueries = combinedTile
		.filter(({ type }) => type === 'stop_place')
		.filter((tile) => !isTileWithQuays(tile))
		.map((tile) => ({
			query: StopPlaceQuery,
			variables: {
				stopPlaceId: tile.placeId,
				whitelistedTransportModes: tile.whitelistedTransportModes,
				whitelistedLines: tile.whitelistedLines,
			},
			options: { offset: tile.offset, poll: true },
		}))

	const { data: quayData, error: quayError, isLoading: quayLoading } = useQueries(quayQueries)

	const {
		data: stopPlaceData,
		error: stopPlaceError,
		isLoading: stopPlaceLoading,
	} = useQueries(stopPlaceQueries)

	const { data: quaysData, error: quaysError, isLoading: quaysLoading } = useQueries(quaysQueries)

	// Combine all estimated calls and sort them
	const estimatedCalls = [
		...(stopPlaceData?.flatMap((data, index) => {
			const tile = combinedTile.filter((t) => t.type === 'stop_place')[index]
			return (data.stopPlace?.estimatedCalls ?? []).map((call) => ({
				...call,
				tileUuid: tile?.uuid,
			}))
		}) ?? []),
		...(quayData?.flatMap((data, index) => {
			const tile = combinedTile.filter((t) => t.type === 'quay')[index]
			return (data.quay?.estimatedCalls ?? []).map((call) => ({
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
		const timeA = new Date(a.expectedDepartureTime).getTime()
		const timeB = new Date(b.expectedDepartureTime).getTime()
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
		...(quayData?.flatMap((data) => {
			const origin = data.quay?.name ?? ''
			const situations = data?.quay?.stopPlace?.situations ?? []
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
		isLoading: quayLoading || stopPlaceLoading || quaysLoading,
		error: quayError || stopPlaceError || quaysError,
		hasData: !!(quayData?.length || stopPlaceData?.length),
		customNames,
	}
}
function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined
}
