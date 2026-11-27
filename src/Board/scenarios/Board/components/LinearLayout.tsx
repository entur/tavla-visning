import { Children, type ReactNode } from 'react'

type Props = {
	children: ReactNode
	direction: 'row' | 'col'
	fontScale?: string
}

export function LinearLayout({ children, direction, fontScale = '' }: Props) {
	return (
		<div
			className={`flex gap-2.5 h-full ${direction === 'row' ? 'flex-row' : 'flex-col'} ${fontScale}`}
		>
			{Children.map(children, (child) => (
				<div className="flex-1 overflow-hidden">{child}</div>
			))}
		</div>
	)
}
