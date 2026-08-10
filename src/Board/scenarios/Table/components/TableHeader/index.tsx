import type { BoardDrivingDistanceDB, BoardWalkingDistanceDB } from '@/Shared/types/db-types/boards'
import { DistanceInfo } from '../DistanceInfo'

function TableHeader({
	heading,
	walkingDistance,
	drivingDistance,
}: {
	heading: string
	walkingDistance?: BoardWalkingDistanceDB
	drivingDistance?: BoardDrivingDistanceDB
}) {
	return (
		<div className="mb-3 flex min-h-[2.2em] flex-row items-center justify-between">
			<h1 className="m-0 line-clamp-2 text-em-xl2 hyphens-auto leading-em-base font-semibold">
				{heading}
			</h1>

			<DistanceInfo walkingDistance={walkingDistance} drivingDistance={drivingDistance} />
		</div>
	)
}

export { TableHeader }
