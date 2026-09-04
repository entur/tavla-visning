import { useNonNullContext } from '@/Shared/hooks/useNonNullContext'
import { nanoid } from 'nanoid'
import { useBoardContext } from '@/Board/context'

import { DeparturesContext } from '../contexts'
import { TableCell } from './TableCell'
import { TableColumn } from './TableColumn'

import { getPlatformLabel } from '@/Shared/utils/translations'
import type { TTransportMode } from '@/types/graphql-schema'

function Platform() {
	const departures = useNonNullContext(DeparturesContext)
	const { language } = useBoardContext()

	// Overskriver transportMode for railReplacementBus to rail for platform fordi vi ønsker å vise "Spor"
	const updatedPlatforms = departures.map((departure) => {
		const transportMode = departure.serviceJourney.transportMode
		const subMode = departure.serviceJourney.transportSubmode

		return {
			publicCode: departure.quay.publicCode,
			key: nanoid(),
			transportMode:
				transportMode === 'bus' && subMode === 'railReplacementBus'
					? ('rail' as TTransportMode)
					: transportMode,
		}
	})

	const title = getPlatformLabel(
		updatedPlatforms.map((platform) => platform.transportMode || 'unknown'),
		language,
	)

	return (
		<TableColumn title={title} className="min-w-[3em]">
			{updatedPlatforms.map((platform) => (
				<TableCell key={platform.key}>{platform.publicCode}</TableCell>
			))}
		</TableColumn>
	)
}

export { Platform }
