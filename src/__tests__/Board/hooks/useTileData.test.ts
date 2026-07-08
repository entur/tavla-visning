import { describe, expect, it } from 'vitest'
import {
	resolveTileDataSource,
	shouldIncludeByLineDirection,
	whitelistedLinesFromDirection,
} from '@/Board/hooks/useTileData'
import type { LineWithDirectionDB, QuayDB } from '@/Shared/types/db-types/boards'
import type { TDepartureFragment } from '@/types/graphql-schema'

// Minimal fixture — filteret bruker kun serviceJourney.line.id og
// destinationDisplay.frontText.
function departure(lineId: string, frontText: string | null): TDepartureFragment {
	return {
		serviceJourney: { line: { id: lineId } },
		destinationDisplay: { frontText },
	} as unknown as TDepartureFragment
}

describe('shouldIncludeByLineDirection', () => {
	it('viser alt når linesWithDirection er tom (intet filter)', () => {
		expect(shouldIncludeByLineDirection(departure('L1', 'Nord'), [])).toBe(true)
	})

	it('skjuler avgang når linja ikke er valgt', () => {
		const lwd: LineWithDirectionDB[] = [{ lineId: 'L2', frontTexts: [] }]
		expect(shouldIncludeByLineDirection(departure('L1', 'Nord'), lwd)).toBe(false)
	})

	it('viser alle retninger når linja matcher og frontTexts er tom', () => {
		const lwd: LineWithDirectionDB[] = [{ lineId: 'L1', frontTexts: [] }]
		expect(shouldIncludeByLineDirection(departure('L1', 'Nord'), lwd)).toBe(true)
	})

	it('viser avgang uten frontText (fail-open på manglende data)', () => {
		const lwd: LineWithDirectionDB[] = [{ lineId: 'L1', frontTexts: ['Nord'] }]
		expect(shouldIncludeByLineDirection(departure('L1', null), lwd)).toBe(true)
	})

	it('viser avgang når frontText er blant de valgte', () => {
		const lwd: LineWithDirectionDB[] = [{ lineId: 'L1', frontTexts: ['Nord', 'Sør'] }]
		expect(shouldIncludeByLineDirection(departure('L1', 'Sør'), lwd)).toBe(true)
	})

	it('skjuler avgang når frontText ikke er blant de valgte', () => {
		const lwd: LineWithDirectionDB[] = [{ lineId: 'L1', frontTexts: ['Nord'] }]
		expect(shouldIncludeByLineDirection(departure('L1', 'Sør'), lwd)).toBe(false)
	})
})

describe('whitelistedLinesFromDirection', () => {
	it('gir undefined for tom eller undefined liste', () => {
		expect(whitelistedLinesFromDirection([])).toBeUndefined()
		expect(whitelistedLinesFromDirection(undefined)).toBeUndefined()
	})

	it('gir unike lineIds', () => {
		const lwd: LineWithDirectionDB[] = [
			{ lineId: 'L1', frontTexts: ['Nord'] },
			{ lineId: 'L2', frontTexts: [] },
		]
		expect(whitelistedLinesFromDirection(lwd)).toEqual(['L1', 'L2'])
	})

	it('dedupliserer lineIds', () => {
		const lwd: LineWithDirectionDB[] = [
			{ lineId: 'L1', frontTexts: ['Nord'] },
			{ lineId: 'L1', frontTexts: ['Sør'] },
		]
		expect(whitelistedLinesFromDirection(lwd)).toEqual(['L1'])
	})
})

const quay = (id: string): QuayDB => ({ id, whitelistedLines: [] })

describe('resolveTileDataSource (presedens)', () => {
	it('linesWithDirection vinner — også tom liste, og selv om quays finnes', () => {
		expect(resolveTileDataSource({ linesWithDirection: [], quays: [quay('Q1')] })).toBe(
			'linesWithDirection',
		)
		expect(
			resolveTileDataSource({
				linesWithDirection: [{ lineId: 'L1', frontTexts: [] }],
				quays: [quay('Q1')],
			}),
		).toBe('linesWithDirection')
	})

	it('quays når linesWithDirection mangler og quays er ikke-tom', () => {
		expect(resolveTileDataSource({ quays: [quay('Q1')] })).toBe('quays')
	})

	it('stopPlace når verken linesWithDirection eller ikke-tom quays', () => {
		expect(resolveTileDataSource({ quays: [] })).toBe('stopPlace')
	})
})
