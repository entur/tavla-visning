import { CarIcon, WalkIcon } from '@entur/icons'
import { useBoardContext } from '@/Board/context'
import type { BoardDrivingDistanceDB, BoardWalkingDistanceDB } from '@/Shared/types/db-types/boards'
import { getUiLabel } from '@/Shared/utils/translations'
import { formatDuration } from '@/utils/time'
import { getDistanceDisplay } from './utils'

export function DistanceInfo({
	walkingDistance,
	drivingDistance,
}: {
	walkingDistance?: BoardWalkingDistanceDB
	drivingDistance?: BoardDrivingDistanceDB
}) {
	const { language } = useBoardContext()
	const { walking, driving } = getDistanceDisplay(
		walkingDistance?.distance,
		drivingDistance?.distance,
	)

	if (walking === undefined && driving === undefined) return null

	return (
		<div className="flex flex-row items-center gap-2 whitespace-nowrap">
			{walking !== undefined && (
				<div className="flex flex-row items-center whitespace-nowrap">
					<WalkIcon color="primary" role="img" aria-label={getUiLabel('walkingTime', language)} />
					{formatDuration(walking)}
				</div>
			)}
			{driving !== undefined && (
				<div className="flex flex-row items-center whitespace-nowrap">
					<CarIcon color="primary" role="img" aria-label={getUiLabel('drivingTime', language)} />
					{formatDuration(driving)}
				</div>
			)}
		</div>
	)
}
