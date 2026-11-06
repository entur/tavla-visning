import { useBoardContext } from '@/Board/context'
import { removeStopPlaceSituations } from '@/Board/scenarios/Board/utils'
import { TravelTag } from '@/Shared/components/TravelTag'
import { getAirPublicCode } from '@/Shared/utils/publicCode'
import { getRelativeTimeString } from '@/Shared/utils/time'
import { isNotNullOrUndefined } from '@/Shared/utils/typeguards'
import type { TDepartureFragment, TSituationFragment } from '@/types/graphql-operations'
import { DeviationIcon } from '../DeviationIcon'

function ExpandedNextDeparture({
	departure,
	stopPlaceSituations,
	currentVisibleSituationId,
	numberOfVisibleSituations,
}: {
	departure: TDepartureFragment
	stopPlaceSituations?: TSituationFragment[]
	currentVisibleSituationId?: string
	numberOfVisibleSituations?: number
}) {
	const { isArrivals, language } = useBoardContext()

	const situations = removeStopPlaceSituations(departure.situations, stopPlaceSituations)
	const deviationType = departure.cancellation
		? 'cancellation'
		: situations.length > 0
			? 'situation'
			: 'no-deviation'

	const isHighlighted =
		numberOfVisibleSituations && numberOfVisibleSituations > 0
			? departure.situations.some((s) => s.id === currentVisibleSituationId)
			: true

	const transportMode = departure.serviceJourney.transportMode ?? 'unknown'
	const transportSubmode = departure.serviceJourney.transportSubmode ?? undefined
	const publicCode =
		transportMode === 'air'
			? (getAirPublicCode(departure.serviceJourney.id ?? '') ?? '')
			: (departure.serviceJourney.line.publicCode ?? '')

	const destination = departure.destinationDisplay?.frontText ?? ''
	const via = departure.destinationDisplay?.via?.filter(isNotNullOrUndefined).join(', ') ?? ''

	const time = isArrivals ? departure.expectedArrivalTime : departure.expectedDepartureTime

	return (
		<div className="mb-24 mt-24 lg:mb-16 lg:mt-16 flex flex-col justify-start gap-em-1 text-em-xl2">
			<div className="self-start flex items-center gap-8">
				{deviationType !== 'no-deviation' && (
					<DeviationIcon deviationType={deviationType} isHighlighted={isHighlighted} />
				)}

				<TravelTag
					transportMode={transportMode}
					transportSubmode={transportSubmode}
					publicCode={publicCode}
					cancelled={departure.cancellation}
				/>
			</div>
			<div className="flex justify-between items-center gap-em-1">
				<div className="line-clamp-1 grow overflow-hidden hyphens-auto leading-em-base text-em-xl3 lg:text-em-xl4">
					{via ? `${destination} via ${via}` : destination}
				</div>
				<div className="shrink-0 text-right leading-em-base text-em-xl3 lg:text-em-xl4 ">
					{getRelativeTimeString(time, language, false)}
				</div>
			</div>
		</div>
	)
}

export { ExpandedNextDeparture }
