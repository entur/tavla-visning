import { describe, expect, it } from 'vitest'
import {
	buildEstimatedCallFilters,
	getQuaysToQuery,
	getStopPlaceFilterValues,
	resolveTileDataSource,
} from '@/Board/hooks/useTileData'
import type { FilterQuayDB } from '@/Shared/types/db-types/boards'

/* Minimal fixture for FilterQuayDB — quaysFilter.quays bruker selectedLines. */
const filterQuay = (id: string): FilterQuayDB => ({ id, selectedLines: [] })

describe('resolveTileDataSource', () => {
	it('velger stopPlace når tile ikke har filter', () => {
		expect(resolveTileDataSource({})).toBe('stopPlace')
	})

	it('velger quays når quaysFilter har valgte quays', () => {
		expect(
			resolveTileDataSource({ filter: { type: 'quaysFilter', quays: [filterQuay('Q1')] } }),
		).toBe('quays')
	})

	it('velger stopPlace for stopPlaceFilter', () => {
		expect(
			resolveTileDataSource({
				filter: { type: 'stopPlaceFilter', selectedLines: [], selectedTransportModes: [] },
			}),
		).toBe('stopPlace')
	})

	it('tolker quaysFilter uten quays som alle platformer, og velger stopPlace', () => {
		expect(resolveTileDataSource({ filter: { type: 'quaysFilter', quays: [] } })).toBe('stopPlace')
	})
})

describe('getQuaysToQuery', () => {
	it('bruker quays fra filter når quaysFilter er satt', () => {
		const filterQuays = [filterQuay('F1')]
		expect(getQuaysToQuery({ filter: { type: 'quaysFilter', quays: filterQuays } })).toBe(
			filterQuays,
		)
	})

	it('returnerer tom liste for stopPlaceFilter', () => {
		expect(
			getQuaysToQuery({
				filter: { type: 'stopPlaceFilter', selectedLines: [], selectedTransportModes: [] },
			}),
		).toEqual([])
	})

	it('returnerer tom liste når filter mangler', () => {
		expect(getQuaysToQuery({})).toEqual([])
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
