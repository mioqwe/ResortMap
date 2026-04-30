import { readFileSync } from 'fs';
import { e as error, j as json } from './index-D1hZvBrU.js';

const GET = async ({ locals }) => {
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
  return json(bookings);
};

export { GET };
//# sourceMappingURL=_server.ts-CqBkcprW.js.map
