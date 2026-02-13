import type { CustomName } from '@/Board/hooks/useTileData'
import type { TileSituation } from '@/Board/scenarios/Board/utils'
import { Table } from '@/Board/scenarios/Table'
import { StopPlaceQuayDeviation } from '@/Board/scenarios/Table/components/StopPlaceDeviation'
import { TileSituations } from '@/Board/scenarios/Table/components/TileSituations'

import type { BoardWalkingDistanceDB, TileColumnDB } from '@/Shared/types/db-types/boards'
import type { TDepartureFragment, TSituationFragment } from '@/types/graphql-schema'
import { TableHeader } from '@board/scenarios/Table/components/TableHeader'
import { Tile, type TileVariants } from '@src/Shared/components/Tile'
import type { ReactNode } from 'react'
import { DataFetchingFailed, FetchErrorTypes } from '../DataFetchingFailed'
import { Loader } from '@entur/loader'

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

	customHeader?: ReactNode
	customDeviation?: ReactNode
	customNames?: CustomName[]

	size?: TileVariants['size']
}

export const DEFAULT_COLUMNS: TileColumnDB[] = ['line', 'destination', 'time']

export const DEFAULT_COMBINED_COLUMNS: TileColumnDB[] = [
	'line',
	'destination',
	'name',
	'platform',
	'time',
]

export function BaseTile({
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
	customHeader,
	customDeviation,
	customNames,
	size,
}: BaseTileProps) {
	if (isLoading && !hasData) {
		return (
			<Tile state="loading" size={size}>
				<Loader>Henter avganger..</Loader>
			</Tile>
		)
	}

	if (error || !hasData) {
		return (
			<Tile state="error" size={size}>
				<DataFetchingFailed timeout={error?.message === FetchErrorTypes.TIMEOUT} />
			</Tile>
		)
	}

	if (!estimatedCalls || estimatedCalls.length === 0) {
		return (
			<Tile state="empty" size={size}>
				<div className="grow overflow-hidden">
					{customHeader ??
						(displayName && (
							<TableHeader heading={displayName} walkingDistance={walkingDistance} />
						))}
				</div>
				<div className="flex h-full w-full items-center justify-center text-center text-tertiary">
					Ingen avganger i nærmeste fremtid
				</div>
			</Tile>
		)
	}

	return (
		<Tile state="data" size={size}>
			<div className="overflow-hidden">
				{customHeader ??
					(displayName && <TableHeader heading={displayName} walkingDistance={walkingDistance} />)}

				{customDeviation ?? <StopPlaceQuayDeviation situations={situations} />}

				<Table
					columns={columns}
					departures={estimatedCalls}
					stopPlaceSituations={situations}
					currentVisibleSituationId={uniqueSituations?.[currentSituationIndex]?.situation.id}
					numberOfVisibleSituations={uniqueSituations?.length}
					customNames={customNames}
				/>
			</div>

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
		</Tile>
	)
}
