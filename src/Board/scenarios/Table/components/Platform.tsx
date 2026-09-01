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

	const platforms = departures.map((departure) => ({
		publicCode: departure.quay.publicCode,
		key: nanoid(),
		transportMode: departure.serviceJourney.transportMode,
		subMode: departure.serviceJourney.transportSubmode,
	}))

	// Overskriver transportMode for railReplacementBus to rail for platform fordi vi ønsker å vise "Spor"
	const updatedPlatforms = platforms.map((platform) => {
		if (platform.transportMode === 'bus' && platform.subMode === 'railReplacementBus') {
			return { ...platform, transportMode: 'rail' as TTransportMode }
		}
		return platform
	})

	const title = getPlatformLabel(
		updatedPlatforms.map((platform) => platform.transportMode || 'unknown'),
		language,
	)

	return (
		<TableColumn title={title}>
			{updatedPlatforms.map((platform) => (
				<TableCell key={platform.key}>{platform.publicCode}</TableCell>
			))}
		</TableColumn>
	)
}

export { Platform }
