import { reportError, reportSuccess } from '@shared/utils/report'
import useSWR from 'swr'
import type { TypedDocumentString } from '@/graphql'
import { fetcher } from '@/graphql/utils'
import type { TEndpointNames } from '../assets/env'

export type TUseQueryOptions = {
	poll: boolean
	endpoint: TEndpointNames
	offset?: number
	enabled?: boolean
	boardId?: string
}

export function useQuery<Data, Variables>(
	query: TypedDocumentString<Data, Variables>,
	variables: Variables,
	options?: Partial<TUseQueryOptions>,
) {
	const mergedOptions: TUseQueryOptions = {
		poll: false,
		endpoint: 'journey-planner',
		enabled: true,
		...options,
	}

	const shouldFetch = mergedOptions.enabled !== false
	const key: [TypedDocumentString<Data, Variables>, Variables, TEndpointNames, number] = [
		query,
		variables,
		mergedOptions.endpoint,
		mergedOptions.offset ?? 0,
	]

	const { data, error, isLoading } = useSWR<Data>(
		shouldFetch ? key : null,
		() =>
			fetcher<Data, Variables>(key)
				.then((res) => {
					reportSuccess(mergedOptions.boardId ?? '', 'fetch_journey_planner')
					return res
				})
				.catch((err) => {
					reportError(
						mergedOptions.boardId ?? '',
						'fetch_journey_planner',
						err.message || 'Unknown error',
						err.name,
					)
					throw err
				}),
		{
			revalidateOnFocus: true,
			revalidateOnReconnect: true,
			refreshInterval: mergedOptions.poll ? 30000 : undefined,
			keepPreviousData: true,
		},
	)

	return { data, error, isLoading }
}
export type TQuery<Data, Variables> = {
	query: TypedDocumentString<Data, Variables>
	variables: Variables
	options?: Partial<TUseQueryOptions>
}

export function useQueries<Data, Variables>(
	queries: Array<TQuery<Data, Variables>>,
	boardId?: string,
) {
	const swrOptions = {
		revalidateOnFocus: true,
		revalidateOnReconnect: true,
		refreshInterval: 30000,
	}
	const endpointName = 'journey-planner'

	const { data, error, isLoading } = useSWR(
		queries,
		(queries) =>
			Promise.all(
				queries.map((query) =>
					fetcher([query.query, query.variables, endpointName, query.options?.offset ?? 0])
						.then((res) => {
							reportSuccess(boardId ?? '', 'fetch_journey_planner')
							return res
						})
						.catch((err) => {
							reportError(
								boardId ?? '',
								'fetch_journey_planner',
								err.message || 'Unknown error',
								err.name,
							)
							throw err
						}),
				),
			),
		swrOptions,
	)

	return { data, error, isLoading }
}
