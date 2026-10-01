let offset = 0
let lastSent = 0

export function getServerNow(): number {
	return Date.now() + offset
}

export function applyServerTime(serverTime: number, sentAt: number): void {
	if (sentAt <= lastSent) return
	const receivedAt = Date.now()

	// Midtpunkt sendt/mottatt for å kompensere for tiden det tar for meldingen å reise frem og tilbake
	offset = serverTime - (sentAt + receivedAt) / 2

	lastSent = sentAt
}
