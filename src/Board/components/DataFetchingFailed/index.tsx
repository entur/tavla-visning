import { Heading3, Paragraph } from '@entur/typography'

export const FetchErrorTypes = {
	ABORT: 'AbortError',
} as const
export type FetchErrorTypes = (typeof FetchErrorTypes)[keyof typeof FetchErrorTypes]

function getHeading(error?: Error) {
	switch (error?.name) {
		case FetchErrorTypes.ABORT:
			return 'Innlasting av avganger tok for lang tid!'
		default:
			return 'Får ikke hentet avganger'
	}
}

function DataFetchingFailed({ error }: { error?: Error }) {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center">
			<div className="w-full text-center">
				<Heading3 className="!text-primary">{getHeading(error)}</Heading3>
				<Paragraph className="!text-primary">
					Tavla prøver igjen automatisk. Hvis feilen vedvarer, kontakt oss på tavla@entur.org
				</Paragraph>
			</div>
		</div>
	)
}

export { DataFetchingFailed }
