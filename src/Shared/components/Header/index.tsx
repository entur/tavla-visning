import type { BoardLanguage, BoardTheme } from '@/Shared/types/db-types/boards'
import type { FolderLogo } from '@/Shared/types/db-types/folders'
import { getUiLabel } from '@/Shared/utils/translations'
import { Clock } from '../Clock'
import { Logo } from '@entur/menu'

type Props = {
	theme?: BoardTheme
	folderLogo?: FolderLogo | null
	hideClock?: boolean
	hideLogo?: boolean
	isArrivals?: boolean
	language?: BoardLanguage
}

function Header({
	hideClock = false,
	hideLogo = false,
	theme,
	folderLogo,
	isArrivals = false,
	language = 'nb',
}: Props) {
	if (hideClock && hideLogo && !isArrivals) return null

	return (
		<div
			className={`relative mb-em-0.25 flex flex-col${isArrivals ? ` pb-em-0.25 border-b-[0.1em] ${theme === 'light' ? 'border-blue' : 'border-lavender'}` : ''}`}
		>
			<div className="flex flex-row items-center justify-between">
				<div className="relative sm:h-[1.25em] w-full h-[1em]">
					{!hideLogo && !folderLogo && (
						<Logo productName="Tavla" className="tavla-header-logo h-full w-auto" size="small" />
					)}
					{!hideLogo && folderLogo && (
						<img
							src={folderLogo}
							alt={getUiLabel('boardLogoAlt', language)}
							className="h-full w-auto object-contain object-left"
							width="100"
							height="100"
						/>
					)}
				</div>
				{isArrivals && (
					<span className="absolute left-1/2 -translate-x-1/2 ">
						{getUiLabel('arrivalsHeading', language)}
					</span>
				)}
				{!hideClock && <Clock />}
			</div>
		</div>
	)
}

export { Header }
