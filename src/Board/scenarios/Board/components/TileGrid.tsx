import type { ReactNode } from 'react'

type Props = {
	children: ReactNode
	tileCount: number
	fontScale: string
}

export function TileGrid({ children, tileCount, fontScale }: Props) {
	const colsStyle = {
		'--cols': String(tileCount),
	} as React.CSSProperties

	const baseGridClass = 'grid gap-2.5 overflow-hidden'

	const fallbackFlexClass =
		'supports-[not(display:grid)]:flex supports-[not(display:grid)]:*:m-2.5 supports-[not(display:grid)]:flex-grow'

	const responsiveGridClass =
		'max-sm:overflow-y-scroll xs:grid-cols-1 md:grid-cols-[repeat(auto-fit,_minmax(33%,_1fr))]'

	const largeScreenGridClass = '3xl:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]'

	const gridClassName = `${baseGridClass} ${fallbackFlexClass} ${responsiveGridClass} ${largeScreenGridClass} ${fontScale}`

	return (
		<div style={colsStyle} className={gridClassName}>
			{children}
		</div>
	)
}
