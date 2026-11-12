import { DataFetchingFailed } from '@board/components/DataFetchingFailed'
import { reportError } from '@utils/report'
import React from 'react'

const ERROR_RELOAD_DELAY_MS = 30 * 1000

interface Props {
	boardId: string | undefined
	children: React.ReactNode
}

interface State {
	hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
	private reloadTimeout: ReturnType<typeof setTimeout> | undefined

	constructor(props: Props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(): State {
		return { hasError: true }
	}

	componentDidCatch(error: Error): void {
		if (this.props.boardId) {
			reportError(this.props.boardId, 'display_error', error?.message ?? 'Unknown error')
		}

		this.reloadTimeout = setTimeout(() => {
			window.location.reload()
		}, ERROR_RELOAD_DELAY_MS)
	}

	componentWillUnmount(): void {
		clearTimeout(this.reloadTimeout)
	}

	render() {
		if (this.state.hasError) {
			return <DataFetchingFailed />
		}
		return this.props.children
	}
}

export { ErrorBoundary }
