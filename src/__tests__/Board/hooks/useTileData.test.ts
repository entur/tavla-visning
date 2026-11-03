import { describe, expect, it } from 'vitest'
import {
	buildEstimatedCallFilters,
	getQuaysToQuery,
	getStopPlaceFilterValues,
	resolveTileDataSource,
} from '@/Board/hooks/useTileData'
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

	it('returnerer stopPlace når filter er quaysFilter med tom quays-liste ("alle platformer")', () => {
		expect(
			resolveTileDataSource({
				quays: [],
				filter: { type: 'quaysFilter', quays: [] },
			}),
		).toBe('stopPlace')
	})
})

describe('getQuaysToQuery', () => {
	it('returnerer filter.quays når filter er quaysFilter, selv om tile.quays er noe annet', () => {
		const filterQuays = [quay('F1')]
		expect(
			getQuaysToQuery({ quays: [quay('Q1')], filter: { type: 'quaysFilter', quays: filterQuays } }),
		).toBe(filterQuays)
	})

	it('faller tilbake til tile.quays når filter mangler', () => {
		const tileQuays = [quay('Q1'), quay('Q2')]
		expect(getQuaysToQuery({ quays: tileQuays })).toBe(tileQuays)
	})

	it('returnerer [] når tile.quays er undefined og filter mangler', () => {
		expect(getQuaysToQuery({ quays: undefined as unknown as QuayDB[] })).toEqual([])
	})
})

describe('getStopPlaceFilterValues', () => {
	it('henter whitelistedLines og whitelistedModes fra en stopPlaceFilter', () => {
		expect(
			getStopPlaceFilterValues({
				filter: {
					type: 'stopPlaceFilter',
					whitelistedLines: ['RUT:Line:1'],
					whitelistedModes: ['bus'],
				},
			}),
		).toEqual({ whitelistedLines: ['RUT:Line:1'], whitelistedModes: ['bus'] })
	})

	it('returnerer tomt objekt når filter er quaysFilter', () => {
		expect(
			getStopPlaceFilterValues({ filter: { type: 'quaysFilter', quays: [quay('Q1')] } }),
		).toEqual({})
	})

	it('returnerer tomt objekt når filter mangler', () => {
		expect(getStopPlaceFilterValues({})).toEqual({})
	})
})

describe('buildEstimatedCallFilters', () => {
	it('returnerer undefined når hverken lines eller modes er satt', () => {
		expect(buildEstimatedCallFilters()).toBeUndefined()
	})

	it('returnerer undefined når lines og modes begge er tomme lister', () => {
		expect(buildEstimatedCallFilters([], [])).toBeUndefined()
	})

	it('inkluderer kun lines når bare whitelistedLines er satt', () => {
		expect(buildEstimatedCallFilters(['RUT:Line:1', 'RUT:Line:2'])).toEqual([
			{ select: [{ lines: ['RUT:Line:1', 'RUT:Line:2'] }] },
		])
	})

	it('inkluderer kun transportModes når bare whitelistedModes er satt', () => {
		expect(buildEstimatedCallFilters(undefined, ['bus', 'rail'])).toEqual([
			{ select: [{ transportModes: [{ transportMode: 'bus' }, { transportMode: 'rail' }] }] },
		])
	})

	it('legger lines og transportModes i hver sin selector når begge er satt, slik at de ORes', () => {
		expect(buildEstimatedCallFilters(['RUT:Line:1'], ['bus'])).toEqual([
			{ select: [{ lines: ['RUT:Line:1'] }, { transportModes: [{ transportMode: 'bus' }] }] },
		])
	})

	it('utelater lines fra select når whitelistedLines er en tom liste, men modes er satt', () => {
		expect(buildEstimatedCallFilters([], ['bus'])).toEqual([
			{ select: [{ transportModes: [{ transportMode: 'bus' }] }] },
		])
	})
})
