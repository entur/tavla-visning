export type TNsrWheelchairAccess = 'yes' | 'no' | 'unknown'

export type TNsrShelterEquipment = {
	enclosed?: boolean
	seats?: number
	stepFreeAccess?: boolean
}

export type TNsrWaitingRoomEquipment = {
	numberOfSeats?: number
	stepFreeAccess?: boolean
}

export type TNsrSanitaryEquipment = {
	numberOfToilets?: number
	gender?: string
}

export type TNsrCycleStorageEquipment = {
	numberOfSpaces?: number
	covered?: boolean
}

export type TNsrLockerEquipment = {
	numberOfLockers?: number
}

export type TNsrTicketingEquipment = {
	ticketMachines?: boolean
	ticketOffice?: boolean
}

export type TNsrPlaceEquipments = {
	shelterEquipment?: TNsrShelterEquipment[]
	waitingRoomEquipment?: TNsrWaitingRoomEquipment[]
	sanitaryEquipment?: TNsrSanitaryEquipment[]
	cycleStorageEquipment?: TNsrCycleStorageEquipment[]
	lockerEquipment?: TNsrLockerEquipment[]
	ticketingEquipment?: TNsrTicketingEquipment[]
}

export type TNsrAccessibilityLimitations = {
	wheelchairAccess?: TNsrWheelchairAccess
	stepFreeAccess?: TNsrWheelchairAccess
	visualSignsAvailable?: TNsrWheelchairAccess
	audibleSignalsAvailable?: TNsrWheelchairAccess
}

export type TNsrAccessibilityAssessment = {
	limitations?: TNsrAccessibilityLimitations
}

export type TNsrTopographicPlace = {
	name?: { value: string }
	parentTopographicPlace?: {
		name?: { value: string }
	}
}

export type TNsrStopPlace = {
	id: string
	name?: { value: string; lang?: string }
	description?: { value: string; lang?: string }
	topographicPlace?: TNsrTopographicPlace
	placeEquipments?: TNsrPlaceEquipments
	accessibilityAssessment?: TNsrAccessibilityAssessment
}
