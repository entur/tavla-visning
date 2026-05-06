import {
	BicycleHotelIcon,
	BusShelterIcon,
	LockerIcon,
	ToiletIcon,
	TVMIcon,
	WaitingRoomIcon,
	WheelchairIcon,
} from '@entur/icons'
import type { ComponentType } from 'react'
import type { BoardWalkingDistanceDB } from '@/Shared/types/db-types/boards'
import type { TNsrStopPlace } from '@/Shared/types/nsr-types'
import type { TWheelchairBoarding } from '@/types/graphql-schema'
import { WalkingDistance } from '../WalkingDistance'

type FacilityIcon = { Icon: ComponentType<{ size?: string }>; title: string }

function getFacilityIcons(
	stopPlaceInfo: TNsrStopPlace | null | undefined,
	wheelchairAccessible: TWheelchairBoarding | null | undefined,
): FacilityIcon[] {
	const icons: FacilityIcon[] = []

	const isWheelchair =
		wheelchairAccessible === 'possible' ||
		stopPlaceInfo?.accessibilityAssessment?.limitations?.wheelchairAccess === 'yes'
	if (isWheelchair) icons.push({ Icon: WheelchairIcon, title: 'Rullestolvennlig' })

	const equip = stopPlaceInfo?.placeEquipments

	const hasWaitingRoom = (equip?.waitingRoomEquipment?.length ?? 0) > 0
	if (hasWaitingRoom) icons.push({ Icon: WaitingRoomIcon, title: 'Venterom' })

	const hasShelter = (equip?.shelterEquipment?.length ?? 0) > 0
	if (hasShelter) icons.push({ Icon: BusShelterIcon, title: 'Leskur' })

	const hasToilet = (equip?.sanitaryEquipment ?? []).some((e) => (e.numberOfToilets ?? 0) > 0)
	if (hasToilet) icons.push({ Icon: ToiletIcon, title: 'Toalett' })

	const hasBikeParking = (equip?.cycleStorageEquipment ?? []).some(
		(e) => (e.numberOfSpaces ?? 0) > 0,
	)
	if (hasBikeParking) icons.push({ Icon: BicycleHotelIcon, title: 'Sykkelparkering' })

	const hasLockers = (equip?.lockerEquipment?.length ?? 0) > 0
	if (hasLockers) icons.push({ Icon: LockerIcon, title: 'Oppbevaringsbokser' })

	const hasTvm = (equip?.ticketingEquipment ?? []).some((e) => e.ticketMachines)
	if (hasTvm) icons.push({ Icon: TVMIcon, title: 'Billettautomat' })

	return icons
}

function TableHeader({
	heading,
	walkingDistance,
	stopPlaceInfo,
	wheelchairAccessible,
}: {
	heading: string
	walkingDistance?: BoardWalkingDistanceDB
	stopPlaceInfo?: TNsrStopPlace | null
	wheelchairAccessible?: TWheelchairBoarding | null
}) {
	const facilityIcons = getFacilityIcons(stopPlaceInfo, wheelchairAccessible)

	const municipality = stopPlaceInfo?.topographicPlace?.name?.value
	const county = stopPlaceInfo?.topographicPlace?.parentTopographicPlace?.name?.value
	const locationText =
		municipality && county && municipality !== county
			? `${municipality} · ${county}`
			: (municipality ?? county)

	return (
		<div className="mb-3 flex min-h-[2.2em] flex-col justify-center">
			<div className="flex flex-row items-center justify-between">
				<div className="flex min-w-0 flex-row items-center gap-2">
					<h1 className="m-0 line-clamp-2 text-em-xl2 hyphens-auto leading-em-base font-semibold">
						{heading}
					</h1>
					{facilityIcons.length > 0 && (
						<div className="flex shrink-0 flex-row items-center gap-1 opacity-80">
							{facilityIcons.map(({ Icon, title }) => (
								<span key={title} title={title}>
									<Icon size="20" aria-label={title} />
								</span>
							))}
						</div>
					)}
				</div>
				<WalkingDistance walkingDistance={walkingDistance} />
			</div>
			{locationText && (
				<p className="m-0 truncate text-em-sm leading-tight opacity-60">{locationText}</p>
			)}
		</div>
	)
}

export { TableHeader }
