import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import 'whatwg-fetch'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BoardPage from './Page'
import './Shared/styles/fonts.css'
import './Shared/styles/imports.css'
import './styles/globals.css'

const rootElement = document.getElementById('root')
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<BoardPage />
		</StrictMode>,
	)
}
