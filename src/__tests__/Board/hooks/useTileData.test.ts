import { describe, expect, it } from 'vitest'
import { resolveTileDataSource } from '@/Board/hooks/useTileData'
import type { QuayDB } from '@/Shared/types/db-types/boards'

/* Minimal fixture for QuayDB — filteret bruker kun id og whitelistedLines. */
const quay = (id: string): QuayDB => ({ id, whitelistedLines: [] })

describe('resolveTileDataSource', () => {
	it('returnerer quays når quays er ikke-tom (fallback uten filter)', () => {
		expect(resolveTileDataSource({ quays: [quay('Q1')] })).toBe('quays')
	})

	it('returnerer stopPlace når quays er [] (fallback uten filter)', () => {
		expect(resolveTileDataSource({ quays: [] })).toBe('stopPlace')
	})

	it('returnerer quays når filter er quaysFilter, uavhengig av tile.quays', () => {
		expect(
			resolveTileDataSource({
				quays: [],
				filter: { type: 'quaysFilter', quays: [quay('Q1')] },
			}),
		).toBe('quays')
	})

	it('returnerer stopPlace når filter er stopPlaceFilter, uavhengig av tile.quays', () => {
		expect(
			resolveTileDataSource({
				quays: [quay('Q1')],
				filter: { type: 'stopPlaceFilter', whitelistedLines: [], whitelistedModes: [] },
			}),
		).toBe('stopPlace')
	})
})
