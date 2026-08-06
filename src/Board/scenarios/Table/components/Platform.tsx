import { useNonNullContext } from '@/Shared/hooks/useNonNullContext'
import { nanoid } from 'nanoid'
import { useBoardContext } from '@/Board/context'
import { getColumnLabel } from '@/Shared/utils/translations'
import { DeparturesContext } from '../contexts'
import { TableCell } from './TableCell'
import { TableColumn } from './TableColumn'

function Platform() {
	const departures = useNonNullContext(DeparturesContext)
	const { language } = useBoardContext()

	const platforms = departures.map((departure) => ({
		publicCode: departure.quay.publicCode,
		key: nanoid(),
	}))

	return (
		<TableColumn title={getColumnLabel('platform', language)}>
			{platforms.map((platform) => (
				<TableCell key={platform.key}>{platform.publicCode}</TableCell>
			))}
		</TableColumn>
	)
}

export { Platform }
