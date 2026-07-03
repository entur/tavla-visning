import type { BoardDrivingDistanceDB, BoardWalkingDistanceDB } from '@/Shared/types/db-types/boards'
import { formatDuration } from '@/utils/time'
import { CarIcon, WalkIcon } from '@entur/icons'
import { getDistanceDisplay } from './utils'

function DistanceInfo({
	walkingDistance,
	drivingDistance,
}: {
	walkingDistance?: BoardWalkingDistanceDB
	drivingDistance?: BoardDrivingDistanceDB
}) {
	if (walkingDistance?.visible === false) return null

	const { walking, driving } = getDistanceDisplay(
		walkingDistance?.distance,
		drivingDistance?.distance,
	)

	if (walking === undefined && driving === undefined) return null

	return (
		<div className="flex flex-row items-center gap-2 whitespace-nowrap">
			{walking !== undefined && (
				<div className="flex flex-row items-center whitespace-nowrap">
					<WalkIcon color="primary" />
					{formatDuration(walking)}
				</div>
			)}
			{driving !== undefined && (
				<div className="flex flex-row items-center whitespace-nowrap">
					<CarIcon color="primary" />
					{formatDuration(driving)}
				</div>
			)}
		</div>
	)
}

export { DistanceInfo }
