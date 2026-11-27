import type { ReactNode } from 'react'
import { AutoLayout } from '@/Board/scenarios/Board/components/AutoLayout'
import { GridLayout } from '@/Board/scenarios/Board/components/GridLayout'
import { HighlightLayout } from '@/Board/scenarios/Board/components/HighlightLayout'
import { LinearLayout } from '@/Board/scenarios/Board/components/LinearLayout'
import type { BoardLayout as TBoardLayout } from '@/Shared/types/db-types/boards'

type Props = {
	children: ReactNode
	tileCount: number
	fontScale: string
	layout?: TBoardLayout
}

function isValidLayout(layout: TBoardLayout | undefined, tileCount: number) {
	if (tileCount >= 5) return layout === 'auto' || layout === undefined
	if (layout === 'highlight') return tileCount >= 3 && tileCount <= 4
	if (layout === 'grid') return tileCount === 4
	return true
}

export function BoardLayout({ layout, tileCount, children, fontScale }: Props) {
	if (isValidLayout(layout, tileCount)) {
		switch (layout) {
			case 'horizontal':
				return (
					<LinearLayout direction="row" fontScale={fontScale}>
						{children}
					</LinearLayout>
				)
			case 'vertical':
				return (
					<LinearLayout direction="col" fontScale={fontScale}>
						{children}
					</LinearLayout>
				)
			case 'highlight':
				return <HighlightLayout fontScale={fontScale}>{children}</HighlightLayout>
			case 'grid':
				return <GridLayout fontScale={fontScale}>{children}</GridLayout>
		}
	}
	return (
		<AutoLayout tileCount={tileCount} fontScale={fontScale}>
			{children}
		</AutoLayout>
	)
}
