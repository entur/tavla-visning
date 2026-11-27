import { Children, type ReactNode } from 'react'

type Props = {
	children: ReactNode
	direction: 'row' | 'col'
	fontScale?: string
}

export function LinearLayout({ children, direction, fontScale = '' }: Props) {
	const directionClass = direction === 'row' ? 'flex-row space-x-2.5' : 'flex-col space-y-2.5'

	return (
		<div className={`flex h-full overflow-hidden ${directionClass} ${fontScale}`}>
			{Children.map(children, (child) => (
				<div className="flex-1 overflow-hidden">{child}</div>
			))}
		</div>
	)
}
