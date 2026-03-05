import type { TTransportMode, TTransportSubmode } from '@/types/graphql-schema'
import { TransportIcon } from '../TransportIcon'

type ColorMode = TTransportMode | 'regional-bus'

const transportModeNames: Record<TTransportMode, string> = {
	air: 'Fly',
	bus: 'Buss',
	cableway: 'Taubane',
	water: 'Båt',
	funicular: 'Kabelbane',
	lift: 'Heis',
	rail: 'Tog',
	metro: 'T-bane',
	tram: 'Trikk',
	trolleybus: 'Trolley-buss',
	monorail: 'Énskinnebane',
	coach: 'Langdistansebuss',
	taxi: 'Taxi',
	unknown: 'Ukjent',
}

function getColorMode(
	transportMode: TTransportMode,
	transportSubmode?: TTransportSubmode,
): ColorMode {
	if (transportSubmode?.startsWith('airport')) {
		return 'air'
	} else if (transportSubmode === 'railReplacementBus') {
		return 'rail'
	} else if (transportSubmode === 'regionalBus') {
		return 'regional-bus'
	}
	return transportMode
}

function TravelTag({
	transportMode,
	publicCode,
	transportSubmode,
	cancelled,
}: {
	transportMode: TTransportMode
	publicCode: string
	transportSubmode?: TTransportSubmode
	cancelled?: boolean
}) {
	const colorMode = getColorMode(transportMode, transportSubmode)

	const travelTagBackround = `bg-${colorMode}${
		cancelled && transportMode !== 'unknown' ? '-transparent' : ''
	}`
	const iconPublicCodeColor =
		cancelled && transportMode !== 'unknown' ? `text-${colorMode}` : 'text-background'

	return (
		<div
			role="img"
			aria-label={`${transportModeNames[transportMode]} - linje ${publicCode}`}
			className={`flex h-full w-full items-center justify-between rounded-sm pl-2 ${travelTagBackround}`}
		>
			<TransportIcon
				className={`h-em-2 w-em-2 ${iconPublicCodeColor}`}
				transportMode={transportMode}
				transportSubmode={transportSubmode}
			/>
			<div
				className={`flex whitespace-nowrap h-full w-full flex-row items-center justify-center font-semibold ${iconPublicCodeColor}`}
			>
				{publicCode}
			</div>
		</div>
	)
}

export { TravelTag }
