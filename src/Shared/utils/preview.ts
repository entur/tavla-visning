/**
 * Checks whether the current page is being shown in preview mode via the
 * `isPreview=true` URL query parameter (used by tavla-admin's live preview iframe).
 */
export function hasPreviewQueryParam(): boolean {
	if (typeof window === 'undefined') return false

	const search = window.location.search
	if (!search) {
		return false
	}

	try {
		const params = new URLSearchParams(search)
		if (params.get('isPreview') === 'true') {
			return true
		}
	} catch {
		if (search.includes('isPreview=true')) {
			return true
		}
	}

	return false
}
