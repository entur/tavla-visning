import { PageNavigationIcon } from '@entur/icons'
import { useBoardContext } from '@/Board/context'
import type { TSituationWithOrigin } from '@/Board/hooks/useTileData'

const getShortOrigin = (origin?: string) => {
	if (!origin?.includes(', ')) {
		return origin
	}

	const parts = origin.split(', ')
	const wordsPerPart = parts.map((part) => part.split(' '))

	const bases = wordsPerPart.map((words) => words.slice(0, -1).join(' '))
	const baseSet = new Set(bases)
	if (baseSet.size !== 1) {
		return origin
	}
	const [baseValue] = baseSet

	const numbers = wordsPerPart.map((words) => Number(words.at(-1)))
	if (numbers.some((number) => Number.isNaN(number))) {
		return origin
	}

	const isConsecutive = numbers.every(
		(number, index) => index === 0 || number === numbers[index - 1] + 1,
	)

	if (isConsecutive) {
		return `${baseValue} ${numbers[0]}-${numbers[numbers.length - 1]}`
	}

	return `${baseValue} ${numbers.join(', ')}`
}

function TitleSituation({
	situation,
}: {
	situation: TSituationWithOrigin | undefined
	origin?: string
}) {
	const { language } = useBoardContext()
	const preferredLanguage = language === 'en' ? 'en' : 'no'

	const situationText =
		situation?.summary.find((summary) => summary.language === preferredLanguage)?.value ??
		situation?.summary.find((summary) => summary.language === 'no')?.value ??
		situation?.summary[0]?.value ??
		situation?.description.find((desc) => desc.language === preferredLanguage)?.value ??
		situation?.description.find((desc) => desc.language === 'no')?.value ??
		situation?.description[0]?.value ??
		null

	const origin = situation?.origin
	const shortOrigin = getShortOrigin(origin)

	if (!situationText) return null

	return (
		<div className="mt-[0.1em] flex min-h-max items-center gap-[8px] text-em-situation/em-situation text-warning">
			<div className="flex self-start pt-[0.05em] text-[1.8em]">
				<PageNavigationIcon aria-hidden="true" size="0.5em" />
			</div>
			<p className="font-normal">
				{origin && <b>{`${shortOrigin}: `}</b>}
				{situationText}
			</p>
		</div>
	)
}

export { TitleSituation }
