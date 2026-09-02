import { getFontScale } from '@/Board/scenarios/Board/utils'
import type { BoardDB } from '@/Shared/types/db-types/boards'
import { Logo } from '@entur/menu'

function InfoMessage({ board, showEnturLogo }: { board: BoardDB; showEnturLogo: boolean }) {
	if (!showEnturLogo && !board.footer?.footer) return null

	return (
		<footer className="flex flex-row items-center justify-between gap-em-2">
			<div
				className={`truncate leading-em-base text-primary ${getFontScale(board.meta?.fontSize)}`}
			>
				{board.footer?.footer}
			</div>
			{showEnturLogo && (
				<Logo productName="Tavla" className="tavla-footer-logo ml-4 mt-4" size="small" />
			)}
		</footer>
	)
}

//export function getLogo(theme: BoardTheme) {
//	if (theme === 'light') return EnturLogoBlue
//	return EnturLogoWhite
//}

export { InfoMessage }
