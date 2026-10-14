import type { VariantProps } from 'class-variance-authority'
import type React from 'react'
import { tileStyles } from './tileStyles'

export type TileVariants = VariantProps<typeof tileStyles>

type TileProps = React.HTMLAttributes<HTMLDivElement> & TileVariants

function Tile({ state, size, children, ...rest }: TileProps) {
	return (
		<div className={tileStyles({ state, size })} {...rest}>
			{children}
		</div>
	)
}

export { Tile }
