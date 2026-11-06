import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { BoardTile } from '@/Board/components/BoardTile'
import { BoardContext } from '@/Board/context'
import type { TDepartureFragment, TSituationFragment } from '@/types/graphql-operations'

function makeSituation(id: string): TSituationFragment {
	return {
		id,
		description: [{ value: `Beskrivelse ${id}`, language: 'no' }],
		summary: [{ value: `Avvik ${id}`, language: 'no' }],
		validityPeriod: null,
	}
}

function makeDeparture(
	publicCode: string,
	destination: string,
	minutesFromNow: number,
	situations: TSituationFragment[] = [],
): TDepartureFragment {
	const time = new Date(Date.now() + minutesFromNow * 60 * 1000).toISOString()

	return {
		aimedDepartureTime: time,
		expectedDepartureTime: time,
		aimedArrivalTime: time,
		expectedArrivalTime: time,
		cancellation: false,
		realtime: true,
		quay: { publicCode: null, name: 'Platform' },
		destinationDisplay: { frontText: destination, via: null },
		serviceJourney: {
			id: `sj-${publicCode}`,
			transportMode: 'bus',
			transportSubmode: null,
			line: { id: `line-${publicCode}`, publicCode, presentation: null },
			quays: [],
		},
		situations,
	}
}

function renderBoardTile(
	container: HTMLElement,
	viewMode?: 'expandNextDeparture',
): { root: Root; departures: TDepartureFragment[] } {
	const departures = [
		makeDeparture('1', 'Kristiansund', 5),
		makeDeparture('1', 'Brekstad kai', 25),
		makeDeparture('1', 'Hitra', 55),
	]

	const root = createRoot(container)
	act(() => {
		root.render(
			<BoardContext.Provider value={{ boardId: 'board-1', isArrivals: false, language: 'nb' }}>
				<BoardTile
					displayName="Trondheim hurtigbåtterminal A"
					estimatedCalls={departures}
					situations={[]}
					uniqueSituations={[]}
					currentSituationIndex={0}
					isLoading={false}
					hasData={true}
					columns={['line', 'destination', 'time']}
					viewMode={viewMode}
				/>
			</BoardContext.Provider>,
		)
	})

	return { root, departures }
}

describe('BoardTile', () => {
	let container: HTMLDivElement

	beforeEach(() => {
		container = document.createElement('div')
		document.body.appendChild(container)
	})

	afterEach(() => {
		document.body.removeChild(container)
	})

	it('shows every departure in the table when no viewMode is set', () => {
		const { root } = renderBoardTile(container)
		const text = container.textContent ?? ''

		expect(text).toContain('Kristiansund')
		expect(text).toContain('Brekstad kai')
		expect(text).toContain('Hitra')

		act(() => root.unmount())
	})

	it('promotes the next departure to a hero and excludes it from the table for expandNextDeparture', () => {
		const { root } = renderBoardTile(container, 'expandNextDeparture')
		const text = container.textContent ?? ''

		// The soonest departure (Kristiansund) is shown once, as the hero — not repeated in the table below.
		expect(text.split('Kristiansund').length - 1).toBe(1)
		expect(text).toContain('Brekstad kai')
		expect(text).toContain('Hitra')

		act(() => root.unmount())
	})

	it('highlights the hero deviation icon only when its situation is the one currently cycling', () => {
		const situation = makeSituation('situation-1')
		const heroDeparture = makeDeparture('1', 'Kristiansund', 5, [situation])
		const departures = [heroDeparture, makeDeparture('1', 'Brekstad kai', 25)]

		const root = createRoot(container)
		act(() => {
			root.render(
				<BoardContext.Provider value={{ boardId: 'board-1', isArrivals: false, language: 'nb' }}>
					<BoardTile
						displayName="Trondheim hurtigbåtterminal A"
						estimatedCalls={departures}
						situations={[]}
						uniqueSituations={[
							{
								situation,
								cancellation: false,
								publicCodeList: ['1'],
								transportModeList: ['bus'],
							},
						]}
						currentSituationIndex={0}
						isLoading={false}
						hasData={true}
						columns={['line', 'destination', 'time']}
						viewMode="expandNextDeparture"
					/>
				</BoardContext.Provider>,
			)
		})

		// currentSituationIndex (0) points at the hero's own situation, so its icon is highlighted (full opacity).
		expect(container.innerHTML).not.toContain('opacity="0.5"')

		act(() => root.unmount())
	})

	it('dims the hero deviation icon when a different situation is currently cycling', () => {
		const heroSituation = makeSituation('situation-hero')
		const otherSituation = makeSituation('situation-other')
		const heroDeparture = makeDeparture('1', 'Kristiansund', 5, [heroSituation])
		const otherDeparture = makeDeparture('2', 'Brekstad kai', 25, [otherSituation])
		const departures = [heroDeparture, otherDeparture]

		const root = createRoot(container)
		act(() => {
			root.render(
				<BoardContext.Provider value={{ boardId: 'board-1', isArrivals: false, language: 'nb' }}>
					<BoardTile
						displayName="Trondheim hurtigbåtterminal A"
						estimatedCalls={departures}
						situations={[]}
						uniqueSituations={[
							{
								situation: heroSituation,
								cancellation: false,
								publicCodeList: ['1'],
								transportModeList: ['bus'],
							},
							{
								situation: otherSituation,
								cancellation: false,
								publicCodeList: ['2'],
								transportModeList: ['bus'],
							},
						]}
						// Points at otherSituation, not the hero's own situation.
						currentSituationIndex={1}
						isLoading={false}
						hasData={true}
						columns={['line', 'destination', 'time']}
						viewMode="expandNextDeparture"
					/>
				</BoardContext.Provider>,
			)
		})

		expect(container.innerHTML).toContain('opacity="0.5"')

		act(() => root.unmount())
	})
})
