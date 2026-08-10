const ONE_HOUR_S = 60 * 60
const NINETY_MINUTES_S = 90 * 60

type TDistanceDisplay = {
	walking?: number
	driving?: number
}

export function getDistanceDisplay(walking?: number, driving?: number): TDistanceDisplay {
	const includeDriving = driving !== undefined && (walking === undefined || walking >= ONE_HOUR_S)
	const includeWalking = walking !== undefined && (walking <= NINETY_MINUTES_S || !includeDriving)

	return {
		walking: includeWalking ? walking : undefined,
		driving: includeDriving ? driving : undefined,
	}
}
