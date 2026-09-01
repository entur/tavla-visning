import type { BoardLanguage } from '@/Shared/types/db-types/boards'
import type { TTransportMode } from '@/types/graphql-schema'

const columnLabels = {
	line: { nb: 'Linje', en: 'Line' },
	destination: { nb: 'Destinasjon', en: 'Destination' },
	stopPlace: { nb: 'Stoppested', en: 'Stop' },
	platform: { nb: 'Plattform', en: 'Platform' },
	from: { nb: 'Fra', en: 'From' },
	planned: { nb: 'Planlagt', en: 'Planned' },
	arrival: { nb: 'Ankomst', en: 'Arrival' },
	departure: { nb: 'Avgang', en: 'Departure' },
} as const

function getColumnLabel(key: keyof typeof columnLabels, language: BoardLanguage): string {
	return columnLabels[key][language]
}

const uiLabels = {
	arrived: { nb: 'Ankommet', en: 'Arrived' },
	arrivalsHeading: { nb: 'Ankomster', en: 'Arrivals' },
	cancelled: { nb: 'Innstilt', en: 'Cancelled' },
	now: { nb: 'Nå', en: 'Now' },
	loadingArrivals: { nb: 'Henter ankomster..', en: 'Fetching arrivals..' },
	loadingDepartures: { nb: 'Henter avganger..', en: 'Fetching departures..' },
	noArrivalsNearFuture: {
		nb: 'Ingen ankomster i nærmeste fremtid',
		en: 'No arrivals in the near future',
	},
	noDeparturesNearFuture: {
		nb: 'Ingen avganger i nærmeste fremtid',
		en: 'No departures in the near future',
	},
	noArrivalsNext24Hours: {
		nb: 'Ingen ankomster de neste 24 timene.',
		en: 'No arrivals in the next 24 hours.',
	},
	noDeparturesNext24Hours: {
		nb: 'Ingen avganger de neste 24 timene.',
		en: 'No departures in the next 24 hours.',
	},
	noColumnsAdded: {
		nb: 'Du har ikke lagt til noen kolonner ennå',
		en: "You haven't added any columns yet",
	},
	noStopPlacesAdded: {
		nb: 'Du har ikke lagt til noen stoppesteder ennå.',
		en: "You haven't added any stop places yet.",
	},
	boardLogoAlt: { nb: 'Logo til tavlen', en: 'Board logo' },
} as const

function getUiLabel(key: keyof typeof uiLabels, language: BoardLanguage): string {
	return uiLabels[key][language]
}

const transportModeToPlatformMapping = {
	air: { nb: 'Gate', en: 'Gate' },
	bus: { nb: 'Plattform', en: 'Platform' },
	cableway: { nb: 'Plattform', en: 'Platform' },
	coach: { nb: 'Plattform', en: 'Platform' },
	funicular: { nb: 'Plattform', en: 'Platform' },
	lift: { nb: 'Plattform', en: 'Platform' },
	metro: { nb: 'Spor', en: 'Track' },
	monorail: { nb: 'Spor', en: 'Track' },
	rail: { nb: 'Spor', en: 'Track' },
	taxi: { nb: 'Plattform', en: 'Platform' },
	tram: { nb: 'Plattform', en: 'Platform' },
	trolleybus: { nb: 'Plattform', en: 'Platform' },
	unknown: { nb: 'Plattform', en: 'Platform' },
	water: { nb: 'Kai', en: 'Quay' },
} as Readonly<Record<TTransportMode, { nb: string; en: string }>>

function getPlatformLabel(transportModes: TTransportMode[], language: BoardLanguage): string {
	const mappedTransportModes = transportModes.map(
		(transportMode) => transportModeToPlatformMapping[transportMode][language],
	)

	const uniqueMappedTransportModes = Array.from(new Set(mappedTransportModes))

	if (uniqueMappedTransportModes.length === 1) {
		return uniqueMappedTransportModes[0]
	}

	return transportModeToPlatformMapping.unknown[language]
}

export { getColumnLabel, getUiLabel, getPlatformLabel }
