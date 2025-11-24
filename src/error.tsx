import { Loader } from '@entur/loader'
import type { BoardDB } from './Shared/types/db-types/boards'

interface BoardStatusProps {
	loading: boolean
	error: string | null
	board: BoardDB | null
}

export function BoardStatus({ loading, error, board }: BoardStatusProps) {
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
		return <div className={containerClass}>Feil ved lasting av tavle: {error}</div>
	}

	if (!board) {
		return <div className={containerClass}>Fant ikke tavle</div>
	}

	return null
}
