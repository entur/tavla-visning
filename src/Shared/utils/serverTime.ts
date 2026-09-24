// Lagrer offset mellom lokal tid og servertid i millisekunder
let offsetMs = 0

// vokter mot at et forsinket/ute-av-rekkefølge heartbeat-svar overskriver en nyere, korrekt offset
let lastAppliedSendTime = 0

export function getServerNow(): number {
	return Date.now() + offsetMs
}

export function applyServerTime(serverEpochMs: number, sentAtMs: number): void {
	if (sentAtMs <= lastAppliedSendTime) return // stale svar — et nyere kall er allerede anvendt
	const receivedAtMs = Date.now()

	// Midtpunktskompensasjon ((sendt+mottatt)/2), samme prinsipp som ekte NTP — kansellerer
	// den systematiske skjevheten en ren "receivedAtMs - offset"-beregning ville gitt fra rundtur-latensen
	offsetMs = serverEpochMs - (sentAtMs + receivedAtMs) / 2

	lastAppliedSendTime = sentAtMs
}
