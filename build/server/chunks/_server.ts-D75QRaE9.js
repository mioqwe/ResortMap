import { readFileSync } from 'fs';
import { e as error, j as json } from './index-D1hZvBrU.js';
import { i as isCabanaBooked, g as getBooking } from './state-K1-PcqLz.js';

const GET = async ({ locals }) => {
  const { mapPath } = locals;
  let mapContent;
  try {
    mapContent = readFileSync(mapPath, "utf-8");
  } catch (e) {
    throw error(500, `Failed to read map file: ${mapPath}`);
  }
  const lines = mapContent.trim().split("\n");
  const tiles = [];
  const cabanaPositions = [];
  const bookings = {};
  for (let row = 0; row < lines.length; row++) {
    const line = lines[row];
    for (let col = 0; col < line.length; col++) {
      const char = line[col];
      let cabanaId = null;
      let isBooked = false;
      if (char === "W") {
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

export { GET };
//# sourceMappingURL=_server.ts-D75QRaE9.js.map
