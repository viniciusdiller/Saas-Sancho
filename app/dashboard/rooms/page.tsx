'use client';

import { useState } from 'react';

import { BedDouble, Settings2 } from 'lucide-react';

import { ROOM_SNAPSHOTS_MOCK } from '@/mocks/dashboard';

type RoomOperationalStatus = 'vacant' | 'cleaning' | 'awaiting_guest' | 'maintenance' | 'occupied';

type RoomSnapshot = {
  id: string;
  room: string;
  category: string;
  status: RoomOperationalStatus;
  updatedAt: string;
  note: string;
};

const ROOM_SNAPSHOTS: RoomSnapshot[] = ROOM_SNAPSHOTS_MOCK.map((item) => ({ ...item }));


function roomStatusBadge(status: RoomOperationalStatus) {
  if (status === 'vacant') {
    return 'bg-emerald-500/10 text-emerald-300 border-emerald-400/25';
  }

  if (status === 'cleaning') {
    return 'bg-amber-500/10 text-amber-200 border-amber-400/30';
  }

  if (status === 'awaiting_guest') {
    return 'bg-sky-500/10 text-sky-200 border-sky-400/30';
  }

  if (status === 'maintenance') {
    return 'bg-rose-500/10 text-rose-200 border-rose-400/30';
  }

  return 'bg-indigo-500/10 text-indigo-200 border-indigo-400/30';
}

function roomStatusLabel(status: RoomOperationalStatus) {
  if (status === 'vacant') {
    return 'Vaga';
  }

  if (status === 'cleaning') {
    return 'Limpando';
  }

  if (status === 'awaiting_guest') {
    return 'Esperando hóspede';
  }

  if (status === 'maintenance') {
    return 'Manutenção';
  }

  return 'Ocupado';
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomSnapshot[]>(ROOM_SNAPSHOTS);

  function updateStatus(id: string, status: RoomOperationalStatus) {
    const now = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date());
    setRooms((prev) => prev.map((room) => (room.id === id ? { ...room, status, updatedAt: now } : room)));
  }

  const totals = {
    vacant: rooms.filter((room) => room.status === 'vacant').length,
    cleaning: rooms.filter((room) => room.status === 'cleaning').length,
    awaitingGuest: rooms.filter((room) => room.status === 'awaiting_guest').length,
    maintenance: rooms.filter((room) => room.status === 'maintenance').length,
    occupied: rooms.filter((room) => room.status === 'occupied').length,
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">Governança operacional</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Painel de quartos</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              Visualização rápida para recepção e governança: quais quartos estão vagos, limpando, esperando hóspede ou em manutenção.
            </p>
          </div>
          <div className="rounded-2xl border border-sky-400/25 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
            Ideal para troca rápida de turno.
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Vaga</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-100">{totals.vacant}</p>
        </article>
        <article className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Limpando</p>
          <p className="mt-2 text-2xl font-semibold text-amber-100">{totals.cleaning}</p>
        </article>
        <article className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Esperando hóspede</p>
          <p className="mt-2 text-2xl font-semibold text-sky-100">{totals.awaitingGuest}</p>
        </article>
        <article className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-rose-200">Manutenção</p>
          <p className="mt-2 text-2xl font-semibold text-rose-100">{totals.maintenance}</p>
        </article>
        <article className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-200">Ocupado</p>
          <p className="mt-2 text-2xl font-semibold text-indigo-100">{totals.occupied}</p>
        </article>
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        {rooms.map((room) => (
          <article key={room.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-sky-300" />
                <div>
                  <p className="font-medium text-white">{room.room}</p>
                  <p className="text-xs text-slate-400">{room.category}</p>
                </div>
              </div>
              <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${roomStatusBadge(room.status)}`}>
                {roomStatusLabel(room.status)}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-300">{room.note}</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Settings2 className="h-3.5 w-3.5" /> Atualizado: {room.updatedAt}
              </p>
              <select
                value={room.status}
                onChange={(e) => updateStatus(room.id, e.target.value as RoomOperationalStatus)}
                className="cursor-pointer rounded-xl border border-white/10 bg-slate-950/60 px-2 py-1 text-xs text-slate-200 outline-none ring-sky-300 transition focus:ring"
              >
                <option value="vacant">Vaga</option>
                <option value="cleaning">Limpando</option>
                <option value="awaiting_guest">Esperando hóspede</option>
                <option value="maintenance">Manutenção</option>
                <option value="occupied">Ocupado</option>
              </select>
            </div>
          </article>
        ))}
      </section>

    </div>
  );
}
