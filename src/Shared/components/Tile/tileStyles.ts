import { cva } from 'class-variance-authority'

export const tileStyles = cva(
	'w-full overflow-hidden rounded-lg bg-secondary px-[1em] pt-[0.25em] text-primary',
	{
		variants: {
			state: {
				loading: '',
				error: '',
				empty: 'flex flex-col',
				data: 'flex flex-col',
				no_data: 'flex h-full items-center justify-center',
			},
			size: {
				normal: '',
				tall: 'sm:max-3xl:row-span-2',
			},
		},
		defaultVariants: {
			state: 'data',
			size: 'normal',
		},
	},
)
