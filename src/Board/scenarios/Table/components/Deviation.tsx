import { nanoid } from 'nanoid'
import { useNonNullContext } from '@/Shared/hooks/useNonNullContext'
import type { TSituationFragment } from '@/types/graphql-operations'
import { getDeviationType, removeStopPlaceSituations, type TDeviationType } from '../../Board/utils'
import { DeparturesContext } from '../contexts'
import { DeviationIcon } from './DeviationIcon'
import { TableCell } from './TableCell'
import { TableColumn } from './TableColumn'

type Deviation = {
	deviationType: TDeviationType
	isHighlighted: boolean
}

function Deviation({
	currentVisibleSituationId,
	stopPlaceSituations,
	numberOfShownSituations,
}: {
	currentVisibleSituationId?: string
	stopPlaceSituations?: TSituationFragment[]
	numberOfShownSituations?: number
}) {
	const departures = useNonNullContext(DeparturesContext)

	const deviations: Deviation[] = departures.map((departure) => {
		const isHighlighted =
			numberOfShownSituations && numberOfShownSituations > 0
				? departure.situations.some((s) => s.id === currentVisibleSituationId)
				: true

		const filteredSituations =
			removeStopPlaceSituations(departure.situations, stopPlaceSituations) ?? []

		return {
			deviationType: getDeviationType(departure.cancellation, filteredSituations),
			isHighlighted,
		}
	})

	return (
		<TableColumn>
			{deviations.map((deviation) => (
				<TableCell key={nanoid()}>
					<DeviationCell deviation={deviation} />
				</TableCell>
			))}
		</TableColumn>
	)
}

function DeviationCell({ deviation }: { deviation: Deviation }) {
	if (deviation.deviationType === 'no-deviation') {
		return null
	}

	return (
		<div className="flex items-center justify-center" style={{ height: '3em' }}>
			<DeviationIcon
				deviationType={deviation.deviationType}
				isHighlighted={deviation.isHighlighted}
			/>
		</div>
	)
}

export { Deviation }
