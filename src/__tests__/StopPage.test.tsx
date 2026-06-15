import { act, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import StopPage from '@/StopPage'

vi.mock('@board/components/ErrorBoundary', () => ({
	ErrorBoundary: ({ children }: { children: ReactNode }) => children,
}))
vi.mock('@board/scenarios/Board', () => ({ Board: () => null }))
vi.mock('@components/Header', () => ({ Header: () => null }))
vi.mock('@components/InfoMessage', () => ({ InfoMessage: () => null }))
vi.mock('@hooks/useHeartbeat', () => ({ useHeartbeat: vi.fn() }))
vi.mock('@hooks/useReloadDaily', () => ({ useReloadDaily: vi.fn() }))

describe('StopPage', () => {
	let container: HTMLDivElement

	beforeEach(() => {
		container = document.createElement('div')
		document.body.appendChild(container)
	})

	afterEach(() => {
		document.body.removeChild(container)
		vi.unstubAllGlobals()
	})

	it('passes ?brand query param as data-transport-palette', () => {
		vi.stubGlobal('location', { pathname: '/stop/NSR:StopPlace:337', search: '?brand=atb' })
		act(() => {
			createRoot(container).render(<StopPage />)
		})
		expect(container.firstElementChild?.getAttribute('data-transport-palette')).toBe('atb')
	})

	it('passes empty string as data-transport-palette when brand is absent', () => {
		vi.stubGlobal('location', { pathname: '/stop/NSR:StopPlace:337', search: '' })
		act(() => {
			createRoot(container).render(<StopPage />)
		})
		expect(container.firstElementChild?.getAttribute('data-transport-palette')).toBeUndefined
	})

	it('handles different brand values', () => {
		vi.stubGlobal('location', {
			pathname: '/stop/NSR:StopPlace:337',
			search: '?brand=fram',
		})
		act(() => {
			createRoot(container).render(<StopPage />)
		})
		expect(container.firstElementChild?.getAttribute('data-transport-palette')).toBe('fram')
	})
})
