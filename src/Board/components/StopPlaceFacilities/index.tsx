import {
	BicycleParkingIcon,
	BusShelterIcon,
	ToiletIcon,
	WaitingRoomIcon,
	WheelchairIcon,
} from '@entur/icons'
import type { TNsrStopPlace } from '@/Shared/types/nsr-types'
import type { TWheelchairBoarding } from '@/types/graphql-schema'

type Props = {
	stopPlaceInfo?: TNsrStopPlace | null
	wheelchairAccessible?: TWheelchairBoarding | null
}

function hasShelter(info: TNsrStopPlace): boolean {
	const equip = info.placeEquipments
	return (
		(equip?.shelterEquipment?.length ?? 0) > 0 || (equip?.waitingRoomEquipment?.length ?? 0) > 0
	)
}

function hasToilet(info: TNsrStopPlace): boolean {
	return (info.placeEquipments?.sanitaryEquipment ?? []).some((e) => (e.numberOfToilets ?? 0) > 0)
}

function hasBikeParking(info: TNsrStopPlace): boolean {
	return (info.placeEquipments?.cycleStorageEquipment ?? []).some(
		(e) => (e.numberOfSpaces ?? 0) > 0,
	)
}

function isWheelchairAccessible(
	info: TNsrStopPlace | null | undefined,
	jpValue: TWheelchairBoarding | null | undefined,
): boolean {
	if (jpValue === 'possible') return true
	return info?.accessibilityAssessment?.limitations?.wheelchairAccess === 'yes'
}

export function StopPlaceFacilities({ stopPlaceInfo, wheelchairAccessible }: Props) {
	const wheelchair = isWheelchairAccessible(stopPlaceInfo, wheelchairAccessible)
	const shelter = stopPlaceInfo ? hasShelter(stopPlaceInfo) : false
	const toilet = stopPlaceInfo ? hasToilet(stopPlaceInfo) : false
	const bikeParking = stopPlaceInfo ? hasBikeParking(stopPlaceInfo) : false

	const municipality = stopPlaceInfo?.topographicPlace?.name?.value
	const county = stopPlaceInfo?.topographicPlace?.parentTopographicPlace?.name?.value
	const locationText = [municipality, county].filter(Boolean).join(' · ')

	const description = stopPlaceInfo?.description?.value

	const hasFacilities = wheelchair || shelter || toilet || bikeParking

	if (!hasFacilities && !locationText && !description) return null

	return (
		<div className="flex flex-col gap-1 px-3 pb-1 text-secondary">
			{(locationText || description) && (
				<p className="truncate text-sm leading-tight opacity-70">{locationText || description}</p>
			)}
			{hasFacilities && (
				<div className="flex flex-row gap-2">
					{wheelchair && (
						<span title="Rullestolvennlig">
							<WheelchairIcon size="18" />
						</span>
					)}
					{shelter && (
						<span title="Leskur / venterom">
							{stopPlaceInfo?.placeEquipments?.waitingRoomEquipment?.length ? (
								<WaitingRoomIcon size="18" />
							) : (
								<BusShelterIcon size="18" />
							)}
						</span>
					)}
					{toilet && (
						<span title="Toalett">
							<ToiletIcon size="18" />
						</span>
					)}
					{bikeParking && (
						<span title="Sykkelparkering">
							<BicycleParkingIcon size="18" />
						</span>
					)}
				</div>
			)}
		</div>
	)
}
