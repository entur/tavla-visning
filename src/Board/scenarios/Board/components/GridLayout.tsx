import { Children, type ReactNode } from 'react'

type Props = {
	children: ReactNode
	fontScale?: string
}

export function GridLayout({ children, fontScale = '' }: Props) {
	return (
		<div className={`flex flex-row flex-wrap gap-2.5 h-full overflow-hidden ${fontScale}`}>
			{Children.map(children, (child) => (
				<div className="flex-[0_0_calc(50%-5px)] h-[calc(50%-5px)] overflow-hidden">{child}</div>
			))}
		</div>
	)
}
