import { nanoid } from 'nanoid'
import { useBoardContext } from '@/Board/context'
import { DeparturesContext } from '@/Board/scenarios/Table/contexts'
import { useNonNullContext } from '@/Shared/hooks/useNonNullContext'
import { getColumnLabel } from '@/Shared/utils/translations'
import { TableCell } from '../TableCell'
import { TableColumn } from '../TableColumn'
import { Time } from './Time'

function ExpectedTime() {
	const departures = useNonNullContext(DeparturesContext)
	const { isArrivals, language } = useBoardContext()

	const time = departures.map((departure) => ({
		aimedTime: isArrivals ? departure.aimedArrivalTime : departure.aimedDepartureTime,
		expectedTime: isArrivals ? departure.expectedArrivalTime : departure.expectedDepartureTime,
		cancelled: departure.cancellation,
		key: nanoid(),
	}))

	return (
		<TableColumn
			title={getColumnLabel(isArrivals ? 'arrival' : 'departure', language)}
			className="text-right"
		>
			{time.map((t) => (
				<TableCell key={t.key}>
					<Time
						expectedTime={t.expectedTime}
						aimedTime={t.aimedTime}
						cancelled={t.cancelled}
						isArrivalBoard={isArrivals}
						language={language}
					/>
				</TableCell>
			))}
		</TableColumn>
	)
}

export { ExpectedTime }
