import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react-swc'
import * as path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		react(),
		legacy({
			targets: ['chrome>=49'],
			additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
			renderLegacyChunks: true,
			modernPolyfills: true,
		}),
	],

	build: {
		target: 'es2015',
		minify: 'esbuild',
	},
	esbuild: {
		target: 'es2015',
	},
	server: {
		headers: {
			'Content-Security-Policy':
				"frame-ancestors 'self' https://tavla.entur.no https://tavla.dev.entur.no http://localhost:3000",
		},
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
			'@graphql': path.resolve(__dirname, './src/Shared/graphql'),
			'@assets': path.resolve(__dirname, './src/Shared/assets'),
		},
	},
})
