import type { TSituationFragment } from '@/types/graphql-schema'
import { useCycler } from '../../useCycler'
import { TitleSituation } from '../Situation'

const timerInMilliseconds = 10000

function filterValidSituations(situations?: TSituationFragment[]): TSituationFragment[] {
	if (!situations) return []
	const now = Date.now()
	return situations.filter((s) => {
		const endTime = s.validityPeriod?.endTime
		return !endTime || new Date(endTime).getTime() > now
	})
}

function StopPlaceQuayDeviation({ situations }: { situations?: TSituationFragment[] }) {
	const validSituations = filterValidSituations(situations)
	const index = useCycler(validSituations, timerInMilliseconds)
	const numberOfSituations = validSituations.length

	if (numberOfSituations === 0) return null
	return (
		<div className="mt-[-.5em] min-h-[1.5em]">
			<TitleSituation situation={validSituations[index % numberOfSituations]} />
		</div>
	)
}

function CombinedTileDeviation({ situations }: { situations?: TSituationFragment[] }) {
	const validSituations = filterValidSituations(situations)
	const index = useCycler(validSituations, timerInMilliseconds)
	const numberOfSituations = validSituations.length

	if (numberOfSituations === 0) return null

	return (
		<div className="mt-[0.5em] min-h-[1.5em] pb-[1em]">
			<TitleSituation situation={validSituations[index % numberOfSituations]} />
		</div>
	)
}

export { CombinedTileDeviation, StopPlaceQuayDeviation }
