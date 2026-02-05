// @ts-nocheck
import type * as Types from 'src/types/graphql-schema'

import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core'
export type TDepartureFragment = {
	__typename?: 'EstimatedCall'
	aimedDepartureTime: DateTime
	expectedDepartureTime: DateTime
	expectedArrivalTime: DateTime
	cancellation: boolean
	realtime: boolean
	quay: { __typename?: 'Quay'; publicCode: string | null; name: string }
	destinationDisplay: {
		__typename?: 'DestinationDisplay'
		frontText: string | null
		via: Array<string | null> | null
	} | null
	serviceJourney: {
		__typename?: 'ServiceJourney'
		id: string
		transportMode: Types.TTransportMode | null
		transportSubmode: Types.TTransportSubmode | null
		line: {
			__typename?: 'Line'
			id: string
			publicCode: string | null
			presentation: {
				__typename?: 'Presentation'
				textColour: string | null
				colour: string | null
			} | null
		}
	}
	situations: Array<{
		__typename?: 'PtSituationElement'
		id: string
		description: Array<{
			__typename?: 'MultilingualString'
			value: string
			language: string | null
		}>
		summary: Array<{ __typename?: 'MultilingualString'; value: string; language: string | null }>
	}>
}

export type TLinesFragment = {
	__typename?: 'Quay'
	lines: Array<{
		__typename?: 'Line'
		id: string
		publicCode: string | null
		name: string | null
		transportMode: Types.TTransportMode | null
	}>
}

export type TSituationFragment = {
	__typename?: 'PtSituationElement'
	id: string
	description: Array<{ __typename?: 'MultilingualString'; value: string; language: string | null }>
	summary: Array<{ __typename?: 'MultilingualString'; value: string; language: string | null }>
}

export type TGetQuayQueryVariables = Types.Exact<{
	quayId: Types.Scalars['String']['input']
	whitelistedTransportModes?: Types.InputMaybe<
		Array<Types.InputMaybe<Types.TTransportMode>> | Types.InputMaybe<Types.TTransportMode>
	>
	whitelistedLines?: Types.InputMaybe<
		Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input']
	>
	numberOfDepartures?: Types.InputMaybe<Types.Scalars['Int']['input']>
	startTime?: Types.InputMaybe<Types.Scalars['DateTime']['input']>
}>

export type TGetQuayQuery = {
	__typename?: 'QueryType'
	quay: {
		__typename?: 'Quay'
		name: string
		description: string | null
		publicCode: string | null
		estimatedCalls: Array<{
			__typename?: 'EstimatedCall'
			aimedDepartureTime: DateTime
			expectedDepartureTime: DateTime
			expectedArrivalTime: DateTime
			cancellation: boolean
			realtime: boolean
			quay: { __typename?: 'Quay'; publicCode: string | null; name: string }
			destinationDisplay: {
				__typename?: 'DestinationDisplay'
				frontText: string | null
				via: Array<string | null> | null
			} | null
			serviceJourney: {
				__typename?: 'ServiceJourney'
				id: string
				transportMode: Types.TTransportMode | null
				transportSubmode: Types.TTransportSubmode | null
				line: {
					__typename?: 'Line'
					id: string
					publicCode: string | null
					presentation: {
						__typename?: 'Presentation'
						textColour: string | null
						colour: string | null
					} | null
				}
			}
			situations: Array<{
				__typename?: 'PtSituationElement'
				id: string
				description: Array<{
					__typename?: 'MultilingualString'
					value: string
					language: string | null
				}>
				summary: Array<{
					__typename?: 'MultilingualString'
					value: string
					language: string | null
				}>
			}>
		}>
		situations: Array<{
			__typename?: 'PtSituationElement'
			id: string
			description: Array<{
				__typename?: 'MultilingualString'
				value: string
				language: string | null
			}>
			summary: Array<{ __typename?: 'MultilingualString'; value: string; language: string | null }>
		}>
		stopPlace: {
			__typename?: 'StopPlace'
			situations: Array<{
				__typename?: 'PtSituationElement'
				id: string
				description: Array<{
					__typename?: 'MultilingualString'
					value: string
					language: string | null
				}>
				summary: Array<{
					__typename?: 'MultilingualString'
					value: string
					language: string | null
				}>
			}>
		} | null
		lines: Array<{
			__typename?: 'Line'
			id: string
			publicCode: string | null
			name: string | null
			transportMode: Types.TTransportMode | null
		}>
	} | null
}

export type TStopPlaceQueryVariables = Types.Exact<{
	stopPlaceId: Types.Scalars['String']['input']
	whitelistedTransportModes?: Types.InputMaybe<
		Array<Types.InputMaybe<Types.TTransportMode>> | Types.InputMaybe<Types.TTransportMode>
	>
	whitelistedLines?: Types.InputMaybe<
		Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input']
	>
	numberOfDepartures?: Types.InputMaybe<Types.Scalars['Int']['input']>
	startTime?: Types.InputMaybe<Types.Scalars['DateTime']['input']>
}>

