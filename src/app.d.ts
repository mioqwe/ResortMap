// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      mapPath: string;
      bookingsPath: string;
    }
    interface PageData {
      rows: Array<Array<{ type: string; cabanaId: string | null; isBooked: boolean }>>;
      cabanaBookings: Record<string, { room: string; guestName: string }>;
    }
  }
}

export {};