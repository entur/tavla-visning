import useSWR from 'swr'
import type { TEndpointNames } from '../assets/env'
import type { TypedDocumentString } from '@/graphql'
import { fetcher } from '@/graphql/utils'

export type TUseQueryOptions = {
	poll: boolean
	endpoint: TEndpointNames
	offset?: number
	enabled?: boolean
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

	const { data, error, isLoading } = useSWR<Data>(
		shouldFetch ? [query, variables, mergedOptions.endpoint, mergedOptions.offset ?? 0] : null,
		fetcher,
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

export function useQueries<Data, Variables>(queries: Array<TQuery<Data, Variables>>) {
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
					fetcher([query.query, query.variables, endpointName, query.options?.offset ?? 0]),
				),
			),
		swrOptions,
	)

	return { data, error, isLoading }
}
