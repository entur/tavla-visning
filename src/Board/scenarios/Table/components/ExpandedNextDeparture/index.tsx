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
		<div className="mb-[12vh] mt-[15vh] flex flex-col justify-start gap-8 text-em-xl2">
			<div className="self-start">
				<TravelTag
					transportMode={transportMode}
					transportSubmode={transportSubmode}
					publicCode={publicCode}
					cancelled={departure.cancellation}
				/>
			</div>
			<div className="flex justify-between items-center gap-4 lg:gap-8">
				<DeviationIcon deviationType={deviationType} isHighlighted={isHighlighted} />
				<div className="flex w-full justify-between items-center gap-24">
					<div className="hyphens-auto text-em-xl3 lg:text-em-xl4">
						{via ? `${destination} via ${via}` : destination}
					</div>
					<div className="text-right">
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
