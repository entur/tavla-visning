import { useBoardContext } from '@/Board/context'
import { getDate, getRelativeTimeString, isDateStringToday } from '@/Shared/utils/time'

function FormattedTime({ time, className }: { time: string; className?: string }) {
	const { language } = useBoardContext()

	return (
		<>
			<div
				className={`text-nowrap text-right text-em-xl leading-em-base${className ? ` ${className}` : ''}`}
			>
				{getRelativeTimeString(time)}
			</div>
			{!isDateStringToday(time) && (
				<div className="text-right text-em-sm/em-sm">{getDate(time, language)}</div>
			)}
		</>
	)
}

export { FormattedTime }
