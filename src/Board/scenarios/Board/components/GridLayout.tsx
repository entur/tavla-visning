import { Children, type ReactNode } from 'react'
import { LinearLayout } from '@/Board/scenarios/Board/components/LinearLayout'

type Props = {
	children: ReactNode
	fontScale?: string
}

export function GridLayout({ children, fontScale }: Props) {
	const tiles = Children.toArray(children)
	return (
		<LinearLayout direction="row" fontScale={fontScale}>
			<LinearLayout direction="col">{tiles.slice(0, 2)}</LinearLayout>
			<LinearLayout direction="col">{tiles.slice(2, 4)}</LinearLayout>
		</LinearLayout>
	)
}
