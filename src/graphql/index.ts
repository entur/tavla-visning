import type * as Types from 'src/types/graphql-schema'

import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core'
export class TypedDocumentString<TResult, TVariables>
	extends String
	implements DocumentTypeDecoration<TResult, TVariables>
{
	__apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>
	private value: string
	public __meta__?: Record<string, any> | undefined

	constructor(value: string, __meta__?: Record<string, any> | undefined) {
		super(value)
		this.value = value
		this.__meta__ = __meta__
	}

	override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
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
) as unknown as TypedDocumentString<Types.TSituationFragment, unknown>
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
) as unknown as TypedDocumentString<Types.TDepartureFragment, unknown>
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
) as unknown as TypedDocumentString<Types.TLinesFragment, unknown>
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
}`) as unknown as TypedDocumentString<Types.TGetQuayQuery, Types.TGetQuayQueryVariables>
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
}`) as unknown as TypedDocumentString<Types.TStopPlaceQuery, Types.TStopPlaceQueryVariables>
