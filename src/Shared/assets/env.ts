export type TEndpointNames = 'journey-planner' | 'mobility' | 'vehicles'

export const GRAPHQL_ENDPOINTS: Record<TEndpointNames, string> = {
	'journey-planner': 'https://api.entur.io/journey-planner/v3/graphql',
	mobility: 'https://api.entur.io/mobility/v2/graphql',
	vehicles: 'https://api.entur.io/realtime/v1/vehicles/graphql',
}

export const COUNTY_ENDPOINT = 'https://ws.geonorge.no/kommuneinfo/v1/fylker'
export const GEOCODER_ENDPOINT = 'https://api.entur.io/geocoder/v1'

export const CLIENT_NAME = 'entur-tavla'

export function getBackendUrl() {
	if (import.meta.env.DEV) {
		return 'http://localhost:3000'
	}

	const host = window.location.hostname
	if (host.includes('localhost')) return 'http://localhost:3000'
	if (host.includes('dev.entur.no')) return 'https://tavla.dev.entur.no'
	return 'https://tavla.entur.no'
}

export const BOARD_API_URL = getBackendUrl()
