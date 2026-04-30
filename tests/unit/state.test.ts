import { describe, it, expect, beforeEach } from 'vitest';
import { isCabanaBooked, bookCabana, getBooking, clearAllBookings } from '../../src/lib/server/state';

describe('State Management', () => {
  beforeEach(() => {
    clearAllBookings();
  });

  describe('isCabanaBooked', () => {
    it('should return false for unbooked cabana', () => {
      const result = isCabanaBooked('12_3');
      expect(result).toBe(false);
    });

    it('should return true for booked cabana', () => {
      bookCabana('12_3', '101', 'Alice Smith');
      const result = isCabanaBooked('12_3');
      expect(result).toBe(true);
    });
  });

  describe('bookCabana', () => {
    it('should successfully book available cabana', () => {
      const result = bookCabana('12_3', '101', 'Alice Smith');
      expect(result).toBe(true);
      expect(isCabanaBooked('12_3')).toBe(true);
    });

    it('should return false when cabana is already booked', () => {
      bookCabana('12_3', '101', 'Alice Smith');
      const result = bookCabana('12_3', '102', 'Bob Jones');
      expect(result).toBe(false);
    });
  });

  describe('getBooking', () => {
    it('should return booking info for booked cabana', () => {
      bookCabana('12_3', '101', 'Alice Smith');
      const result = getBooking('12_3');
      expect(result).toEqual({ room: '101', guestName: 'Alice Smith' });
    });

    it('should return undefined for unbooked cabana', () => {
      const result = getBooking('99_99');
      expect(result).toBeUndefined();
    });
  });
});