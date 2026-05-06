import useSWR from 'swr'
import { CLIENT_NAME, NSR_STOP_PLACES_ENDPOINT } from '@/Shared/assets/env'
import { MOCK_STOP_PLACE_DATA } from '@/Shared/assets/mockStopPlaceData'
import type { TNsrStopPlace } from '@/Shared/types/nsr-types'

const STOP_PLACE_INFO_QUERY = `
  query StopPlaceInfo($id: String!) {
    stopPlace(id: $id) {
      id
      name { value }
      description { value }
      topographicPlace {
        name { value }
        parentTopographicPlace { name { value } }
      }
      placeEquipments {
        shelterEquipment { enclosed seats stepFreeAccess }
        waitingRoomEquipment { numberOfSeats stepFreeAccess }
        sanitaryEquipment { numberOfToilets gender }
        cycleStorageEquipment { numberOfSpaces covered }
        lockerEquipment { numberOfLockers }
        ticketingEquipment { ticketMachines ticketOffice }
      }
      accessibilityAssessment {
        limitations {
          wheelchairAccess
          stepFreeAccess
          visualSignsAvailable
          audibleSignalsAvailable
        }
      }
    }
  }
`

async function fetchStopPlaceInfo(stopPlaceId: string): Promise<TNsrStopPlace | null> {
	try {
		const res = await fetch(NSR_STOP_PLACES_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'ET-Client-Name': CLIENT_NAME,
			},
			body: JSON.stringify({
				query: STOP_PLACE_INFO_QUERY,
				variables: { id: stopPlaceId },
			}),
		})

		if (!res.ok) {
			if (import.meta.env.DEV) return MOCK_STOP_PLACE_DATA[stopPlaceId] ?? null
			return null
		}

		const json = await res.json()
		const result = json?.data?.stopPlace as TNsrStopPlace | undefined
		if (!result && import.meta.env.DEV) return MOCK_STOP_PLACE_DATA[stopPlaceId] ?? null
		return result ?? null
	} catch {
		if (import.meta.env.DEV) return MOCK_STOP_PLACE_DATA[stopPlaceId] ?? null
		return null
	}
}

export function useStopPlaceInfo(stopPlaceId: string | undefined) {
	const { data, error } = useSWR(
		stopPlaceId ? ['nsr-stop-place', stopPlaceId] : null,
		([, id]) => fetchStopPlaceInfo(id),
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			// Facility data changes rarely — cache for 1 hour
			dedupingInterval: 60 * 60 * 1000,
			refreshInterval: undefined,
		},
	)

	return { stopPlaceInfo: data ?? null, isLoading: !error && data === undefined }
}
