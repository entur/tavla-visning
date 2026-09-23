/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
	| T
	| { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
import type * as Types from 'src/types/graphql-schema'

export type TArrivalDeparture =
	/** Only show arrivals */
	| 'arrivals'
	/** Show both arrivals and departures */
	| 'both'
	/** Only show departures */
	| 'departures'

export type TTransportMode =
	| 'air'
	| 'bus'
	| 'cableway'
	| 'coach'
	| 'funicular'
	| 'lift'
	| 'metro'
	| 'monorail'
	| 'rail'
	| 'taxi'
	| 'tram'
	| 'trolleybus'
	| 'unknown'
	| 'water'

export type TTransportSubmode =
	| 'SchengenAreaFlight'
	| 'airportBoatLink'
	| 'airportLinkBus'
	| 'airportLinkRail'
	| 'airshipService'
	| 'allFunicularServices'
	| 'allHireVehicles'
	| 'allTaxiServices'
	| 'bikeTaxi'
	| 'blackCab'
	| 'cableCar'
	| 'cableFerry'
	| 'canalBarge'
	| 'carTransportRailService'
	| 'chairLift'
	| 'charterTaxi'
	| 'cityTram'
	| 'communalTaxi'
	| 'commuterCoach'
	| 'crossCountryRail'
	| 'dedicatedLaneBus'
	| 'demandAndResponseBus'
	| 'domesticCharterFlight'
	| 'domesticFlight'
	| 'domesticScheduledFlight'
	| 'dragLift'
	| 'expressBus'
	| 'funicular'
	| 'helicopterService'
	| 'highFrequencyBus'
	| 'highSpeedPassengerService'
	| 'highSpeedRail'
	| 'highSpeedVehicleService'
	| 'hireCar'
	| 'hireCycle'
	| 'hireMotorbike'
	| 'hireVan'
	| 'intercontinentalCharterFlight'
	| 'intercontinentalFlight'
	| 'international'
	| 'internationalCarFerry'
	| 'internationalCharterFlight'
	| 'internationalCoach'
	| 'internationalFlight'
	| 'internationalPassengerFerry'
	| 'interregionalRail'
	| 'lift'
	| 'local'
	| 'localBus'
	| 'localCarFerry'
	| 'localPassengerFerry'
	| 'localTram'
	| 'longDistance'
	| 'metro'
	| 'miniCab'
	| 'mobilityBus'
	| 'mobilityBusForRegisteredDisabled'
	| 'nationalCarFerry'
	| 'nationalCoach'
	| 'nationalPassengerFerry'
	| 'nightBus'
	| 'nightRail'
	| 'postBoat'
	| 'postBus'
	| 'rackAndPinionRailway'
	| 'railReplacementBus'
	| 'railShuttle'
	| 'railTaxi'
	| 'regionalBus'
	| 'regionalCarFerry'
	| 'regionalCoach'
	| 'regionalPassengerFerry'
	| 'regionalRail'
	| 'regionalTram'
	| 'replacementRailService'
	| 'riverBus'
	| 'roadFerryLink'
	| 'roundTripCharterFlight'
	| 'scheduledFerry'
	| 'schoolAndPublicServiceBus'
	| 'schoolBoat'
	| 'schoolBus'
	| 'schoolCoach'
	| 'shortHaulInternationalFlight'
	| 'shuttleBus'
	| 'shuttleCoach'
	| 'shuttleFerryService'
	| 'shuttleFlight'
	| 'shuttleTram'
	| 'sightseeingBus'
	| 'sightseeingCoach'
	| 'sightseeingFlight'
	| 'sightseeingService'
	| 'sightseeingTram'
	| 'sleeperRailService'
	| 'specialCoach'
	| 'specialNeedsBus'
	| 'specialTrain'
	| 'streetCableCar'
	| 'suburbanRailway'
	| 'telecabin'
	| 'telecabinLink'
	| 'touristCoach'
	| 'touristRailway'
	| 'trainFerry'
	| 'trainTram'
	| 'tube'
	| 'undefined'
	| 'undefinedFunicular'
	| 'unknown'
	| 'urbanRailway'
	| 'waterTaxi'

export type TDepartureFragment = {
	aimedDepartureTime: DateTime
	expectedDepartureTime: DateTime
	aimedArrivalTime: DateTime
	expectedArrivalTime: DateTime
	cancellation: boolean
	realtime: boolean
	quay: { publicCode: string | null; name: string }
	destinationDisplay: { frontText: string | null; via: Array<string | null> | null } | null
	serviceJourney: {
		id: string
		transportMode: Types.TTransportMode | null
		transportSubmode: Types.TTransportSubmode | null
		line: {
			id: string
			publicCode: string | null
			presentation: { textColour: string | null; colour: string | null } | null
		}
		quays: Array<{ name: string }>
	}
	situations: Array<{
		id: string
		description: Array<{ value: string; language: string | null }>
		summary: Array<{ value: string; language: string | null }>
		validityPeriod: { endTime: DateTime | null } | null
	}>
}

export type TLinesFragment = {
	lines: Array<{
		id: string
		publicCode: string | null
		name: string | null
		transportMode: Types.TTransportMode | null
	}>
}

export type TSituationFragment = {
	id: string
	description: Array<{ value: string; language: string | null }>
	summary: Array<{ value: string; language: string | null }>
	validityPeriod: { endTime: DateTime | null } | null
}

export type TGetQuayQueryVariables = Exact<{
	quayId: string
	whitelistedTransportModes?:
		| Array<Types.TTransportMode | null | undefined>
		| Types.TTransportMode
		| null
		| undefined
	whitelistedLines?: Array<string | number> | string | number | null | undefined
	numberOfDepartures?: number | null | undefined
	startTime?: DateTime | null | undefined
	arrivalDeparture?: Types.TArrivalDeparture | null | undefined
}>

export type TGetQuayQuery = {
	quay: {
		name: string
		description: string | null
		publicCode: string | null
		estimatedCalls: Array<{
			aimedDepartureTime: DateTime
			expectedDepartureTime: DateTime
			aimedArrivalTime: DateTime
			expectedArrivalTime: DateTime
			cancellation: boolean
			realtime: boolean
			quay: { publicCode: string | null; name: string }
			destinationDisplay: { frontText: string | null; via: Array<string | null> | null } | null
			serviceJourney: {
				id: string
				transportMode: Types.TTransportMode | null
				transportSubmode: Types.TTransportSubmode | null
				line: {
					id: string
					publicCode: string | null
					presentation: { textColour: string | null; colour: string | null } | null
				}
				quays: Array<{ name: string }>
			}
			situations: Array<{
				id: string
				description: Array<{ value: string; language: string | null }>
				summary: Array<{ value: string; language: string | null }>
				validityPeriod: { endTime: DateTime | null } | null
			}>
		}>
		situations: Array<{
			id: string
			description: Array<{ value: string; language: string | null }>
			summary: Array<{ value: string; language: string | null }>
			validityPeriod: { endTime: DateTime | null } | null
		}>
		stopPlace: {
			situations: Array<{
				id: string
				description: Array<{ value: string; language: string | null }>
				summary: Array<{ value: string; language: string | null }>
				validityPeriod: { endTime: DateTime | null } | null
			}>
		} | null
		lines: Array<{
			id: string
			publicCode: string | null
			name: string | null
			transportMode: Types.TTransportMode | null
		}>
	} | null
}

export type TGetQuaysQueryVariables = Exact<{
	quayIds?: Array<string> | string | null | undefined
	whitelistedTransportModes?:
		| Array<Types.TTransportMode | null | undefined>
		| Types.TTransportMode
		| null
		| undefined
	whitelistedLines?: Array<string | number> | string | number | null | undefined
	numberOfDepartures?: number | null | undefined
	startTime?: DateTime | null | undefined
}>

export type TGetQuaysQuery = {
	quays: Array<{
		name: string
		description: string | null
		publicCode: string | null
		estimatedCalls: Array<{
			aimedDepartureTime: DateTime
			expectedDepartureTime: DateTime
			aimedArrivalTime: DateTime
			expectedArrivalTime: DateTime
			cancellation: boolean
			realtime: boolean
			quay: { publicCode: string | null; name: string }
			destinationDisplay: { frontText: string | null; via: Array<string | null> | null } | null
			serviceJourney: {
				id: string
				transportMode: Types.TTransportMode | null
				transportSubmode: Types.TTransportSubmode | null
				line: {
					id: string
					publicCode: string | null
					presentation: { textColour: string | null; colour: string | null } | null
				}
				quays: Array<{ name: string }>
			}
			situations: Array<{
				id: string
				description: Array<{ value: string; language: string | null }>
				summary: Array<{ value: string; language: string | null }>
				validityPeriod: { endTime: DateTime | null } | null
			}>
		}>
		situations: Array<{
			id: string
			description: Array<{ value: string; language: string | null }>
			summary: Array<{ value: string; language: string | null }>
			validityPeriod: { endTime: DateTime | null } | null
		}>
		stopPlace: {
			situations: Array<{
				id: string
				description: Array<{ value: string; language: string | null }>
				summary: Array<{ value: string; language: string | null }>
				validityPeriod: { endTime: DateTime | null } | null
			}>
		} | null
		lines: Array<{
			id: string
			publicCode: string | null
			name: string | null
			transportMode: Types.TTransportMode | null
		}>
	} | null>
}

export type TStopPlaceQueryVariables = Exact<{
	stopPlaceId: string
	whitelistedTransportModes?:
		| Array<Types.TTransportMode | null | undefined>
		| Types.TTransportMode
		| null
		| undefined
	whitelistedLines?: Array<string | number> | string | number | null | undefined
	numberOfDepartures?: number | null | undefined
	numberOfDeparturesPerLineAndDestinationDisplay?: number | null | undefined
	startTime?: DateTime | null | undefined
	arrivalDeparture?: Types.TArrivalDeparture | null | undefined
}>

export type TStopPlaceQuery = {
	stopPlace: {
		name: string
		transportMode: Array<Types.TTransportMode | null> | null
		estimatedCalls: Array<{
			aimedDepartureTime: DateTime
			expectedDepartureTime: DateTime
			aimedArrivalTime: DateTime
			expectedArrivalTime: DateTime
			cancellation: boolean
			realtime: boolean
			quay: { publicCode: string | null; name: string }
			destinationDisplay: { frontText: string | null; via: Array<string | null> | null } | null
			serviceJourney: {
				id: string
				transportMode: Types.TTransportMode | null
				transportSubmode: Types.TTransportSubmode | null
				line: {
					id: string
					publicCode: string | null
					presentation: { textColour: string | null; colour: string | null } | null
				}
				quays: Array<{ name: string }>
			}
			situations: Array<{
				id: string
				description: Array<{ value: string; language: string | null }>
				summary: Array<{ value: string; language: string | null }>
				validityPeriod: { endTime: DateTime | null } | null
			}>
		}>
		situations: Array<{
			id: string
			description: Array<{ value: string; language: string | null }>
			summary: Array<{ value: string; language: string | null }>
			validityPeriod: { endTime: DateTime | null } | null
		}>
		quays: Array<{
			id: string
			situations: Array<{
				id: string
				description: Array<{ value: string; language: string | null }>
				summary: Array<{ value: string; language: string | null }>
				validityPeriod: { endTime: DateTime | null } | null
			}>
		} | null> | null
	} | null
}
