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
}

function Header({ hideClock = false, hideLogo = false, theme }: Props) {
	const tavlaLogo = theme === 'light' ? TavlaLogoBlue : TavlaLogoWhite

	if (hideClock && hideLogo) return null

	return (
		<div className="mb-em-0.25 flex flex-row items-center justify-between gap-em-3">
			<div className="relative h-[1.25em] w-full">
				{!hideLogo && (
					<img
						src={tavlaLogo}
						alt="Logo til tavlen"
						className="h-full w-auto object-contain object-left"
						width="100"
						height="100"
					/>
				)}
			</div>
			{!hideClock && <Clock />}
		</div>
	)
}

export { Header }
