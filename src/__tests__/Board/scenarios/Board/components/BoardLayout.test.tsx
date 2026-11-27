import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { BoardLayout } from '@/Board/scenarios/Board/components/BoardLayout'
import type { BoardLayout as TBoardLayout } from '@/Shared/types/db-types/boards'

function renderTiles(count: number) {
	return Array.from({ length: count }, (_, i) => {
		const tileNumber = i + 1
		return <div key={tileNumber}>tile {tileNumber}</div>
	})
}

function renderBoardLayout(
	container: HTMLDivElement,
	layout: TBoardLayout | undefined,
	tileCount: number,
) {
	act(() => {
		createRoot(container).render(
			<BoardLayout layout={layout} tileCount={tileCount} fontScale="text-em-m">
				{renderTiles(tileCount)}
			</BoardLayout>,
		)
	})
}

function rootEl(container: HTMLDivElement) {
	return container.firstElementChild as HTMLElement
}

function isAutoLayout(el: HTMLElement) {
	return el.className.includes('grid') && el.style.getPropertyValue('--cols') !== ''
}

function isLinearLayout(el: HTMLElement, direction: 'row' | 'col') {
	const expectedDirectionClass = direction === 'row' ? 'flex-row' : 'flex-col'
	return (
		el.className.includes('flex') &&
		el.className.includes(expectedDirectionClass) &&
		!el.className.includes('flex-wrap')
	)
}

function isGridLayout(el: HTMLElement) {
	if (!isLinearLayout(el, 'row')) return false
	if (el.children.length !== 2) return false

	return Array.from(el.children).every((wrapper) => {
		const nestedColumn = (wrapper as HTMLElement).firstElementChild as HTMLElement | null
		if (!nestedColumn) return false
		if (!isLinearLayout(nestedColumn, 'col')) return false
		return nestedColumn.children.length === 2
	})
}

function isHighlightLayout(el: HTMLElement, tileCount: number) {
	if (!isLinearLayout(el, 'row')) return false
	if (el.children.length !== 2) return false

	const secondWrapper = el.children[1] as HTMLElement
	const nestedColumn = secondWrapper.firstElementChild as HTMLElement | null
	if (!nestedColumn) return false
	if (!isLinearLayout(nestedColumn, 'col')) return false

	return nestedColumn.children.length === tileCount - 1
}

describe('BoardLayout', () => {
	let container: HTMLDivElement

	beforeEach(() => {
		container = document.createElement('div')
		document.body.appendChild(container)
	})

	afterEach(() => {
		document.body.removeChild(container)
	})

	describe('layout er undefined eller "auto"', () => {
		it('rendrer AutoLayout når layout er undefined og tileCount er lav (1)', () => {
			renderBoardLayout(container, undefined, 1)
			expect(isAutoLayout(rootEl(container))).toBe(true)
		})

		it('rendrer AutoLayout når layout er undefined og tileCount er høy (8)', () => {
			renderBoardLayout(container, undefined, 8)
			expect(isAutoLayout(rootEl(container))).toBe(true)
		})

		it('rendrer AutoLayout når layout er "auto" og tileCount er lav (1)', () => {
			renderBoardLayout(container, 'auto', 1)
			expect(isAutoLayout(rootEl(container))).toBe(true)
		})

		it('rendrer AutoLayout når layout er "auto" og tileCount er høy (8)', () => {
			renderBoardLayout(container, 'auto', 8)
			expect(isAutoLayout(rootEl(container))).toBe(true)
		})
	})

	describe('tileCount >= 5 tvinger alltid AutoLayout', () => {
		it('faller tilbake til AutoLayout for layout="highlight" når tileCount er 5', () => {
			renderBoardLayout(container, 'highlight', 5)
			expect(isAutoLayout(rootEl(container))).toBe(true)
		})

		it('faller tilbake til AutoLayout for layout="horizontal" når tileCount er 5', () => {
			renderBoardLayout(container, 'horizontal', 5)
			expect(isAutoLayout(rootEl(container))).toBe(true)
		})

		it('faller tilbake til AutoLayout for layout="grid" når tileCount er 6', () => {
			renderBoardLayout(container, 'grid', 6)
			expect(isAutoLayout(rootEl(container))).toBe(true)
		})

		it('faller tilbake til AutoLayout for layout="vertical" når tileCount er 7', () => {
			renderBoardLayout(container, 'vertical', 7)
			expect(isAutoLayout(rootEl(container))).toBe(true)
		})
	})

	describe('layout="horizontal"', () => {
		it.each([1, 2, 4])('rendrer horisontal LinearLayout for tileCount %i', (tileCount) => {
			renderBoardLayout(container, 'horizontal', tileCount)
			const el = rootEl(container)
			expect(isLinearLayout(el, 'row')).toBe(true)
			expect(el.children.length).toBe(tileCount)
		})
	})

	describe('layout="vertical"', () => {
		it.each([1, 2, 4])('rendrer vertikal LinearLayout for tileCount %i', (tileCount) => {
			renderBoardLayout(container, 'vertical', tileCount)
			const el = rootEl(container)
			expect(isLinearLayout(el, 'col')).toBe(true)
			expect(el.children.length).toBe(tileCount)
		})
	})

	describe('layout="highlight"', () => {
		it.each([3, 4])('rendrer HighlightLayout for gyldig tileCount %i', (tileCount) => {
			renderBoardLayout(container, 'highlight', tileCount)
			const el = rootEl(container)
			expect(isHighlightLayout(el, tileCount)).toBe(true)
		})

		it.each([1, 2])('faller tilbake til AutoLayout for ugyldig tileCount %i', (tileCount) => {
			renderBoardLayout(container, 'highlight', tileCount)
			expect(isAutoLayout(rootEl(container))).toBe(true)
		})
	})

	describe('layout="grid"', () => {
		it('rendrer GridLayout for gyldig tileCount 4', () => {
			renderBoardLayout(container, 'grid', 4)
			const el = rootEl(container)
			expect(isGridLayout(el)).toBe(true)
		})

		it.each([1, 2, 3])('faller tilbake til AutoLayout for ugyldig tileCount %i', (tileCount) => {
			renderBoardLayout(container, 'grid', tileCount)
			expect(isAutoLayout(rootEl(container))).toBe(true)
		})
	})
})
