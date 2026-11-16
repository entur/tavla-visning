/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <comes later> */
import {
	ValidationErrorFilledIcon,
	ValidationExclamationCircleFilledIcon,
	ValidationInfoFilledIcon,
} from '@entur/icons'
import type { TDeviationType } from '../../Board/utils'

type DeviationIconProps = {
	deviationType: TDeviationType
	isHighlighted?: boolean
}

function deviationHighlightedIcon(
	size: string,
	color: string,
	altText: string,
	symbolPath: string,
) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 18 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			alt-text={altText}
		>
			<path
				d="M18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9ZM1.44 9C1.44 13.1753 4.82473 16.56 9 16.56C13.1753 16.56 16.56 13.1753 16.56 9C16.56 4.82473 13.1753 1.44 9 1.44C4.82473 1.44 1.44 4.82473 1.44 9Z"
				fill={color}
			/>
			<path fillRule="evenodd" clipRule="evenodd" d={symbolPath} fill={color} />
		</svg>
	)
}

export const DeviationIcon = ({ isHighlighted = true, deviationType }: DeviationIconProps) => {
	const size = '1.3em'

	if (deviationType === 'no-deviation') {
		return null
	}

	if (isHighlighted) {
		return (
			<div
				className="relative inline-flex items-center justify-center"
				style={{ width: size, height: size }}
			>
				<div className="flex items-center justify-center">
					{deviationType === 'cancellation'
						? deviationHighlightedIcon(
								size,
								'var(--error-color)',
								'Denne avgangen er innstilt',
								'M9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16ZM6.07574 11.0758L8.15148 9.00007L6.07574 6.92433L6.92427 6.07581L9.00001 8.15154L11.0757 6.07581L11.9243 6.92433L9.84854 9.00007L11.9243 11.0758L11.0757 11.9243L9.00001 9.8486L6.92427 11.9243L6.07574 11.0758Z',
							)
						: deviationType === 'incident'
							? deviationHighlightedIcon(
									size,
									'var(--warning-color)',
									'Denne avgangen har avvik',
									'M9 2C5.1 2 2 5.1 2 9C2 12.9 5.1 16 9 16C12.9 16 16 12.9 16 9C16 5.1 12.9 2 9 2ZM8.3 5H9.7V10.1H8.3V5ZM9 13.2C8.5 13.2 8.1 12.8 8.1 12.3C8.1 11.8 8.5 11.4 9 11.4C9.5 11.4 9.9 11.8 9.9 12.3C9.9 12.9 9.5 13.2 9 13.2Z',
								)
							: deviationHighlightedIcon(
									size,
									'var(--info-color)',
									'Denne avgangen har informasjon som ikke bør påvirke reisen',
									'M9 16.0015C12.8664 16.0015 16.0007 12.8671 16.0007 9.00074C16.0007 5.13434 12.8664 2 9 2C5.1336 2 1.999268 5.13434 1.999268 9.00074C1.999268 12.8671 5.1336 16.0015 9 16.0015ZM9.82013 5.71874C9.82013 6.17179 9.45291 6.53905 8.99991 6.53905C8.54691 6.53905 8.17969 6.17179 8.17969 5.71874C8.17969 5.2657 8.54691 4.89844 8.99991 4.89844C9.45291 4.89844 9.82013 5.2657 9.82013 5.71874ZM8.99979 7.59718L7.25 7.59718V8.79718L8.39979 8.79718V11.15H7.25V12.35H10.75V11.15H9.59979V8.19718C9.59979 8.03805 9.53657 7.88544 9.42405 7.77291C9.31153 7.66039 9.15892 7.59718 8.99979 7.59718Z',
								)}
				</div>
			</div>
		)
	}

	return (
		<div className="flex items-center justify-center" style={{ width: size, height: size }}>
			{deviationType === 'cancellation' ? (
				<ValidationErrorFilledIcon
					opacity={0.5}
					color="var(--error-color)"
					size="1.17em"
					aria-label="Denne avgangen er innstilt"
				/>
			) : deviationType === 'incident' ? (
				<ValidationExclamationCircleFilledIcon
					opacity={0.5}
					color="var(--warning-color)"
					size="1.17em"
					aria-label="Denne avgangen har avvik"
				/>
			) : (
				<ValidationInfoFilledIcon
					opacity={0.5}
					color="var(--info-color)"
					size="1.17em"
					aria-label="Denne avgangen har informasjon som ikke bør påvirke reisen"
				/>
			)}
		</div>
	)
}
