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

/** A collection of selectors for what estimated calls should be included / excluded. At least one of `select` or `not` must be provided. The `select` is always applied first, then `not`. If only `not` is present, the exclude is applied to the existing set of estimated calls. */
export type TEstimatedCallFilterInput = {
	/** A list of selectors for what estimated calls should be excluded during the search. If a call matches with at least one selector it will be excluded. */
	not?: Array<TEstimatedCallSelectInput> | null | undefined
	/** A list of selectors for what estimated calls should be included. A call is included if it matches at least one selector. Omit the field to include all calls. An empty list is not allowed. */
	select?: Array<TEstimatedCallSelectInput> | null | undefined
}

/** A selector for filter allow-list / exclude-list. At least one field must be provided. An estimated call matches a selector if it matches all fields. Within each field, a call matches if it matches any of the listed values. */
export type TEstimatedCallSelectInput = {
	/** Set of ids for authorities that should be included in/excluded from search. A call matches if its authority matches any of the given IDs. An empty list is not allowed. Omit the field to match all authorities. */
	authorities?: Array<string | number> | null | undefined
	/** Set of ids for lines that should be included in/excluded from search. A call matches if its line matches any of the given IDs. An empty list is not allowed. Omit the field to match all lines. */
	lines?: Array<string | number> | null | undefined
	/** The allowed modes for the estimated call. A call matches if its mode matches any of the listed modes. An empty list is not allowed. Omit the field to match all modes. Omitting main mode (transportMode) is also not allowed. */
	transportModes?: Array<TTransportModes> | null | undefined
}

export type TTransportMode =
	| 'air'
	| 'bus'
	| 'cableway'
	| 'carpool'
	| 'coach'
	| 'funicular'
	| 'lift'
	| 'metro'
	| 'monorail'
	| 'rail'
	| 'snowAndIce'
	| 'taxi'
	| 'tram'
	| 'trolleybus'
	/** Unknown transport mode. No trip, line or stop has this mode. */
	| 'unknown'
	| 'water'

export type TTransportModes = {
	/** A transportMode that should be allowed for this search. You can furthernarrow it down by specifying a list of transportSubModes */
	transportMode?: TTransportMode | null | undefined
	/** The allowed transportSubModes for this search. If this element is notpresent or null, it will default to all transportSubModes for the specifiedTransportMode. Be aware that all transportSubModes have an associated TransportMode, which must match what is specified in the transportMode field. */
	transportSubModes?: Array<TTransportSubmode | null | undefined> | null | undefined
}

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
	filters?:
		| Array<Types.TEstimatedCallFilterInput>
		| Types.TEstimatedCallFilterInput
		| null
		| undefined
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
	filters?:
		| Array<Types.TEstimatedCallFilterInput>
		| Types.TEstimatedCallFilterInput
		| null
		| undefined
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
	filters?:
		| Array<Types.TEstimatedCallFilterInput>
		| Types.TEstimatedCallFilterInput
		| null
		| undefined
	numberOfDepartures?: number | null | undefined
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
			publicCode: string | null
			situations: Array<{
				id: string
				description: Array<{ value: string; language: string | null }>
				summary: Array<{ value: string; language: string | null }>
				validityPeriod: { endTime: DateTime | null } | null
			}>
		} | null> | null
	} | null
}
