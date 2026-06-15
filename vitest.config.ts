import * as path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts'],
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@src': path.resolve(__dirname, './src'),
			'@shared': path.resolve(__dirname, './src/Shared'),
			'@board': path.resolve(__dirname, './src/Board'),
			'@components': path.resolve(__dirname, './src/Shared/components'),
			'@hooks': path.resolve(__dirname, './src/Shared/hooks'),
			'@utils': path.resolve(__dirname, './src/Shared/utils'),
			'@types': path.resolve(__dirname, './src/Shared/types'),
			'@styles': path.resolve(__dirname, './src/styles'),
			'@assets': path.resolve(__dirname, './src/Shared/assets'),
		},
	},
})
