import { type ReactNode, useEffect } from 'react'
import type { BoardLanguage } from '@/Shared/types/db-types/boards'

type Props = {
	theme?: 'dark' | 'light'
	transportPalette?: string
	title?: string
	language?: BoardLanguage
	children: ReactNode
}

export function PageWrapper({
	theme = 'dark',
	transportPalette,
	title = 'Entur Tavla',
	language = 'nb',
	children,
}: Props) {
	useEffect(() => {
		document.documentElement.lang = language
	}, [language])

	return (
		<div
			className="smoketest w-full root h-full min-h-screen box-inherit bg-(--main-background-color)"
			data-theme={theme}
			data-transport-palette={transportPalette}
			data-color-mode={theme}
		>
			<div>
				<title>{title}</title>
			</div>
			<div className="flex flex-col bg-background h-screen w-full overflow-hidden p-3.5">
				{children}
			</div>
		</div>
	)
}
