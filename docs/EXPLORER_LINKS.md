# GraphQL Explorer – spørringer i tavla-visning

Lenker til [Journey Planner v3 GraphQL Explorer](https://api.entur.io/graphql-explorer/journey-planner-v3) for å teste og utforske spørringene vi bruker. Hver lenke laster inn spørringen med tilhørende fragmenter og eksempelvariabler, slik at du kan kjøre den direkte i nettleseren.

> **Merk:** Eksempelvariablene (`startTime` etc.) er statiske – oppdater dem i exploreren etter behov.

---

## `getQuay`

Henter avganger og situasjoner for ett enkelt quay (stoppunkt).

**Fil:** [`src/graphql/queries/quay.graphql`](queries/quay.graphql)  
**Fragmenter:** `departure`, `lines`, `situation`

[Åpne i Explorer →](https://api.entur.io/graphql-explorer/journey-planner-v3?operationName=getQuay&query=query%20getQuay%28%0A%20%20%24quayId%3A%20String%21%0A%20%20%24whitelistedTransportModes%3A%20%5BTransportMode%5D%0A%20%20%24whitelistedLines%3A%20%5BID%21%5D%0A%20%20%24numberOfDepartures%3A%20Int%20%3D%2020%0A%20%20%24startTime%3A%20DateTime%0A%29%20%7B%0A%20%20quay%28id%3A%20%24quayId%29%20%7B%0A%20%20%20%20name%0A%20%20%20%20description%0A%20%20%20%20publicCode%0A%20%20%20%20...lines%0A%20%20%20%20estimatedCalls%28%0A%20%20%20%20%20%20numberOfDepartures%3A%20%24numberOfDepartures%0A%20%20%20%20%20%20whiteListedModes%3A%20%24whitelistedTransportModes%0A%20%20%20%20%20%20whiteListed%3A%20%7Blines%3A%20%24whitelistedLines%7D%0A%20%20%20%20%20%20includeCancelledTrips%3A%20true%0A%20%20%20%20%20%20startTime%3A%20%24startTime%0A%20%20%20%20%29%20%7B%0A%20%20%20%20%20%20...departure%0A%20%20%20%20%7D%0A%20%20%20%20situations%20%7B%0A%20%20%20%20%20%20...situation%0A%20%20%20%20%7D%0A%20%20%20%20stopPlace%20%7B%0A%20%20%20%20%20%20situations%20%7B%0A%20%20%20%20%20%20%20%20...situation%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0Afragment%20departure%20on%20EstimatedCall%20%7B%0A%20%20quay%20%7B%0A%20%20%20%20publicCode%0A%20%20%20%20name%0A%20%20%7D%0A%20%20destinationDisplay%20%7B%0A%20%20%20%20frontText%0A%20%20%20%20via%0A%20%20%7D%0A%20%20aimedDepartureTime%0A%20%20expectedDepartureTime%0A%20%20expectedArrivalTime%0A%20%20serviceJourney%20%7B%0A%20%20%20%20id%0A%20%20%20%20transportMode%0A%20%20%20%20transportSubmode%0A%20%20%20%20line%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20presentation%20%7B%0A%20%20%20%20%20%20%20%20textColour%0A%20%20%20%20%20%20%20%20colour%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%20%20cancellation%0A%20%20realtime%0A%20%20situations%20%7B%0A%20%20%20%20...situation%0A%20%20%7D%0A%7D%0Afragment%20lines%20on%20Quay%20%7B%0A%20%20lines%20%7B%0A%20%20%20%20id%0A%20%20%20%20publicCode%0A%20%20%20%20name%0A%20%20%20%20transportMode%0A%20%20%7D%0A%7D%0Afragment%20situation%20on%20PtSituationElement%20%7B%0A%20%20id%0A%20%20description%20%7B%0A%20%20%20%20value%0A%20%20%20%20language%0A%20%20%7D%0A%20%20summary%20%7B%0A%20%20%20%20value%0A%20%20%20%20language%0A%20%20%7D%0A%7D&variables=%7B%0A%20%20%22quayId%22%3A%20%22NSR%3AQuay%3A7479%22%2C%0A%20%20%22whitelistedLines%22%3A%20%5B%0A%20%20%20%20%22RUT%3ALine%3A3820%22%0A%20%20%5D%2C%0A%20%20%22startTime%22%3A%20%222026-05-21T14%3A10%3A32Z%22%0A%7D)

---

## `getQuays`

Henter avganger og situasjoner for flere quays samtidig (brukes til CombinedTile).

**Fil:** [`src/graphql/queries/quays.graphql`](queries/quays.graphql)  
**Fragmenter:** `departure`, `lines`, `situation`

[Åpne i Explorer →](https://api.entur.io/graphql-explorer/journey-planner-v3?operationName=getQuays&query=query%20getQuays%28%0A%20%20%24quayIds%3A%20%5BString%21%5D%0A%20%20%24whitelistedTransportModes%3A%20%5BTransportMode%5D%0A%20%20%24whitelistedLines%3A%20%5BID%21%5D%0A%20%20%24numberOfDepartures%3A%20Int%20%3D%2020%0A%20%20%24startTime%3A%20DateTime%0A%29%20%7B%0A%20%20quays%28ids%3A%20%24quayIds%29%20%7B%0A%20%20%20%20name%0A%20%20%20%20description%0A%20%20%20%20publicCode%0A%20%20%20%20...lines%0A%20%20%20%20estimatedCalls%28%0A%20%20%20%20%20%20numberOfDepartures%3A%20%24numberOfDepartures%0A%20%20%20%20%20%20whiteListedModes%3A%20%24whitelistedTransportModes%0A%20%20%20%20%20%20whiteListed%3A%20%7Blines%3A%20%24whitelistedLines%7D%0A%20%20%20%20%20%20includeCancelledTrips%3A%20true%0A%20%20%20%20%20%20startTime%3A%20%24startTime%0A%20%20%20%20%29%20%7B%0A%20%20%20%20%20%20...departure%0A%20%20%20%20%7D%0A%20%20%20%20situations%20%7B%0A%20%20%20%20%20%20...situation%0A%20%20%20%20%7D%0A%20%20%20%20stopPlace%20%7B%0A%20%20%20%20%20%20situations%20%7B%0A%20%20%20%20%20%20%20%20...situation%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0Afragment%20departure%20on%20EstimatedCall%20%7B%0A%20%20quay%20%7B%0A%20%20%20%20publicCode%0A%20%20%20%20name%0A%20%20%7D%0A%20%20destinationDisplay%20%7B%0A%20%20%20%20frontText%0A%20%20%20%20via%0A%20%20%7D%0A%20%20aimedDepartureTime%0A%20%20expectedDepartureTime%0A%20%20expectedArrivalTime%0A%20%20serviceJourney%20%7B%0A%20%20%20%20id%0A%20%20%20%20transportMode%0A%20%20%20%20transportSubmode%0A%20%20%20%20line%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20presentation%20%7B%0A%20%20%20%20%20%20%20%20textColour%0A%20%20%20%20%20%20%20%20colour%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%20%20cancellation%0A%20%20realtime%0A%20%20situations%20%7B%0A%20%20%20%20...situation%0A%20%20%7D%0A%7D%0Afragment%20lines%20on%20Quay%20%7B%0A%20%20lines%20%7B%0A%20%20%20%20id%0A%20%20%20%20publicCode%0A%20%20%20%20name%0A%20%20%20%20transportMode%0A%20%20%7D%0A%7D%0Afragment%20situation%20on%20PtSituationElement%20%7B%0A%20%20id%0A%20%20description%20%7B%0A%20%20%20%20value%0A%20%20%20%20language%0A%20%20%7D%0A%20%20summary%20%7B%0A%20%20%20%20value%0A%20%20%20%20language%0A%20%20%7D%0A%7D&variables=%7B%0A%20%20%22quayIds%22%3A%20%5B%0A%20%20%20%20%22NSR%3AQuay%3A7479%22%2C%0A%20%20%20%20%22NSR%3AQuay%3A7480%22%0A%20%20%5D%2C%0A%20%20%22whitelistedLines%22%3A%20%5B%5D%2C%0A%20%20%22startTime%22%3A%20%222026-05-21T14%3A10%3A32Z%22%0A%7D)

---

## `StopPlace`

Henter avganger og situasjoner for et stoppested (alle quays samlet). Brukes til SingleTile med stopPlace-konfigurasjon.

**Fil:** [`src/graphql/queries/stopPlace.graphql`](queries/stopPlace.graphql)  
**Fragmenter:** `departure`, `situation`

[Åpne i Explorer →](https://api.entur.io/graphql-explorer/journey-planner-v3?operationName=StopPlace&query=query%20StopPlace%28%0A%20%20%24stopPlaceId%3A%20String%21%0A%20%20%24whitelistedTransportModes%3A%20%5BTransportMode%5D%0A%20%20%24whitelistedLines%3A%20%5BID%21%5D%0A%20%20%24numberOfDepartures%3A%20Int%20%3D%2020%0A%20%20%24startTime%3A%20DateTime%0A%29%20%7B%0A%20%20stopPlace%28id%3A%20%24stopPlaceId%29%20%7B%0A%20%20%20%20name%0A%20%20%20%20transportMode%0A%20%20%20%20estimatedCalls%28%0A%20%20%20%20%20%20numberOfDepartures%3A%20%24numberOfDepartures%0A%20%20%20%20%20%20whiteListedModes%3A%20%24whitelistedTransportModes%0A%20%20%20%20%20%20whiteListed%3A%20%7Blines%3A%20%24whitelistedLines%7D%0A%20%20%20%20%20%20includeCancelledTrips%3A%20true%0A%20%20%20%20%20%20startTime%3A%20%24startTime%0A%20%20%20%20%29%20%7B%0A%20%20%20%20%20%20...departure%0A%20%20%20%20%7D%0A%20%20%20%20situations%20%7B%0A%20%20%20%20%20%20...situation%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0Afragment%20departure%20on%20EstimatedCall%20%7B%0A%20%20quay%20%7B%0A%20%20%20%20publicCode%0A%20%20%20%20name%0A%20%20%7D%0A%20%20destinationDisplay%20%7B%0A%20%20%20%20frontText%0A%20%20%20%20via%0A%20%20%7D%0A%20%20aimedDepartureTime%0A%20%20expectedDepartureTime%0A%20%20expectedArrivalTime%0A%20%20serviceJourney%20%7B%0A%20%20%20%20id%0A%20%20%20%20transportMode%0A%20%20%20%20transportSubmode%0A%20%20%20%20line%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20presentation%20%7B%0A%20%20%20%20%20%20%20%20textColour%0A%20%20%20%20%20%20%20%20colour%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%20%20cancellation%0A%20%20realtime%0A%20%20situations%20%7B%0A%20%20%20%20...situation%0A%20%20%7D%0A%7D%0Afragment%20situation%20on%20PtSituationElement%20%7B%0A%20%20id%0A%20%20description%20%7B%0A%20%20%20%20value%0A%20%20%20%20language%0A%20%20%7D%0A%20%20summary%20%7B%0A%20%20%20%20value%0A%20%20%20%20language%0A%20%20%7D%0A%7D&variables=%7B%0A%20%20%22stopPlaceId%22%3A%20%22NSR%3AStopPlace%3A59872%22%2C%0A%20%20%22whitelistedLines%22%3A%20%5B%5D%2C%0A%20%20%22startTime%22%3A%20%222026-05-21T14%3A10%3A32Z%22%0A%7D)

---

## Fragmenter

Alle tre spørringene bruker disse fragmentene ([`src/graphql/fragments/`](fragments/)):

| Fragment | Brukes av | Beskrivelse |
|---|---|---|
| `departure` | alle tre | Avgangsinformasjon fra `EstimatedCall` |
| `lines` | `getQuay`, `getQuays` | Linjer tilknyttet et quay |
| `situation` | alle tre (via `departure`) | Driftsmeldinger fra `PtSituationElement` |
