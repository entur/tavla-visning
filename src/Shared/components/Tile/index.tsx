import clsx from 'clsx'
import type React from 'react'

function Tile({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={clsx(
				'h-full w-full overflow-hidden rounded-lg bg-secondary px-[1em] pt-[0.25em]  text-primary',
				className,
			)}
			style={{
				overflow: 'hidden',
				borderRadius: '0.5em',
				...rest.style,
			}}
			{...rest}
		>
			{children}
		</div>
	)
}

export { Tile }
