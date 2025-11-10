import type { BoardWalkingDistanceDB } from '@/Shared/types/db-types/boards'
import { formatWalkTime } from '@/utils/time'
import { WalkIcon } from '@entur/icons'

function WalkingDistance({ walkingDistance }: { walkingDistance?: BoardWalkingDistanceDB }) {
	if (!walkingDistance || walkingDistance.visible === false) return null

	return (
		<div className="flex flex-row items-center whitespace-nowrap">
			<WalkIcon color="primary" />
			{formatWalkTime(walkingDistance.distance)}
		</div>
	)
}

export { WalkingDistance }
