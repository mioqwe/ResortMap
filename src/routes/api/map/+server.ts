import { readFileSync } from 'fs';
import { json, error } from '@sveltejs/kit';
import { isCabanaBooked, getBooking } from '$lib/server/state';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const { mapPath } = locals;

	let mapContent: string;
	try {
		mapContent = readFileSync(mapPath, 'utf-8');
	} catch (e) {
		throw error(500, `Failed to read map file: ${mapPath}`);
	}

	const lines = mapContent.trim().split('\n');
	const tiles: Array<{
		row: number;
		col: number;
		type: string;
		cabanaId: string | null;
		isBooked: boolean;
	}> = [];
	const cabanaPositions: Array<{ row: number; col: number; cabanaId: string }> = [];
	const bookings: Record<string, { room: string; guestName: string }> = {};

	for (let row = 0; row < lines.length; row++) {
		const line = lines[row];
		for (let col = 0; col < line.length; col++) {
			const char = line[col];
			let cabanaId: string | null = null;
			let isBooked = false;

			if (char === 'W') {
				cabanaId = `${row}_${col}`;
				isBooked = isCabanaBooked(cabanaId);
				cabanaPositions.push({ row, col, cabanaId });

				const booking = getBooking(cabanaId);
				if (booking) {
					bookings[cabanaId] = booking;
				}
			}

			tiles.push({ row, col, type: char, cabanaId, isBooked });
		}
	}

	return json({
		tiles,
		cabanaPositions,
		bookings
	});
};