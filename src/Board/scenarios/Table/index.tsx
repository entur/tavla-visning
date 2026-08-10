import { Paragraph } from '@entur/typography'
import { isArray } from 'lodash'
import { useBoardContext } from '@/Board/context'
import type { CustomName } from '@/Board/hooks/useTileData'
import type { TileColumnDB } from '@/Shared/types/db-types/boards'
import { getUiLabel } from '@/Shared/utils/translations'
import type { TDepartureFragment, TSituationFragment } from '@/types/graphql-schema'
import { Destination, Name } from './components/Destination'
import { Deviation } from './components/Deviation'
import { FromStopPlace } from './components/FromStopPlace'
import { Line } from './components/Line'
import { Platform } from './components/Platform'
import { AimedTime } from './components/Time/AimedTime'
import { ArrivalTime } from './components/Time/ArrivalTime'
import { ExpectedTime } from './components/Time/ExpectedTime'
import { DeparturesContext } from './contexts'

function Table({
	departures,
	columns,
	stopPlaceSituations,
	currentVisibleSituationId,
	numberOfVisibleSituations,
	customNames,
}: {
	departures: TDepartureFragment[]
	columns?: TileColumnDB[]
	stopPlaceSituations?: TSituationFragment[]
	currentVisibleSituationId?: string
	numberOfVisibleSituations?: number
	customNames?: CustomName[]
}) {
	const { isArrivals, language } = useBoardContext()

	if (!columns || !isArray(columns))
		return <div className="flex shrink-0">{getUiLabel('noColumnsAdded', language)}</div>

	if (departures.length === 0)
		return (
			<div className="flex h-full w-full flex-col items-center justify-center pb-4 text-center text-em-sm">
				<Paragraph className="!text-primary sm:pb-8">
					{getUiLabel(isArrivals ? 'noArrivalsNext24Hours' : 'noDeparturesNext24Hours', language)}
				</Paragraph>
			</div>
		)
	return (
		<div className="flex flex-col">
			<div className="flex shrink-0">
				<DeparturesContext.Provider value={departures}>
					<Deviation
						currentVisibleSituationId={currentVisibleSituationId}
						stopPlaceSituations={stopPlaceSituations}
						numberOfShownSituations={numberOfVisibleSituations}
					/>
					{columns.includes('aimedTime') && <AimedTime />}
					{columns.includes('arrivalTime') && <ArrivalTime />}
					{columns.includes('line') && <Line />}
					{columns.includes('destination') && <Destination />}
					{columns.includes('fromStopPlace') && <FromStopPlace />}
					{columns.includes('name') && <Name customNames={customNames} />}
					{columns.includes('platform') && <Platform />}
					{columns.includes('time') && <ExpectedTime />}
				</DeparturesContext.Provider>
			</div>
		</div>
	)
}

export { Table }
