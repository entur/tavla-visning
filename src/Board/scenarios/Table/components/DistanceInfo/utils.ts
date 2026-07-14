const ONE_HOUR_S = 60 * 60
const NINETY_MINUTES_S = 90 * 60

type TDistanceDisplay = {
	walking?: number
	driving?: number
}

export function getDistanceDisplay(walking?: number, driving?: number): TDistanceDisplay {
	if (walking === undefined) {
		return driving !== undefined ? { driving } : {}
	}

	if (walking < ONE_HOUR_S) return { walking }

	if (walking <= NINETY_MINUTES_S) {
		return driving !== undefined ? { walking, driving } : { walking }
	}

	return driving !== undefined ? { driving } : { walking }
}
