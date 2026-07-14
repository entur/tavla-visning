import { nanoid } from 'nanoid'
import { TableCell } from '../TableCell'
import { TableColumn } from '../TableColumn'
import { FormattedTime } from './components/FormattedTime'
import { useBoardContext } from '@/Board/context'
import { DeparturesContext } from '../../contexts'
import { useNonNullContext } from '@/Shared/hooks/useNonNullContext'
import { getColumnLabel } from '@/Shared/utils/translations'

function ArrivalTime() {
	const departures = useNonNullContext(DeparturesContext)
	const { language } = useBoardContext()

	const time = departures.map((departure) => ({
		expectedArrivalTime: departure.expectedArrivalTime,
		key: nanoid(),
	}))

	return (
		<TableColumn title={getColumnLabel('arrival', language)} className="text-right">
			{time.map((t) => (
				<TableCell key={t.key}>
					<FormattedTime time={t.expectedArrivalTime} />
				</TableCell>
			))}
		</TableColumn>
	)
}

export { ArrivalTime }
