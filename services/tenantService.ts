import { getDb } from "@/lib/db";
import type { Expense, Reservation, Room } from "@/types/channex";

function mapRoom(room: InstanceType<ReturnType<typeof getDb>["Room"]>): Room {
  return {
    id: room.localRoomId,
    channexRoomTypeId: room.channexRoomTypeId,
    name: room.name,
    maxGuests: room.maxGuests,
    status: room.status,
  };
}

function mapReservation(
  reservation: InstanceType<ReturnType<typeof getDb>["Reservation"]>,
  roomLocalRoomId: string,
): Reservation {
  const formatDbDate = (val: any) => {
    if (!val) return "";
    const str = typeof val === "string" ? val : new Date(val).toISOString();
    return str.substring(0, 10);
  };
  return {
    id: reservation.channexReservationId,
    roomId: roomLocalRoomId,
    checkIn: formatDbDate(reservation.checkIn),
    checkOut: formatDbDate(reservation.checkOut),
    status: reservation.status,
    otaSource: reservation.otaSource,
    channelReference: reservation.channelReference,
    amount: Number(reservation.amount),
    currency: reservation.currency,
    customer: {
      name: reservation.guestName,
      email: reservation.guestEmail,
      phone: reservation.guestPhone,
    },
    notes: reservation.notes,
  };
}

function mapExpense(
  expense: InstanceType<ReturnType<typeof getDb>["Expense"]>,
): Expense {
  return {
    id: String(expense.id),
    description: expense.description,
    amount: Number(expense.amount),
    date: expense.date,
    category: expense.category,
  };
}

export async function getRooms(tenantId: number): Promise<Room[]> {
  const { Room } = getDb();
  const rooms = await Room.findAll({
    where: { tenantId },
    order: [["name", "ASC"]],
  });
  return rooms.map((room) => mapRoom(room));
}

export async function getReservations(
  tenantId: number,
): Promise<Reservation[]> {
  const { Room, Reservation } = getDb();
  const reservations = await Reservation.findAll({
    where: { tenantId },
    include: [{ model: Room, as: "room" }],
    order: [["checkIn", "ASC"]],
  });

  return reservations.map((reservation) => {
    const room = reservation.get("room") as InstanceType<typeof Room>;
    return mapReservation(reservation, room.localRoomId);
  });
}

export async function updateReservation(
  tenantId: number,
  updatedReservation: Reservation,
): Promise<Reservation> {
  const { Room, Reservation } = getDb();

  const room = await Room.findOne({
    where: { tenantId, localRoomId: updatedReservation.roomId },
  });

  if (!room) {
    throw new Error("Quarto não encontrado para este tenant.");
  }

  const reservation = await Reservation.findOne({
    where: {
      tenantId,
      channexReservationId: updatedReservation.id,
    },
  });

  if (!reservation) {
    throw new Error("Reserva não encontrada para este tenant.");
  }

  await reservation.update({
    roomId: room.id,
    checkIn: updatedReservation.checkIn,
    checkOut: updatedReservation.checkOut,
    status: updatedReservation.status,
    otaSource: updatedReservation.otaSource,
    channelReference: updatedReservation.channelReference,
    amount: updatedReservation.amount,
    currency: updatedReservation.currency,
    guestName: updatedReservation.customer.name,
    guestEmail: updatedReservation.customer.email,
    guestPhone: updatedReservation.customer.phone,
    notes: updatedReservation.notes,
  });

  return mapReservation(reservation, room.localRoomId);
}

export async function getExpenses(tenantId: number): Promise<Expense[]> {
  const { Expense } = getDb();
  const expenses = await Expense.findAll({
    where: { tenantId },
    order: [
      ["date", "DESC"],
      ["id", "DESC"],
    ],
  });
  return expenses.map((expense) => mapExpense(expense));
}

export async function createExpense(
  tenantId: number,
  input: Omit<Expense, "id">,
): Promise<Expense> {
  const { Expense } = getDb();
  const expense = await Expense.create({ ...input, tenantId });
  return mapExpense(expense);
}

export async function getUnifiedInventory(tenantId: number) {
  const [roomList, reservationList, expenseList] = await Promise.all([
    getRooms(tenantId),
    getReservations(tenantId),
    getExpenses(tenantId),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    rooms: roomList,
    reservations: reservationList,
    expenses: expenseList,
  };
}
