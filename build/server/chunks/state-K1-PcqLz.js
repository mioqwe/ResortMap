const cabanaBookings = /* @__PURE__ */ new Map();
function isCabanaBooked(cabanaId) {
  return cabanaBookings.has(cabanaId);
}
function bookCabana(cabanaId, room, guestName) {
  if (cabanaBookings.has(cabanaId)) {
    return false;
  }
  cabanaBookings.set(cabanaId, { room, guestName });
  return true;
}
function getBooking(cabanaId) {
  return cabanaBookings.get(cabanaId);
}

export { bookCabana as b, getBooking as g, isCabanaBooked as i };
//# sourceMappingURL=state-K1-PcqLz.js.map
