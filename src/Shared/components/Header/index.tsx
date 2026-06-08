import { Clock } from '../Clock'
import TavlaLogoBlue from '../../assets/logos/Tavla-blue.svg'
import TavlaLogoWhite from '../../assets/logos/Tavla-white.svg'
import type { BoardTheme } from '@/Shared/types/db-types/boards'
import type { FolderLogo } from '@/Shared/types/db-types/folders'

type Props = {
	theme?: BoardTheme
	folderLogo?: FolderLogo | null
	hideClock?: boolean
	hideLogo?: boolean
	isArrivals?: boolean
}

function Header({
	hideClock = false,
	hideLogo = false,
	theme,
	folderLogo,
	isArrivals = false,
}: Props) {
	const tavlaLogo = theme === 'light' ? TavlaLogoBlue : TavlaLogoWhite
	const logoSrc = folderLogo || tavlaLogo

	if (hideClock && hideLogo) return null

	return (
		<div
			className={`relative mb-em-0.25 flex flex-col${isArrivals ? ' pb-em-0.25 border-b-[0.1em] border-lavender' : ''}`}
		>
			<div className="flex flex-row items-center justify-between">
				<div className="relative sm:h-[1.25em] w-full h-[1em]">
					{!hideLogo && (
						<img
							src={logoSrc}
							alt="Logo til tavlen"
							className="h-full w-auto object-contain object-left"
							width="100"
							height="100"
						/>
					)}
				</div>
				{isArrivals && <span className="absolute left-1/2 -translate-x-1/2 ">Ankomster</span>}
				{!hideClock && <Clock />}
			</div>
		</div>
	)
}

export { Header }
