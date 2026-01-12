import { Button } from '@entur/button'
import { Heading3 } from '@entur/typography'
import BeaverIllustration from './Shared/assets/illustrations/BeaverIllustration.png'
import { Loader } from '@entur/loader'
import type { BoardDB } from './Shared/types/db-types/boards'

interface BoardStatusProps {
	loading: boolean
	error: string | null
	board: BoardDB | null
	theme?: string
}

export function BoardStatus({ loading, error, board, theme }: BoardStatusProps) {
	const containerClass = 'flex h-screen w-full items-center flex-col justify-center text-2xl'

	if (loading) {
		return (
			<div className={containerClass}>
				<p>Laster tavle...</p>
				<Loader />
			</div>
		)
	}

	if (error) {
		return (
			<div className="mx-auto flex h-[70vh] flex-col items-center justify-center gap-5 lg:w-1/4">
				<Heading3 data-color-mode={theme} className="bg-transparent">
					Ups, denne tavla finnes ikke!
				</Heading3>

				<img
					src={BeaverIllustration}
					className="w-1/2 lg:w-1/2"
					alt="Illustrasjon av en forundret bever"
				/>

				<Button href="https://tavla.entur.no" variant="primary" as="a" data-color-mode={theme}>
					Tilbake til forsiden
				</Button>
			</div>
		)
	}

	if (!board) {
		return <div className={containerClass}>Fant ikke tavle</div>
	}

	return null
}
