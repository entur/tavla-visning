const ONE_HOUR_S = 60 * 60

type TDistanceDisplay = {
	walking?: number
	driving?: number
}

export function getDistanceDisplay(walking?: number, driving?: number): TDistanceDisplay {
	if (walking !== undefined && walking < ONE_HOUR_S) return { walking }

	if (walking !== undefined) {
		if (driving !== undefined && driving < walking) return { walking, driving }
		return { walking }
	}

	if (driving !== undefined) return { driving }

	return {}
}
