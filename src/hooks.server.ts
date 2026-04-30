import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.mapPath = process.env.VITE_MAP_PATH || 'map.ascii';
  event.locals.bookingsPath = process.env.VITE_BOOKINGS_PATH || 'bookings.json';

  return resolve(event);
};