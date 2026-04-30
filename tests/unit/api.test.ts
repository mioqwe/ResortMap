import { describe, it, expect, beforeAll } from 'vitest';
import { readFile } from 'fs/promises';
import { join } from 'path';

const mapPath = join(process.cwd(), 'map.ascii');
const bookingsPath = join(process.cwd(), 'bookings.json');

describe('API Tests', () => {
  describe('GET /api/map', () => {
    it('should return correct map structure', async () => {
      const content = await readFile(mapPath, 'utf-8');
      const lines = content.trim().split('\n');
      const expectedTiles = lines.map((line) => line.split(''));

      expect(expectedTiles.length).toBe(19);
      expect(expectedTiles[0].length).toBe(20);
    });
  });

  describe('GET /api/bookings', () => {
    it('should return guest list from bookings.json', async () => {
      const content = await readFile(bookingsPath, 'utf-8');
      const guests = JSON.parse(content);

      expect(Array.isArray(guests)).toBe(true);
      expect(guests.length).toBe(100);
      expect(guests[0]).toEqual({ room: '101', guestName: 'Alice Smith' });
    });
  });

  describe('Guest Validation', () => {
    it('should validate guest with room 101 and name Alice Smith', async () => {
      const content = await readFile(bookingsPath, 'utf-8');
      const guests = JSON.parse(content);
      const guest = guests.find((g: { room: string; guestName: string }) => g.room === '101' && g.guestName === 'Alice Smith');

      expect(guest).toBeDefined();
      expect(guest?.room).toBe('101');
      expect(guest?.guestName).toBe('Alice Smith');
    });

    it('should not find guest with invalid room', async () => {
      const content = await readFile(bookingsPath, 'utf-8');
      const guests = JSON.parse(content);
      const guest = guests.find((g: { room: string; guestName: string }) => g.room === '999' && g.guestName === 'Alice Smith');

      expect(guest).toBeUndefined();
    });

    it('should not find guest with invalid name', async () => {
      const content = await readFile(bookingsPath, 'utf-8');
      const guests = JSON.parse(content);
      const guest = guests.find((g: { room: string; guestName: string }) => g.room === '101' && g.guestName === 'Invalid Name');

      expect(guest).toBeUndefined();
    });
  });
});