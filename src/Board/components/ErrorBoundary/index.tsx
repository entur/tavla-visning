import React from 'react'
import { reportError } from '@utils/reportError'
import { DataFetchingFailed } from '@board/components/DataFetchingFailed'

interface Props {
	boardId: string | undefined
	children: React.ReactNode
}

interface State {
	hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(): State {
		return { hasError: true }
	}

	componentDidCatch(error: Error): void {
		if (this.props.boardId) {
			reportError(this.props.boardId, 'display_error')
		}
		console.error('ErrorBoundary caught:', error)
	}

	render() {
		if (this.state.hasError) {
			return <DataFetchingFailed />
		}
		return this.props.children
	}
}

export { ErrorBoundary }
