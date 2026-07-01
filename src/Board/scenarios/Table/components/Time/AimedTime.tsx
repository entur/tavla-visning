import { nanoid } from 'nanoid'
import { useNonNullContext } from '@/Shared/hooks/useNonNullContext'
import { DeparturesContext } from '../../contexts'
import { TableCell } from '../TableCell'
import { TableColumn } from '../TableColumn'
import { FormattedTime } from './components/FormattedTime'

function AimedTime() {
	const departures = useNonNullContext(DeparturesContext)

	const time = departures.map((departure) => ({
		aimedDepartureTime: departure.aimedDepartureTime,
		key: nanoid(),
	}))

	return (
		<TableColumn title="Planlagt">
			{time.map((t) => (
				<TableCell key={t.key}>
					<FormattedTime time={t.aimedDepartureTime} />
				</TableCell>
			))}
		</TableColumn>
	)
}

export { AimedTime }
