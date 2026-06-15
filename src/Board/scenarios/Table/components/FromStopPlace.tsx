import { nanoid } from 'nanoid'
import { DeparturesContext } from '../contexts'
import { TableCell } from './TableCell'
import { TableColumn } from './TableColumn'
import { useNonNullContext } from '@/Shared/hooks/useNonNullContext'

function FromStopPlace() {
	const departures = useNonNullContext(DeparturesContext)

	return (
		<div className="grow overflow-hidden">
			<TableColumn title="Fra">
				{departures.map((departure) => (
					<TableCell key={nanoid()} className="flex align-middle">
						<div className="line-clamp-1 overflow-ellipsis hyphens-auto text-em-xl2 leading-em-base">
							{departure.serviceJourney?.quays?.[0]?.name ?? ''}
						</div>
					</TableCell>
				))}
			</TableColumn>
		</div>
	)
}

export { FromStopPlace }
