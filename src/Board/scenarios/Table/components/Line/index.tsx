import { nanoid } from 'nanoid'
import { TableCell } from '../TableCell'
import { TableColumn } from '../TableColumn'
import { useBoardContext } from '@/Board/context'
import { TravelTag } from '@/Shared/components/TravelTag'
import { useNonNullContext } from '@/Shared/hooks/useNonNullContext'
import { getAirPublicCode } from '@/Shared/utils/publicCode'
import { getColumnLabel } from '@/Shared/utils/translations'
import { DeparturesContext } from '../../contexts'

function Line() {
	const departures = useNonNullContext(DeparturesContext)
	const { language } = useBoardContext()

	const lines = departures.map((departure) => ({
		transportMode: departure.serviceJourney.transportMode ?? 'unknown',
		transportSubmode: departure.serviceJourney.transportSubmode ?? undefined,
		publicCode: departure.serviceJourney.line.publicCode ?? '',
		key: nanoid(),
		id: departure.serviceJourney.id ?? '',
		cancelled: departure.cancellation,
	}))

	return (
		<TableColumn title={getColumnLabel('line', language)}>
			{lines.map((line) => (
				<TableCell key={line.key}>
					<TravelTag
						transportMode={line.transportMode}
						transportSubmode={line.transportSubmode}
						publicCode={
							line.transportMode === 'air' ? (getAirPublicCode(line.id) ?? '') : line.publicCode
						}
						cancelled={line.cancelled}
					/>
				</TableCell>
			))}
		</TableColumn>
	)
}

export { Line }
