import { describe, expect, it } from 'vitest'
import {
	buildEstimatedCallFilters,
	getQuaysToQuery,
	getStopPlaceFilterValues,
	resolveTileDataSource,
} from '@/Board/hooks/useTileData'
import type { FilterQuayDB, QuayDB } from '@/Shared/types/db-types/boards'

/* Minimal fixture for QuayDB — tile.quays bruker fortsatt whitelistedLines. */
const quay = (id: string): QuayDB => ({ id, whitelistedLines: [] })

/* Minimal fixture for FilterQuayDB — quaysFilter.quays bruker selectedLines. */
const filterQuay = (id: string): FilterQuayDB => ({ id, selectedLines: [] })

describe('resolveTileDataSource', () => {
	it('velger quays når tile har valgte quays og ingen filter', () => {
		expect(resolveTileDataSource({ quays: [quay('Q1')] })).toBe('quays')
	})

	it('velger stopPlace når tile ikke har valgte quays og ingen filter', () => {
		expect(resolveTileDataSource({ quays: [] })).toBe('stopPlace')
	})

	it('lar quaysFilter overstyre quays-feltet på tile', () => {
		expect(
			resolveTileDataSource({
				quays: [],
				filter: { type: 'quaysFilter', quays: [filterQuay('Q1')] },
			}),
		).toBe('quays')
	})

	it('lar stopPlaceFilter overstyre quays-feltet på tile', () => {
		expect(
			resolveTileDataSource({
				quays: [quay('Q1')],
				filter: { type: 'stopPlaceFilter', selectedLines: [], selectedTransportModes: [] },
			}),
		).toBe('stopPlace')
	})

	it('tolker quaysFilter uten quays som alle platformer, og velger stopPlace', () => {
		expect(
			resolveTileDataSource({
				quays: [],
				filter: { type: 'quaysFilter', quays: [] },
			}),
		).toBe('stopPlace')
	})
})

describe('getQuaysToQuery', () => {
	it('bruker quays fra filter når quaysFilter er satt, ikke tile.quays', () => {
		const filterQuays = [filterQuay('F1')]
		expect(
			getQuaysToQuery({ quays: [quay('Q1')], filter: { type: 'quaysFilter', quays: filterQuays } }),
		).toBe(filterQuays)
	})

	it('faller tilbake til tile.quays når filter mangler', () => {
		const tileQuays = [quay('Q1'), quay('Q2')]
		expect(getQuaysToQuery({ quays: tileQuays })).toBe(tileQuays)
	})

	it('returnerer tom liste når verken quays eller filter finnes', () => {
		expect(getQuaysToQuery({ quays: undefined as unknown as QuayDB[] })).toEqual([])
	})
})

describe('getStopPlaceFilterValues', () => {
	it('henter selectedLines og selectedTransportModes fra stopPlaceFilter', () => {
		expect(
			getStopPlaceFilterValues({
				filter: {
					type: 'stopPlaceFilter',
					selectedLines: ['RUT:Line:1'],
					selectedTransportModes: ['bus'],
				},
			}),
		).toEqual({ selectedLines: ['RUT:Line:1'], selectedTransportModes: ['bus'] })
	})

	it('returnerer tomt objekt for quaysFilter', () => {
		expect(
			getStopPlaceFilterValues({ filter: { type: 'quaysFilter', quays: [filterQuay('Q1')] } }),
		).toEqual({})
	})

	it('returnerer tomt objekt når filter mangler', () => {
		expect(getStopPlaceFilterValues({})).toEqual({})
	})
})

describe('buildEstimatedCallFilters', () => {
	it('returnerer undefined uten lines eller modes', () => {
		expect(buildEstimatedCallFilters()).toBeUndefined()
	})

	it('returnerer undefined når lines og modes er tomme lister', () => {
		expect(buildEstimatedCallFilters([], [])).toBeUndefined()
	})

	it('filtrerer på lines når bare linjer er satt', () => {
		expect(buildEstimatedCallFilters(['RUT:Line:1', 'RUT:Line:2'])).toEqual([
			{ select: [{ lines: ['RUT:Line:1', 'RUT:Line:2'] }] },
		])
	})

	it('filtrerer på transportModes når bare moduser er satt', () => {
		expect(buildEstimatedCallFilters(undefined, ['bus', 'rail'])).toEqual([
			{ select: [{ transportModes: [{ transportMode: 'bus' }, { transportMode: 'rail' }] }] },
		])
	})

	it('kombinerer line og modes i to ulike select, for å støtte OR-logikk', () => {
		expect(buildEstimatedCallFilters(['RUT:Line:1'], ['bus'])).toEqual([
			{ select: [{ lines: ['RUT:Line:1'] }, { transportModes: [{ transportMode: 'bus' }] }] },
		])
	})

	it('hopper over lines i select når listen er tom, selv om modes er satt', () => {
		expect(buildEstimatedCallFilters([], ['bus'])).toEqual([
			{ select: [{ transportModes: [{ transportMode: 'bus' }] }] },
		])
	})
})
