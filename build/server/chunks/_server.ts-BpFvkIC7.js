import { readFileSync } from 'fs';
import { e as error, j as json } from './index-D1hZvBrU.js';
import { b as bookCabana } from './state-K1-PcqLz.js';

const POST = async ({ request, locals }) => {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    throw error(400, "Invalid JSON body");
  }
  const { cabanaId, room, guestName } = body;
  if (!cabanaId || !room || !guestName) {
    throw error(400, "Missing required fields: cabanaId, room, guestName");
  }
  if (!/^\d+_\d+$/.test(cabanaId)) {
    throw error(400, 'Invalid cabanaId format. Expected row_col (e.g., "12_3")');
  }
  const { bookingsPath } = locals;
  let bookingsContent;
  try {
    bookingsContent = readFileSync(bookingsPath, "utf-8");
  } catch (e) {
    throw error(500, `Failed to read bookings file: ${bookingsPath}`);
  }
  let bookings;
  try {
    bookings = JSON.parse(bookingsContent);
  } catch (e) {
    throw error(500, "Failed to parse bookings JSON");
  }
  const matchingBooking = bookings.find(
    (b) => b.room === room && b.guestName === guestName
  );
  if (!matchingBooking) {
    throw error(400, "Invalid room number or guest name");
  }
  const success = bookCabana(cabanaId, room, guestName);
  if (!success) {
    throw error(409, "Cabana is already booked");
  }
  return json({ success: true, cabanaId, room, guestName });
};

export { POST };
//# sourceMappingURL=_server.ts-BpFvkIC7.js.map
