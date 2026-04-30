const API_BASE = '';

export async function getMap() {
  const res = await fetch(`${API_BASE}/api/map`);
  if (!res.ok) throw new Error('Failed to fetch map');
  return res.json();
}

export async function getBookings() {
  const res = await fetch(`${API_BASE}/api/bookings`);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

export async function bookCabana(cabanaId: string, room: string, guestName: string): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${API_BASE}/api/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cabanaId, room, guestName })
  });

  const data = await res.json();
  console.log(data)

  if (!res.ok) {
    return { success: false, error: data.message || data.error || 'Booking failed' };
  }

  return { success: true };
}