import { getFontScale } from '@/Board/scenarios/Board/utils'
import type { BoardDB, BoardTheme } from '@/Shared/types/db-types/boards'
import EnturLogoBlue from '../../assets/logos/Tavla-blue.svg'
import EnturLogoWhite from '../../assets/logos/Tavla-white.svg'

function InfoMessage({ board, showEnturLogo }: { board: BoardDB; showEnturLogo: boolean }) {
	if (!showEnturLogo && !board.footer?.footer) return null

	const EnturLogo = getLogo(board?.theme ?? 'dark')
	return (
		<footer className="flex flex-row items-center justify-between gap-em-2">
			<div
				className={`truncate leading-em-base text-primary ${getFontScale(board.meta?.fontSize)}`}
			>
				{board.footer?.footer}
			</div>
			{showEnturLogo && (
				<img
					src={EnturLogo}
					alt="Entur logo"
					className="enturLogo mx-4 mt-4 w-auto object-contain object-right"
				/>
			)}
		</footer>
	)
}

export function getLogo(theme: BoardTheme) {
	if (theme === 'light') return EnturLogoBlue
	return EnturLogoWhite
}

export { InfoMessage }
