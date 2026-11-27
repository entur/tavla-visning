import { Heading3, Paragraph } from '@entur/typography'
import type { BoardLanguage } from '@/Shared/types/db-types/boards'
import { getUiLabel } from '@/Shared/utils/translations'

export const FetchErrorTypes = {
	ABORT: 'AbortError',
} as const
export type FetchErrorTypes = (typeof FetchErrorTypes)[keyof typeof FetchErrorTypes]

function getHeading(language: BoardLanguage, error?: Error) {
	switch (error?.name) {
		case FetchErrorTypes.ABORT:
			return getUiLabel('fetchTimeoutHeading', language)
		default:
			return getUiLabel('fetchFailedHeading', language)
	}
}

function DataFetchingFailed({ error, language }: { error?: Error; language: BoardLanguage }) {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center">
			<div className="w-full text-center">
				<Heading3 className="!text-primary">{getHeading(language, error)}</Heading3>
				<Paragraph className="!text-primary">{getUiLabel('fetchFailedRetry', language)}</Paragraph>
			</div>
		</div>
	)
}

export { DataFetchingFailed }
