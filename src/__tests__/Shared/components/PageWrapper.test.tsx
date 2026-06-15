import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { PageWrapper } from '@components/PageWrapper'

describe('PageWrapper', () => {
	let container: HTMLDivElement

	beforeEach(() => {
		container = document.createElement('div')
		document.body.appendChild(container)
	})

	afterEach(() => {
		document.body.removeChild(container)
	})

	it('applies transportPalette as data-transport-palette', () => {
		act(() => {
			createRoot(container).render(<PageWrapper transportPalette="atb">x</PageWrapper>)
		})
		expect(container.firstElementChild?.getAttribute('data-transport-palette')).toBe('atb')
	})

	it('omits data-transport-palette when prop is not provided', () => {
		act(() => {
			createRoot(container).render(<PageWrapper>x</PageWrapper>)
		})
		expect(container.firstElementChild?.getAttribute('data-transport-palette')).toBeNull()
	})

	it('defaults data-theme to dark', () => {
		act(() => {
			createRoot(container).render(<PageWrapper>x</PageWrapper>)
		})
		expect(container.firstElementChild?.getAttribute('data-theme')).toBe('dark')
	})

	it('applies theme as data-theme', () => {
		act(() => {
			createRoot(container).render(<PageWrapper theme="light">x</PageWrapper>)
		})
		expect(container.firstElementChild?.getAttribute('data-theme')).toBe('light')
	})
})
