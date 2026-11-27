import { Children, type ReactNode } from 'react'
import { LinearLayout } from '@/Board/scenarios/Board/components/LinearLayout'

type Props = {
	children: ReactNode
	fontScale?: string
}

export function HighlightLayout({ children, fontScale }: Props) {
	const [highlighted, ...others] = Children.toArray(children)
	return (
		<LinearLayout direction="row" fontScale={fontScale}>
			{highlighted}
			<LinearLayout direction="col">{others}</LinearLayout>
		</LinearLayout>
	)
}
