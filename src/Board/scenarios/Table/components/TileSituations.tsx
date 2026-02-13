import { DeviationIcon } from '@/Board/scenarios/Table/components/DeviationIcon'
import type { TSituationFragment, TTransportMode } from '@/types/graphql-schema'
import { transportModeNames } from '@/utils/transportMode'

const SITUATION_SUMMARY_LENGTH_THRESHOLD = 25

function getSituationText(
	situation: TSituationFragment,
): { text: string; language: 'no' | 'en' } | undefined {
	const norwegianSummary = situation?.summary.find((summary) => summary.language === 'no')?.value
	const summary = norwegianSummary ?? situation?.summary[0]?.value

	const norwegianDescription = situation?.description.find(
		(description) => description.language === 'no',
	)?.value

	const description = norwegianDescription ?? situation?.description[0]?.value

	if (description === undefined) {
		return { text: summary, language: norwegianSummary ? 'no' : 'en' }
	} else if (summary === undefined) {
		return { text: description, language: norwegianDescription ? 'no' : 'en' }
	} else if (summary.length <= SITUATION_SUMMARY_LENGTH_THRESHOLD) {
		return {
			text: `${summary} - ${description}`,
			language: norwegianSummary ? 'no' : 'en',
		}
	} else {
		return { text: summary, language: norwegianSummary ? 'no' : 'en' }
	}
}

function getTransportModeAndPublicCodeText(
	transportModeList?: TTransportMode[],
	publicCodeList?: string[],
): string | null {
	if (transportModeList && publicCodeList) {
		const transportMode =
			transportModeList.length === 1 ? transportModeNames(transportModeList[0]) : 'Linje'
		const publicCodes = publicCodeList.length === 1 ? publicCodeList[0] : publicCodeList.join(', ')

		return `${transportMode} ${publicCodes}`
	} else {
		return null
	}
}

function TileSituations({
	situation,
	cancelledDeparture,
	currentSituationNumber,
	numberOfSituations,
	publicCodeList,
	transportModeList,
}: {
	situation?: TSituationFragment
	cancelledDeparture: boolean
	currentSituationNumber?: number
	numberOfSituations?: number
	transportModeList?: TTransportMode[]
	publicCodeList?: string[]
}) {
	if (!situation) {
		return null
	}

	const situationText = getSituationText(situation)
	const transportModeWithPublicCode = getTransportModeAndPublicCodeText(
		transportModeList,
		publicCodeList,
	)
	const textColor = cancelledDeparture ? 'error' : 'warning'

	if (!situationText) {
		return null
	}

	return (
		<div className={'text-em-lg/em-lg whitespace-normal'} lang={situationText.language}>
			<div className="table w-full mt-em-0.5">
				<div className="table-row">
					<div className="table-cell align-top pr-2 w-em-2">
						<DeviationIcon deviationType={cancelledDeparture ? 'cancellation' : 'situation'} />
					</div>

					<div
						className={`table-cell align-top whitespace-normal break-words font-normal ${
							cancelledDeparture ? 'text-error' : 'text-warning'
						}`}
					>
						{transportModeWithPublicCode && <b>{transportModeWithPublicCode}: </b>}
						{situationText.text}
					</div>
				</div>
			</div>
			<span className="inline-block w-full mt-em-0.25 mb-em-0.5 ">
				<div className="flex flex-row w-full items-center justify-end">
					<span className={`whitespace-nowrap text-${textColor} font-semibold`}>
						{currentSituationNumber !== undefined && numberOfSituations !== undefined && (
							<>
								{currentSituationNumber + 1} / {numberOfSituations}
							</>
						)}
					</span>
				</div>
			</span>
		</div>
	)
}

export { TileSituations }
