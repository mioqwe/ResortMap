import { readFileSync } from 'fs';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface BookingEntry {
	room: string;
	guestName: string;
}

export const GET: RequestHandler = async ({ locals }) => {
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

	return json(bookings);
};