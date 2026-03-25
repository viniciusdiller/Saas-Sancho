import GuestsView from '@/components/guests-view';
import type { GuestRecord } from '@/components/guests-view';
import { getAuthenticatedSession } from '@/lib/auth';
import { getReservations, getRooms } from '@/services/tenantService';

function getNightCount(checkIn: string, checkOut: string) {
  const start = new Date(`${checkIn}T00:00:00`).getTime();
  const end = new Date(`${checkOut}T00:00:00`).getTime();
  const diffInDays = Math.round((end - start) / (1000 * 60 * 60 * 24));

  return Math.max(diffInDays, 0);
}

export default async function GuestsPage() {
  const session = await getAuthenticatedSession();

  if (!session) {
    return null;
  }

  const [reservations, rooms] = await Promise.all([getReservations(session.tenantId), getRooms(session.tenantId)]);

  const roomNameById = new Map(rooms.map((room) => [room.id, room.name]));
  const guestHistory = reservations
    .filter((reservation) => reservation.status !== 'blocked' && reservation.customer.name.trim().length > 0)
    .map((reservation) => ({
      ...reservation,
      roomName: roomNameById.get(reservation.roomId) ?? reservation.roomId,
      nights: getNightCount(reservation.checkIn, reservation.checkOut),
    }))
    .sort((left, right) => right.checkIn.localeCompare(left.checkIn));
  return <GuestsView guestHistory={guestHistory as GuestRecord[]} rooms={rooms} />;
}