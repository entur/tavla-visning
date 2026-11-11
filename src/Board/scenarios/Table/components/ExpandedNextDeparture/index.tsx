import { useBoardContext } from '@/Board/context'
import { removeStopPlaceSituations } from '@/Board/scenarios/Board/utils'
import { DeviationIcon } from '@/Board/scenarios/Table/components/DeviationIcon'
import { Time } from '@/Board/scenarios/Table/components/Time/Time'
import { TravelTag } from '@/Shared/components/TravelTag'
import { getAirPublicCode } from '@/Shared/utils/publicCode'
import { isNotNullOrUndefined } from '@/Shared/utils/typeguards'
import type { TDepartureFragment, TSituationFragment } from '@/types/graphql-operations'

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

	const expectedTime = isArrivals ? departure.expectedArrivalTime : departure.expectedDepartureTime
	const aimedTime = isArrivals ? departure.aimedArrivalTime : departure.aimedDepartureTime

	return (
		<div className="flex h-2/5 flex-col justify-center text-em-xl2 ">
			<div className="self-start">
				<TravelTag
					transportMode={transportMode}
					transportSubmode={transportSubmode}
					publicCode={publicCode}
					cancelled={departure.cancellation}
				/>
			</div>
			<div className="flex justify-between items-center mt-4">
				<div
					className={`mt-4 mr-4 lg:mt-8 ${deviationType !== 'no-deviation' ? 'block' : 'hidden'}`}
				>
					<DeviationIcon deviationType={deviationType} isHighlighted={isHighlighted} />
				</div>
				<div className="flex w-full justify-between items-center mt-4">
					<div className="text-em-xl3 hyphens-auto lg:text-em-xl4 leading-tight">
						{via ? `${destination} via ${via}` : destination}
					</div>
					<div className="text-right ml-8">
						<Time
							expectedTime={expectedTime}
							aimedTime={aimedTime}
							cancelled={departure.cancellation}
							isArrivalBoard={isArrivals}
							language={language}
							size="large"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export { ExpandedNextDeparture }