export type TStopPlaceQuery = {
	__typename?: 'QueryType'
	stopPlace: {
		__typename?: 'StopPlace'
		name: string
		transportMode: Array<Types.TTransportMode | null> | null
		estimatedCalls: Array<{
			__typename?: 'EstimatedCall'
			aimedDepartureTime: DateTime
			expectedDepartureTime: DateTime
			expectedArrivalTime: DateTime
			cancellation: boolean
			realtime: boolean
			quay: { __typename?: 'Quay'; publicCode: string | null; name: string }
			destinationDisplay: {
				__typename?: 'DestinationDisplay'
				frontText: string | null
				via: Array<string | null> | null
			} | null
			serviceJourney: {
				__typename?: 'ServiceJourney'
				id: string
				transportMode: Types.TTransportMode | null
				transportSubmode: Types.TTransportSubmode | null
				line: {
					__typename?: 'Line'
					id: string
					publicCode: string | null
					presentation: {
						__typename?: 'Presentation'
						textColour: string | null
						colour: string | null
					} | null
				}
			}
			situations: Array<{
				__typename?: 'PtSituationElement'
				id: string
				description: Array<{
					__typename?: 'MultilingualString'
					value: string
					language: string | null
				}>
				summary: Array<{
					__typename?: 'MultilingualString'
					value: string
					language: string | null
				}>
			}>
		}>
		situations: Array<{
			__typename?: 'PtSituationElement'
			id: string
			description: Array<{
				__typename?: 'MultilingualString'
				value: string
				language: string | null
			}>
			summary: Array<{ __typename?: 'MultilingualString'; value: string; language: string | null }>
		}>
	} | null
}

export class TypedDocumentString<TResult, TVariables>
	extends String
	implements DocumentTypeDecoration<TResult, TVariables>
{
	__apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType']

	constructor(
		private value: string,
		public __meta__?: Record<string, any>,
	) {
		super(value)
	}

	toString(): string & DocumentTypeDecoration<TResult, TVariables> {
		return this.value
	}
}
export const SituationFragment = new TypedDocumentString(
	`
    fragment situation on PtSituationElement {
  id
  description {
    value
    language
  }
  summary {
    value
    language
  }
}
    `,
	{ fragmentName: 'situation' },
) as unknown as TypedDocumentString<TSituationFragment, unknown>
export const DepartureFragment = new TypedDocumentString(
	`
    fragment departure on EstimatedCall {
  quay {
    publicCode
    name
  }
  destinationDisplay {
    frontText
    via
  }
  aimedDepartureTime
  expectedDepartureTime
  expectedArrivalTime
  serviceJourney {
    id
    transportMode
    transportSubmode
    line {
      id
      publicCode
      presentation {
        textColour
        colour
      }
    }
  }
  cancellation
  realtime
  situations {
    ...situation
  }
}
    fragment situation on PtSituationElement {
  id
  description {
    value
    language
  }
  summary {
    value
    language
  }
}`,
	{ fragmentName: 'departure' },
) as unknown as TypedDocumentString<TDepartureFragment, unknown>
export const LinesFragment = new TypedDocumentString(
	`
    fragment lines on Quay {
  lines {
    id
    publicCode
    name
    transportMode
  }
}
    `,
	{ fragmentName: 'lines' },
) as unknown as TypedDocumentString<TLinesFragment, unknown>
export const GetQuayQuery = new TypedDocumentString(`
    query getQuay($quayId: String!, $whitelistedTransportModes: [TransportMode], $whitelistedLines: [ID!], $numberOfDepartures: Int = 20, $startTime: DateTime) {
  quay(id: $quayId) {
    name
    description
    publicCode
    ...lines
    estimatedCalls(
      numberOfDepartures: $numberOfDepartures
      whiteListedModes: $whitelistedTransportModes
      whiteListed: {lines: $whitelistedLines}
      includeCancelledTrips: true
      startTime: $startTime
    ) {
      ...departure
    }
    situations {
      ...situation
    }
    stopPlace {
      situations {
        ...situation
      }
    }
  }
}
    fragment departure on EstimatedCall {
  quay {
    publicCode
    name
  }
  destinationDisplay {
    frontText
    via
  }
  aimedDepartureTime
  expectedDepartureTime
  expectedArrivalTime
  serviceJourney {
    id
    transportMode
    transportSubmode
    line {
      id
      publicCode
      presentation {
        textColour
        colour
      }
    }
  }
  cancellation
  realtime
  situations {
    ...situation
  }
}
fragment lines on Quay {
  lines {
    id
    publicCode
    name
    transportMode
  }
}
fragment situation on PtSituationElement {
  id
  description {
    value
    language
  }
  summary {
    value
    language
  }
}`) as unknown as TypedDocumentString<TGetQuayQuery, TGetQuayQueryVariables>
export const StopPlaceQuery = new TypedDocumentString(`
    query StopPlace($stopPlaceId: String!, $whitelistedTransportModes: [TransportMode], $whitelistedLines: [ID!], $numberOfDepartures: Int = 20, $startTime: DateTime) {
  stopPlace(id: $stopPlaceId) {
    name
    transportMode
    estimatedCalls(
      numberOfDepartures: $numberOfDepartures
      whiteListedModes: $whitelistedTransportModes
      whiteListed: {lines: $whitelistedLines}
      includeCancelledTrips: true
      startTime: $startTime
    ) {
      ...departure
    }
    situations {
      ...situation
    }
  }
}
    fragment departure on EstimatedCall {
  quay {
    publicCode
    name
  }
  destinationDisplay {
    frontText
    via
  }
  aimedDepartureTime
  expectedDepartureTime
  expectedArrivalTime
  serviceJourney {
    id
    transportMode
    transportSubmode
    line {
      id
      publicCode
      presentation {
        textColour
        colour
      }
    }
  }
  cancellation
  realtime
  situations {
    ...situation
  }
}
fragment situation on PtSituationElement {
  id
  description {
    value
    language
  }
  summary {
    value
    language
  }
}`) as unknown as TypedDocumentString<TStopPlaceQuery, TStopPlaceQueryVariables>
