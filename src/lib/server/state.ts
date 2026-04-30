/**
 * In-memory cabana booking state
 * Module-level Map for storing cabana bookings
 */

export interface Booking {
	room: string;
	guestName: string;
}

// In-memory storage for cabana bookings: cabanaId -> { room, guestName }
const cabanaBookings = new Map<string, Booking>();

/**
 * Returns all cabana bookings
 */
export function getCabanaBookings(): Map<string, Booking> {
	return cabanaBookings;
}

/**
 * Checks if a cabana is already booked
 */
export function isCabanaBooked(cabanaId: string): boolean {
	return cabanaBookings.has(cabanaId);
}

/**
 * Books a cabana for a guest
 * @returns true if booked successfully, false if already booked
 */
export function bookCabana(cabanaId: string, room: string, guestName: string): boolean {
	if (cabanaBookings.has(cabanaId)) {
		return false;
	}
	cabanaBookings.set(cabanaId, { room, guestName });
	return true;
}

/**
 * Gets the booking for a specific cabana
 * @returns Booking object or undefined if not booked
 */
export function getBooking(cabanaId: string): Booking | undefined {
	return cabanaBookings.get(cabanaId);
}

/**
 * Clears all cabana bookings (for testing)
 */
export function clearAllBookings(): void {
	cabanaBookings.clear();
}