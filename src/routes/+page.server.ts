import { readFileSync } from 'fs';
import { error } from '@sveltejs/kit';
import { isCabanaBooked } from '$lib/server/state';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
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

	let cabanaCount = 0;
	let bookedCount = 0;

	for (let row = 0; row < lines.length; row++) {
		const line = lines[row];
		for (let col = 0; col < line.length; col++) {
			const char = line[col];
			let cabanaId: string | null = null;
			let isBooked = false;

			if (char === 'W') {
				cabanaId = `${row}_${col}`;
				cabanaCount++;
				isBooked = isCabanaBooked(cabanaId);
				if (isBooked) bookedCount++;
				cabanaPositions.push({ row, col, cabanaId });
			}

			tiles.push({ row, col, type: char, cabanaId, isBooked });
		}
	}

	return {
		tiles,
		cabanaPositions,
		cabanaCount,
		bookedCount
	};
};