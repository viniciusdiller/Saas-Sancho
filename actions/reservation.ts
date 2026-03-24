'use server';

import { Op } from 'sequelize';
import { getAuthenticatedSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import type { Reservation } from '@/types/channex';

type ManualReservationInput = {
  roomId: string;
  checkIn: string;
  checkOut: string;
  entryType: 'manual_reservation' | 'blocked';
  amount: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  notes: string;
};

export async function createManualReservationAction(input: ManualReservationInput): Promise<Reservation> {
  const session = await getAuthenticatedSession();

  if (!session) {
    throw new Error('Sessão inválida. Faça login novamente.');
  }

  const { Room, Reservation } = getDb();
  const room = await Room.findOne({ where: { tenantId: session.tenantId, localRoomId: input.roomId } });

  if (!room) {
    throw new Error('Quarto não encontrado para o tenant.');
  }

  const checkIn = new Date(input.checkIn);
  const checkOut = new Date(input.checkOut);

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime()) || checkOut <= checkIn) {
    throw new Error('Período inválido para a reserva.');
  }

  const conflict = await Reservation.findOne({
    where: {
      tenantId: session.tenantId,
      roomId: room.id,
      status: { [Op.ne]: 'cancelled' },
      checkIn: { [Op.lt]: checkOut },
      checkOut: { [Op.gt]: checkIn },
    },
  });

  if (conflict) {
    throw new Error('Já existe uma reserva para este quarto neste período.');
  }

  const created = await Reservation.create({
    roomId: room.id,
    tenantId: session.tenantId,
    channexReservationId: `manual_${Date.now()}`,
    otaSource: 'manual',
    checkIn: checkIn.toISOString(),
    checkOut: checkOut.toISOString(),
    status: input.entryType === 'manual_reservation' ? 'confirmed' : 'blocked',
    channelReference: input.entryType === 'manual_reservation' ? 'MANUAL-RES' : 'MANUAL-BLOCK',
    amount: input.entryType === 'manual_reservation' ? input.amount : 0,
    currency: 'BRL',
    guestName: input.guestName,
    guestEmail: input.guestEmail,
    guestPhone: input.guestPhone,
    notes: input.notes,
  });

  return {
    id: created.channexReservationId,
    roomId: room.localRoomId,
    checkIn: created.checkIn,
    checkOut: created.checkOut,
    status: created.status,
    otaSource: created.otaSource,
    channelReference: created.channelReference,
    amount: Number(created.amount),
    currency: created.currency,
    customer: {
      name: created.guestName,
      email: created.guestEmail,
      phone: created.guestPhone,
    },
    notes: created.notes,
  };
}
