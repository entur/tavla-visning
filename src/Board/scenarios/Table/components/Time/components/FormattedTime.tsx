import { useContext } from 'react'
import { useBoardContext } from '@/Board/context'
import { getDate, getRelativeTimeString, isDateStringToday } from '@/Shared/utils/time'
import { HasFetchErrorContext } from '@/Board/scenarios/Table/contexts'

function FormattedTime({
	time,
	className,
	size = 'default',
}: {
	time: string
	className?: string
	size?: 'default' | 'large'
}) {
	const { language } = useBoardContext()
	const hasFetchError = useContext(HasFetchErrorContext)
	const primaryTextSize = size === 'large' ? 'text-em-xl3 lg:text-em-xl4' : 'text-em-xl'

	return (
		<>
			<div
				className={`text-nowrap text-right leading-em-base ${primaryTextSize}${className ? ` ${className}` : ''}`}
			>
				{getRelativeTimeString(time, language, hasFetchError)}
			</div>
			{!isDateStringToday(time) && (
				<div className="text-right text-em-sm/em-sm">{getDate(time, language)}</div>
			)}
		</>
	)
}

export { FormattedTime }
