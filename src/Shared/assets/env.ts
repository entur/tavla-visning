export type TEndpointNames = 'journey-planner' | 'mobility' | 'vehicles'

export const GRAPHQL_ENDPOINTS: Record<TEndpointNames, string> = {
	'journey-planner': 'https://api.entur.io/journey-planner/v3/graphql',
	mobility: 'https://api.entur.io/mobility/v2/graphql',
	vehicles: 'https://api.entur.io/realtime/v1/vehicles/graphql',
}

export const CLIENT_NAME = 'entur-tavla'

function getBoardApiUrl() {
	if (import.meta.env.DEV) {
		return 'http://localhost:3000'
	}

	const host = window.location.hostname
	if (host.includes('localhost')) return 'http://localhost:3000'
	if (host.includes('dev.entur.no')) return 'https://tavla.dev.entur.no'
	return 'https://tavla.entur.no'
}

function getBackendApiUrl() {
	if (import.meta.env.DEV) {
		return 'http://localhost:3001'
	}

	const host = window.location.hostname
	if (host.includes('localhost')) return 'http://localhost:3001'
	if (host.includes('dev.entur.no')) return 'https://tavla-api.dev.entur.no'
	return 'https://tavla-api.entur.no'
}

export const BOARD_API_URL = getBoardApiUrl()
export const BACKEND_API_URL = getBackendApiUrl()
export const ERROR_REPORT_URL = `${BOARD_API_URL}/api/report-error`
