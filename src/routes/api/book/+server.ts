import { readFileSync } from 'fs';
import { json, error } from '@sveltejs/kit';
import { bookCabana } from '$lib/server/state';
import type { RequestHandler } from './$types';

interface BookingEntry {
	room: string;
	guestName: string;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	let body: { cabanaId?: string; room?: string; guestName?: string };

	try {
		body = await request.json();
	} catch (e) {
		throw error(400, 'Invalid JSON body');
	}

	const { cabanaId, room, guestName } = body;

	// Validate required fields
	if (!cabanaId || !room || !guestName) {
		throw error(400, 'Missing required fields: cabanaId, room, guestName');
	}

	// Validate cabanaId format (row_col)
	if (!/^\d+_\d+$/.test(cabanaId)) {
		throw error(400, 'Invalid cabanaId format. Expected row_col (e.g., "12_3")');
	}

	// Read and validate against bookings.json
	const { bookingsPath } = locals;
	let bookingsContent: string;

	try {
		bookingsContent = readFileSync(bookingsPath, 'utf-8');
	} catch (e) {
		throw error(500, `Failed to read bookings file: ${bookingsPath}`);
	}

	let bookings: BookingEntry[];
	try {
		bookings = JSON.parse(bookingsContent);
	} catch (e) {
		throw error(500, 'Failed to parse bookings JSON');
	}

	// Find matching guest
	const matchingBooking = bookings.find(
		(b) => b.room === room && b.guestName === guestName
	);

	if (!matchingBooking) {
		throw error(400, 'Invalid room number or guest name');
	}

	// Attempt to book the cabana
	const success = bookCabana(cabanaId, room, guestName);

	if (!success) {
		throw error(409, 'Cabana is already booked');
	}

	return json({ success: true, cabanaId, room, guestName });
};