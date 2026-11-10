import { TableHeader } from '@board/scenarios/Table/components/TableHeader'
import { Loader } from '@entur/loader'
import { Tile, type TileVariants } from '@src/Shared/components/Tile'
import { type ReactNode, useEffect } from 'react'
import { useBoardContext } from '@/Board/context'
import type { CustomName } from '@/Board/hooks/useTileData'
import type { TileSituation } from '@/Board/scenarios/Board/utils'
import { Table } from '@/Board/scenarios/Table'
import { ExpandedNextDeparture } from '@/Board/scenarios/Table/components/ExpandedNextDeparture'
import { StopPlaceQuayDeviation } from '@/Board/scenarios/Table/components/StopPlaceDeviation'
import { TileSituations } from '@/Board/scenarios/Table/components/TileSituations'
import { HasFetchErrorContext } from '@/Board/scenarios/Table/contexts'
import type {
	BoardDrivingDistanceDB,
	BoardWalkingDistanceDB,
	TileColumnDB,
	TileViewMode,
} from '@/Shared/types/db-types/boards'
import { reportError, reportWarning } from '@/Shared/utils/report'
import { getUiLabel } from '@/Shared/utils/translations'
import type { TDepartureFragment, TSituationFragment } from '@/types/graphql-operations'
import { DataFetchingFailed } from '../DataFetchingFailed'

interface BaseTileProps {
	displayName?: string
	estimatedCalls: TDepartureFragment[]
	situations: TSituationFragment[]
	uniqueSituations: TileSituation[]
	currentSituationIndex: number

	isLoading: boolean
	error?: Error
	hasData: boolean

	columns: TileColumnDB[]
	walkingDistance?: BoardWalkingDistanceDB
	drivingDistance?: BoardDrivingDistanceDB
	viewMode?: TileViewMode

	customHeader?: ReactNode
	customDeviation?: ReactNode
	customNames?: CustomName[]

	size?: TileVariants['size']
}

export const DEFAULT_COLUMNS_DEPARTURES: TileColumnDB[] = ['line', 'destination', 'time']

export const DEFAULT_COLUMNS_ARRIVALS: TileColumnDB[] = [
	'line',
	'fromStopPlace',
	'destination',
	'time',
]

export const DEFAULT_COMBINED_COLUMNS_DEPARTURES: TileColumnDB[] = [
	'line',
	'destination',
	'name',
	'platform',
	'time',
]

export const DEFAULT_COMBINED_COLUMNS_ARRIVALS: TileColumnDB[] = [
	'line',
	'fromStopPlace',
	'name',
	'platform',
	'time',
]

export function BoardTile({
	displayName,
	estimatedCalls,
	situations,
	uniqueSituations,
	currentSituationIndex,
	isLoading,
	error,
	hasData,
	columns,
	walkingDistance,
	drivingDistance,
	viewMode,
	customHeader,
	customDeviation,
	customNames,
	size,
}: BaseTileProps) {
	const { isArrivals, language, boardId } = useBoardContext()
	const hasFetchError = !!error
	const showingCachedData = hasFetchError && hasData && estimatedCalls.length > 0
	const isCacheExpired = hasFetchError && hasData && estimatedCalls.length === 0

	useEffect(() => {
		if (showingCachedData) {
			reportWarning(
				boardId ?? '',
				'showing_cached_data',
				'Fetch failed, showing cached departures/arrivals that have not expired.',
			)
		}
		if (isCacheExpired) {
			reportError(
				boardId ?? '',
				'error_screen_cache_expired',
				'Showing error screen, all cached departures/arrivals have expired.',
			)
		}
	}, [showingCachedData, isCacheExpired, boardId])

	if (isLoading && !hasData) {
		return (
			<Tile state="loading" size={size}>
				<Loader>
					{getUiLabel(isArrivals ? 'loadingArrivals' : 'loadingDepartures', language)}
				</Loader>
			</Tile>
		)
	}

	if (!hasData || (error && estimatedCalls.length === 0)) {
		return (
			<Tile state="error" size={size}>
				<DataFetchingFailed error={error} />
			</Tile>
		)
	}

	if (!estimatedCalls || estimatedCalls.length === 0) {
		return (
			<Tile state="empty" size={size}>
				<div className="grow overflow-hidden">
					{customHeader ??
						(displayName && (
							<TableHeader
								heading={displayName}
								walkingDistance={walkingDistance}
								drivingDistance={drivingDistance}
							/>
						))}

					{customDeviation ?? <StopPlaceQuayDeviation situations={situations} />}
				</div>
				<div className="flex h-full w-full items-center justify-center text-center text-tertiary">
					{getUiLabel(isArrivals ? 'noArrivalsNearFuture' : 'noDeparturesNearFuture', language)}
				</div>
			</Tile>
		)
	}

	const [nextDeparture, ...remainingDepartures] = estimatedCalls
	const showExpandedNextDeparture = viewMode === 'expandNextDeparture'
	const tableDepartures = showExpandedNextDeparture ? remainingDepartures : estimatedCalls
	const currentVisibleSituationId = uniqueSituations?.[currentSituationIndex]?.situation.id

	return (
		<Tile state="data" size={size}>
			<div className="relative overflow-hidden grow">
				{customHeader ??
					(displayName && (
						<TableHeader
							heading={displayName}
							walkingDistance={walkingDistance}
							drivingDistance={drivingDistance}
						/>
					))}

				{customDeviation ?? <StopPlaceQuayDeviation situations={situations} />}

				<HasFetchErrorContext.Provider value={hasFetchError}>
					{showExpandedNextDeparture && (
						<ExpandedNextDeparture
							departure={nextDeparture}
							stopPlaceSituations={situations}
							currentVisibleSituationId={currentVisibleSituationId}
							numberOfVisibleSituations={uniqueSituations?.length}
						/>
					)}

					{(!showExpandedNextDeparture || tableDepartures.length > 0) && (
						<Table
							columns={columns}
							departures={tableDepartures}
							stopPlaceSituations={situations}
							currentVisibleSituationId={currentVisibleSituationId}
							numberOfVisibleSituations={uniqueSituations?.length}
							customNames={customNames}
						/>
					)}
				</HasFetchErrorContext.Provider>

				{uniqueSituations && uniqueSituations.length > 0 && (
					<TileSituations
						situation={uniqueSituations[currentSituationIndex]?.situation}
						currentSituationNumber={currentSituationIndex}
						numberOfSituations={uniqueSituations.length}
						cancelledDeparture={uniqueSituations[currentSituationIndex]?.cancellation ?? false}
						transportModeList={uniqueSituations[currentSituationIndex]?.transportModeList}
						publicCodeList={uniqueSituations[currentSituationIndex]?.publicCodeList}
					/>
				)}
			</div>
		</Tile>
	)
}
