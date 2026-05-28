import type { ReactNode } from 'react'

type Props = {
	theme?: 'dark' | 'light'
	transportPalette?: string
	title?: string
	children: ReactNode
}

export function PageWrapper({
	theme = 'dark',
	transportPalette,
	title = 'Entur Tavla',
	children,
}: Props) {
	return (
		<div
			className="w-full root h-full min-h-screen box-inherit bg-(--main-background-color)"
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
