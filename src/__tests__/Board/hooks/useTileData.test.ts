import { describe, expect, it } from 'vitest'
import { resolveTileDataSource } from '@/Board/hooks/useTileData'
import type { QuayDB } from '@/Shared/types/db-types/boards'

/* Minimal fixture for QuayDB — filteret bruker kun id og whitelistedLines. */
const quay = (id: string): QuayDB => ({ id, whitelistedLines: [] })

describe('resolveTileDataSource', () => {
	it('returnerer quays når quays er ikke-tom', () => {
		expect(resolveTileDataSource({ quays: [quay('Q1')] })).toBe('quays')
	})

	it('returnerer stopPlace når quays er []', () => {
		expect(resolveTileDataSource({ quays: [] })).toBe('stopPlace')
	})
})
