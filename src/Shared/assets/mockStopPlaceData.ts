import type { TNsrStopPlace } from '@/Shared/types/nsr-types'

export const MOCK_STOP_PLACE_DATA: Record<string, TNsrStopPlace> = {
	// Oslo S (tog) — data from stoppested.entur.org
	'NSR:StopPlace:337': {
		id: 'NSR:StopPlace:337',
		name: { value: 'Oslo S' },
		topographicPlace: {
			name: { value: 'Oslo' },
			parentTopographicPlace: { name: { value: 'Oslo' } },
		},
		accessibilityAssessment: {
			limitations: {
				wheelchairAccess: 'yes',
				stepFreeAccess: 'yes',
				visualSignsAvailable: 'unknown',
				audibleSignalsAvailable: 'unknown',
			},
		},
		placeEquipments: {
			shelterEquipment: [],
			waitingRoomEquipment: [{ numberOfSeats: 50, stepFreeAccess: true }],
			sanitaryEquipment: [{ numberOfToilets: 4 }],
			cycleStorageEquipment: [],
			lockerEquipment: [{ numberOfLockers: 20 }],
			ticketingEquipment: [{ ticketMachines: true, ticketOffice: true }],
		},
	},

	// Oslo S Trelastgata (bussterminal) — data from stoppested.entur.org
	'NSR:StopPlace:59872': {
		id: 'NSR:StopPlace:59872',
		name: { value: 'Oslo S Trelastgata' },
		topographicPlace: {
			name: { value: 'Oslo' },
			parentTopographicPlace: { name: { value: 'Oslo' } },
		},
		accessibilityAssessment: {
			limitations: {
				wheelchairAccess: 'yes',
				stepFreeAccess: 'yes',
				visualSignsAvailable: 'unknown',
				audibleSignalsAvailable: 'unknown',
			},
		},
		placeEquipments: {
			shelterEquipment: [{ enclosed: false, seats: 10, stepFreeAccess: true }],
			waitingRoomEquipment: [],
			sanitaryEquipment: [{ numberOfToilets: 2 }],
			cycleStorageEquipment: [{ numberOfSpaces: 20, covered: false }],
			lockerEquipment: [],
			ticketingEquipment: [{ ticketMachines: true, ticketOffice: false }],
		},
	},
}
