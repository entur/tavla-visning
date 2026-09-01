import { describe, expect, it } from 'vitest'
import { getPlatformLabel } from '@/Shared/utils/translations'

describe('getPlatformLabel', () => {
	it('returnerer riktig etikett for én transportmodus', () => {
		expect(getPlatformLabel(['bus'], 'nb')).toBe('Plattform')
		expect(getPlatformLabel(['rail'], 'nb')).toBe('Spor')
		expect(getPlatformLabel(['water'], 'nb')).toBe('Kai')
		expect(getPlatformLabel(['air'], 'nb')).toBe('Gate')
		expect(getPlatformLabel(['metro'], 'nb')).toBe('Spor')
	})

	it('returnerer engelsk etikett når language er en', () => {
		expect(getPlatformLabel(['rail'], 'en')).toBe('Track')
	})

	it('kombinerer flere avganger med samme transportmodus til én etikett', () => {
		expect(getPlatformLabel(['bus', 'bus', 'bus'], 'nb')).toBe('Plattform')
	})

	it('kombinerer ulike transportmoduser som deler samme etikett til én etikett', () => {
		expect(getPlatformLabel(['metro', 'rail'], 'nb')).toBe('Spor')
	})

	it('faller tilbake til standardetikett når transportmodusene gir ulike etiketter', () => {
		expect(getPlatformLabel(['bus', 'rail'], 'nb')).toBe('Plattform')
		expect(getPlatformLabel(['bus', 'rail'], 'en')).toBe('Platform')
	})

	it('behandler unknown-modus som standardetikett', () => {
		expect(getPlatformLabel(['unknown'], 'nb')).toBe('Plattform')
	})

	it('returnerer standardetikett når det ikke er noen verdi', () => {
		expect(getPlatformLabel([], 'nb')).toBe('Plattform')
	})
})
