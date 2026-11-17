/**
 * Reads query parameter value and returns it as a boolean or null
 *
 * @param queryParameter The name of the query parameter to read
 * @returns The boolean value of the query parameter, or null if not found or invalid
 */
export function readBooleanQueryParamValue(queryParameter: string): boolean | null {
	if (typeof window === 'undefined') return null

	const search = window.location.search
	if (!search) return null

	try {
		const params = new URLSearchParams(search)
		const value = params.get(queryParameter)
		if (value === 'true') return true
		if (value === 'false') return false
	} catch {
		if (search.includes(`${queryParameter}=true`)) return true
		if (search.includes(`${queryParameter}=false`)) return false
	}

	return null
}

/**
 * Checks if the board has preview mode enabled based on the `isPreview` query parameter.
 *
 * @returns `true` if the board is in preview mode, otherwise `false`
 */
export function hasPreviewQueryParam(): boolean {
	return readBooleanQueryParamValue('isPreview') === true
}
