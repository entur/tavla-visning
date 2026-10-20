import { useContext } from 'react'
import { useBoardContext } from '@/Board/context'
import { getDate, getRelativeTimeString, isDateStringToday } from '@/Shared/utils/time'
import { HasFetchErrorContext } from '@/Board/scenarios/Table/contexts'

function FormattedTime({ time, className }: { time: string; className?: string }) {
	const { language } = useBoardContext()
	const hasFetchError = useContext(HasFetchErrorContext)

	return (
		<>
			<div
				className={`text-nowrap text-right text-em-xl leading-em-base${className ? ` ${className}` : ''}`}
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
