import { HomeIcon, MapPinIcon } from '@entur/icons'
import type { BoardLanguage } from '@/Shared/types/db-types/boards'
import type { TTransportMode } from '../types/graphql-schema'

export type TLineFragment = {
	__typename?: 'Line'
	id: string
	publicCode: string | null
	name: string | null
	transportMode: TTransportMode | null
}

export function sortLineByPublicCode(a: TLineFragment, b: TLineFragment) {
	if (!a || !a.publicCode || !b || !b.publicCode) return 1

	const containsLetters = /[a-zæøåA-ZÆØÅ]/
	const aContainsLetters = containsLetters.test(a.publicCode)
	const bContainsLetters = containsLetters.test(b.publicCode)

	if (aContainsLetters && !bContainsLetters) return 1
	else if (!aContainsLetters && bContainsLetters) return -1

	return a.publicCode.localeCompare(b.publicCode, 'no-NB', {
		numeric: true,
	})
}

export function sortPublicCodes(a: string, b: string) {
	if (!a || !b) return 1

	const containsLetters = /[a-zæøåA-ZÆØÅ]/
	const aContainsLetters = containsLetters.test(a)
	const bContainsLetters = containsLetters.test(b)

	if (aContainsLetters && !bContainsLetters) return 1
	else if (!aContainsLetters && bContainsLetters) return -1

	return a.localeCompare(b, 'no-NB', {
		numeric: true,
	})
}

export function transportModeNames(
	transportMode: TTransportMode | null | undefined,
	language: BoardLanguage = 'nb',
) {
	const isEnglish = language === 'en'

	switch (transportMode) {
		case 'air':
			return isEnglish ? 'Air' : 'Fly'
		case 'bus':
			return isEnglish ? 'Bus' : 'Buss'
		case 'cableway':
			return isEnglish ? 'Cable car' : 'Kabelbane'
		case 'water':
			return isEnglish ? 'Boat' : 'Båt'
		case 'funicular':
			return isEnglish ? 'Funicular' : 'Taubane'
		case 'lift':
			return isEnglish ? 'Lift' : 'Heis'
		case 'rail':
			return isEnglish ? 'Train' : 'Tog'
		case 'metro':
			return isEnglish ? 'Metro' : 'T-bane'
		case 'tram':
			return isEnglish ? 'Tram' : 'Trikk'
		case 'trolleybus':
			return isEnglish ? 'Trolleybus' : 'Trolley-buss'
		case 'monorail':
			return isEnglish ? 'Monorail' : 'Enskinnebane'
		case 'coach':
			return isEnglish ? 'Coach' : 'Langdistansebuss'
		case 'taxi':
			return isEnglish ? 'Taxi' : 'Taxi'
		case 'unknown':
			return isEnglish ? 'Unknown' : 'Ukjent'
		default:
			return null
	}
}

export type TCategory =
	| 'onstreetBus'
	| 'onstreetTram'
	| 'airport'
	| 'railStation'
	| 'metroStation'
	| 'busStation'
	| 'coachStation'
	| 'tramStation'
	| 'harbourPort'
	| 'ferryPort'
	| 'ferryStop'
	| 'liftStation'
	| 'vehicleRailInterchange'
	| 'poi'
	| 'vegadresse'

export function categoryToTransportmode(category: TCategory): TTransportMode {
	switch (category) {
		case 'onstreetBus':
		case 'busStation':
		case 'coachStation':
			return 'bus'
		case 'tramStation':
		case 'onstreetTram':
			return 'tram'
		case 'railStation':
			return 'rail'
		case 'harbourPort':
		case 'ferryPort':
		case 'ferryStop':
			return 'water'
		case 'liftStation':
			return 'lift'
		case 'metroStation':
			return 'metro'
		case 'airport':
			return 'air'
		default:
			return 'unknown'
	}
}

export function getVenueIcon(category: TCategory) {
	switch (category) {
		case 'vegadresse':
			return HomeIcon
		default:
			return MapPinIcon
	}
}

export function isEmptyOrSpaces(str?: string) {
	return str === undefined || str?.match(/^ *$/) !== null
}
export function isOnlyWhiteSpace(str: string) {
	if (str === undefined || str === null || str === '') return false

	return str.trim() === ''
}
