import { useContext } from 'react'
import { useBoardContext } from '@/Board/context'
import { HasFetchErrorContext } from '@/Board/scenarios/Table/contexts'
import { getDate, getRelativeTimeString, isDateStringToday } from '@/Shared/utils/time'

function FormattedTime({
	time,
	className,
	size = 'default',
}: {
	time: string
	className?: string
	size?: 'default' | 'large' | 'hero'
}) {
	const { language } = useBoardContext()
	const hasFetchError = useContext(HasFetchErrorContext)
	const align = size === 'hero' ? 'text-center' : 'text-right'
	const primaryTextSize =
		size === 'hero' ? 'text-em-xl5' : size === 'large' ? 'text-em-xl3 lg:text-em-xl4' : 'text-em-xl'

	return (
		<>
			<div
				className={`text-nowrap ${align} leading-em-base ${primaryTextSize}${className ? ` ${className}` : ''}`}
			>
				{getRelativeTimeString(time, language, hasFetchError)}
			</div>
			{!isDateStringToday(time) && (
				<div className={`${align} text-em-sm/em-sm`}>{getDate(time, language)}</div>
			)}
		</>
	)
}

export { FormattedTime }
