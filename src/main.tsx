import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import 'whatwg-fetch'
import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'

const BoardPage = lazy(() => import('./Page'))
const StopPage = lazy(() => import('./StopPage'))
import './Shared/styles/fonts.css'
import './Shared/styles/imports.css'
import './styles/globals.css'

const pathParts = window.location.pathname.split('/').filter(Boolean)
const isStopRoute = pathParts[0] === 'stop' && pathParts.length >= 2

const rootElement = document.getElementById('root')
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<Suspense fallback={null}>{isStopRoute ? <StopPage /> : <BoardPage />}</Suspense>
		</StrictMode>,
	)
}
