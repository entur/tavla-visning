import type { BoardDB } from '../types/db-types/boards'

export const PREVIEW_BOARDS: BoardDB[] = [
	{
		id: 'preview-1',
		meta: {
			fontSize: 'medium',
		},
		tiles: [
			{
				columns: ['line', 'destination', 'time', 'platform'],
				quays: [],
				stopPlaceId: 'NSR:StopPlace:58856',
				name: 'Lysaker stasjon, Bærum',
				uuid: 'WPLoeygP7d173RifiQDvd',
				walkingDistance: {
					distance: 694,
					visible: true,
				},
				filter: {
					type: 'stopPlaceFilter',
					whitelistedModes: [],
					whitelistedLines: [],
				},
			},
		],
	},
	{
		id: 'preview-2',

		meta: {
			fontSize: 'large',
		},
		theme: 'light',

		tiles: [
			{
				columns: ['line', 'destination', 'time'],
				stopPlaceId: 'NSR:StopPlace:58374',
				name: 'Horten ferjekai',
				quays: [],
				uuid: 'lqfe6yE6hStaM8yWbfmb2',
			},
		],
	},

	{
		id: 'preview-3',
		meta: {
			fontSize: 'medium',
		},
		theme: 'dark',
		tiles: [
			{
				columns: ['line', 'destination', 'time'],
				stopPlaceId: 'NSR:StopPlace:64236',
				name: 'Løkkeveien, Alta',
				quays: [],
				uuid: '6hojyqhlUQXu53IZ5Jzyr',
			},
			{
				columns: ['line', 'destination', 'time'],
				stopPlaceId: 'NSR:StopPlace:755',
				quays: [],
				uuid: 'NAcHs8-mfXJhiL6mKEHPj',
				name: 'Alta lufthavn Terminal, Alta',
			},
		],
	},
]
