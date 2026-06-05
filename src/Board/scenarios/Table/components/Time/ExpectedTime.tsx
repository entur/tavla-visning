import { nanoid } from 'nanoid'
import { useBoardContext } from '@/Board/context'
import { useNonNullContext } from '@/Shared/hooks/useNonNullContext'
import { formatDateString, getRelativeTimeString } from '@/Shared/utils/time'
import { DeparturesContext } from '../../contexts'
import { TableCell } from '../TableCell'
import { TableColumn } from '../TableColumn'
import { FormattedTime } from './components/FormattedTime'

const TWO_MINUTES = 120

function ExpectedTime() {
	const departures = useNonNullContext(DeparturesContext)
	const { isArrivals } = useBoardContext()

	const time = departures.map((departure) => ({
		aimedTime: isArrivals ? departure.aimedArrivalTime : departure.aimedDepartureTime,
		expectedTime: isArrivals ? departure.expectedArrivalTime : departure.expectedDepartureTime,
		cancelled: departure.cancellation,
		key: nanoid(),
	}))

	return (
		<TableColumn title="Forventet" className="text-right">
			{time.map((t) => (
				<TableCell key={t.key}>
					<Time
						expectedTime={t.expectedTime}
						aimedTime={t.aimedTime}
						cancelled={t.cancelled}
						isArrivalBoard={isArrivals}
					/>
				</TableCell>
			))}
		</TableColumn>
	)
}

function Time({
	expectedTime,
	aimedTime,
	cancelled,
	isArrivalBoard,
}: {
	expectedTime: string
	aimedTime: string
	cancelled: boolean
	isArrivalBoard?: boolean
}) {
	if (cancelled)
		return (
			<>
				<div className="text-right text-em-lg/em-lg font-semibold text-estimated-time">
					Innstilt
				</div>
				<div className="lineThrough text-right text-em-sm/em-sm">{formatDateString(aimedTime)}</div>
			</>
		)

	const secondsSinceArrival = (Date.now() - Date.parse(expectedTime)) / 1000

	if (isArrivalBoard && secondsSinceArrival > TWO_MINUTES) {
		return (
			<>
				<div className="text-right text-em-xl leading-em-base">
					{formatDateString(expectedTime)}
				</div>
				<div className="text-right text-em-sm/em-xs">Ankommet</div>
			</>
		)
	}
	const secondsDeviation = (Date.parse(aimedTime) - Date.parse(expectedTime)) / 1000
	const timeDeviationInSeconds = Math.abs(secondsDeviation)
	const isEarly = secondsDeviation > 0

	const delayMoreThanTwoMinutes = !isEarly && timeDeviationInSeconds > TWO_MINUTES
	const showStrikethrough =
		isEarly || (isArrivalBoard ? timeDeviationInSeconds > 0 : delayMoreThanTwoMinutes)

	if (delayMoreThanTwoMinutes)
		return (
			<>
				<div className="text-right text-em-xl leading-em-base text-estimated-time">
					{getRelativeTimeString(expectedTime)}
				</div>
				<div className="lineThrough text-right text-em-sm/em-xs">{formatDateString(aimedTime)}</div>
			</>
		)

	if (showStrikethrough)
		return (
			<>
				<FormattedTime time={expectedTime} />
				<div className="lineThrough text-right text-em-sm/em-xs">{formatDateString(aimedTime)}</div>
			</>
		)

	return <FormattedTime time={expectedTime} />
}

export { ExpectedTime }
