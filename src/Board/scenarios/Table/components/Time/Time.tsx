import { useContext } from 'react'
import { HasFetchErrorContext } from '@/Board/scenarios/Table/contexts'
import type { BoardLanguage } from '@/Shared/types/db-types/boards'
import { getServerNow } from '@/Shared/utils/serverTime'
import { formatDateString, getRelativeTimeString } from '@/Shared/utils/time'
import { getUiLabel } from '@/Shared/utils/translations'
import { FormattedTime } from './components/FormattedTime'

const TWO_MINUTES = 120

type TimeSize = 'default' | 'large' | 'hero'

function Time({
	expectedTime,
	aimedTime,
	cancelled,
	isArrivalBoard,
	language,
	size = 'default',
}: {
	expectedTime: string
	aimedTime: string
	cancelled: boolean
	isArrivalBoard?: boolean
	language: BoardLanguage
	size?: TimeSize
}) {
	const hasFetchError = useContext(HasFetchErrorContext)
	const isLarge = size !== 'default'
	const align = size === 'hero' ? 'text-center' : 'text-right'
	const primaryTextSize =
		size === 'hero' ? 'text-em-xl5' : size === 'large' ? 'text-em-xl3 lg:text-em-xl4' : 'text-em-xl'

	const primaryClass = `${align} leading-em-base ${primaryTextSize}`
	const secondaryClass = `${align} ${isLarge ? 'text-em-lg' : 'text-em-sm/em-xs'}`

	if (cancelled)
		return (
			<>
				<div
					className={`${align} font-semibold text-cancelled-time leading-tight ${size === 'hero' ? 'text-em-xl4' : isLarge ? 'text-em-xl2' : 'text-em-lg/em-lg'}`}
				>
					{getUiLabel('cancelled', language)}
				</div>
				<div
					className={`lineThrough ${align} ${isLarge ? 'text-em-lg leading-tight' : 'text-em-sm/em-sm'}`}
				>
					{formatDateString(aimedTime)}
				</div>
			</>
		)

	const secondsSinceArrival = (getServerNow() - Date.parse(expectedTime)) / 1000

	if (isArrivalBoard && secondsSinceArrival > TWO_MINUTES) {
		return (
			<>
				<div className={primaryClass}>{formatDateString(expectedTime)}</div>
				<div className={secondaryClass}>{getUiLabel('arrived', language)}</div>
			</>
		)
	}

	const secondsDeviation = (Date.parse(aimedTime) - Date.parse(expectedTime)) / 1000
	const timeDeviationInSeconds = Math.abs(secondsDeviation)
	const isEarly = secondsDeviation > 0

	const delayMoreThanTwoMinutes = !isEarly && timeDeviationInSeconds > TWO_MINUTES
	const showStrikethrough = timeDeviationInSeconds > TWO_MINUTES

	if (delayMoreThanTwoMinutes)
		return (
			<>
				<div className={primaryClass}>
					{getRelativeTimeString(expectedTime, language, hasFetchError)}
				</div>
				<div className={`lineThrough ${secondaryClass}`}>{formatDateString(aimedTime)}</div>
			</>
		)

	if (showStrikethrough)
		return (
			<>
				<FormattedTime time={expectedTime} size={size} />
				<div className={`lineThrough ${secondaryClass}`}>{formatDateString(aimedTime)}</div>
			</>
		)

	return <FormattedTime time={expectedTime} size={size} />
}

export { Time }
