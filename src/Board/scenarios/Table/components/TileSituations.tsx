import type { TSituationFragment } from '@/Shared/graphql'
import type { TTransportMode } from '@/Shared/types/graphql-schema'
import { transportModeNames } from '@/utils/transportMode'
import { DeviationIcon } from './DeviationIcon'

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

	return (
		situationText && (
			<div
				className="ml-em-0.25 flex w-full flex-row items-center py-3"
				lang={situationText.language}
			>
				<div
					className={`flex shrink-0 items-center justify-center ${cancelledDeparture ? 'text-error' : 'text-warning'}`}
				>
					<DeviationIcon deviationType={cancelledDeparture ? 'cancellation' : 'situation'} />
				</div>
				<div className="grow self-center">
					<p
						className={`ml-em-0.75 overflow-hidden overflow-ellipsis break-words text-em-lg/em-lg font-normal ${
							cancelledDeparture ? 'text-error' : 'text-warning'
						}`}
					>
						{transportModeWithPublicCode && (
							<b>
								{transportModeWithPublicCode}
								<>: </>
							</b>
						)}
						{situationText.text}
					</p>
				</div>
				<div
					className={`ml-8 shrink-0 justify-center self-center text-center text-em-lg/em-lg font-semibold ${cancelledDeparture ? 'text-error' : 'text-warning'}`}
				>
					{currentSituationNumber !== undefined &&
						numberOfSituations !== undefined &&
						numberOfSituations > 1 && (
							<>
								{currentSituationNumber + 1} / {numberOfSituations}
							</>
						)}
				</div>
			</div>
		)
	)
}

export { TileSituations }
