import type { BoardLanguage } from '@/Shared/types/db-types/boards'

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
} as const

function getUiLabel(key: keyof typeof uiLabels, language: BoardLanguage): string {
	return uiLabels[key][language]
}

export { getColumnLabel, getUiLabel }
