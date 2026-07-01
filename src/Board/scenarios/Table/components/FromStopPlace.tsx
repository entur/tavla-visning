import { nanoid } from 'nanoid'
import { useNonNullContext } from '@/Shared/hooks/useNonNullContext'
import { DeparturesContext } from '../contexts'
import { TableCell } from './TableCell'
import { TableColumn } from './TableColumn'

function FromStopPlace() {
	const departures = useNonNullContext(DeparturesContext)

	return (
		<div className="grow overflow-hidden">
			<TableColumn title="Fra">
				{departures.map((departure) => (
					<TableCell key={nanoid()} className="flex align-middle">
						<div className="line-clamp-2 justify-items-end overflow-ellipsis hyphens-auto text-em-base/em-base">
							{departure.serviceJourney?.quays?.[0]?.name ?? ''}
						</div>
					</TableCell>
				))}
			</TableColumn>
		</div>
	)
}

export { FromStopPlace }
