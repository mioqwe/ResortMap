import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    map: {
      type: 'string',
      default: 'map.ascii'
    },
    bookings: {
      type: 'string',
      default: 'bookings.json'
    }
  }
});

process.env.VITE_MAP_PATH = values.map;
process.env.VITE_BOOKINGS_PATH = values.bookings;

const { createServer } = await import('vite');
const server = await createServer({ configFile: 'vite.config.ts' });
await server.listen();
server.printUrls();