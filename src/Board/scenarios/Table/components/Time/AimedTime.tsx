import { nanoid } from 'nanoid'
import { useBoardContext } from '@/Board/context'
import { useNonNullContext } from '@/Shared/hooks/useNonNullContext'
import { getColumnLabel } from '@/Shared/utils/translations'
import { DeparturesContext } from '../../contexts'
import { TableCell } from '../TableCell'
import { TableColumn } from '../TableColumn'
import { FormattedTime } from './components/FormattedTime'

function AimedTime() {
	const departures = useNonNullContext(DeparturesContext)
	const { language } = useBoardContext()

	const time = departures.map((departure) => ({
		aimedDepartureTime: departure.aimedDepartureTime,
		key: nanoid(),
	}))

	return (
		<TableColumn title={getColumnLabel('planned', language)}>
			{time.map((t) => (
				<TableCell key={t.key}>
					<FormattedTime time={t.aimedDepartureTime} />
				</TableCell>
			))}
		</TableColumn>
	)
}

export { AimedTime }
