import clsx from 'clsx'
import type React from 'react'

function Tile({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={clsx(
				'h-full w-full rounded-lg bg-secondary px-[1em] pt-[0.25em]  text-primary',
				className,
			)}
			style={{
				overflow: 'hidden',
				maxHeight: '100%',
				...rest.style,
			}}
			{...rest}
		>
			{children}
		</div>
	)
}

export { Tile }
