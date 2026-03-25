'use client';

import { useMemo, useState } from 'react';
import { ClipboardCheck, DoorOpen, Search, UserRoundPlus } from 'lucide-react';

type StayStatus = 'reserved' | 'checked_in' | 'checked_out';

type Stay = {
  id: string;
  guestName: string;
  document: string;
  room: string;
  peopleCount: number;
  checkInDate: string;
  checkOutDate: string;
  status: StayStatus;
  notes: string;
  checkedInAt?: string;
  checkedOutAt?: string;
};

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDateByOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toLocalDateKey(date);
}

const TODAY_KEY = getDateByOffset(0);

const INITIAL_STAYS: Stay[] = [
  {
    id: 'stay-example-checkin',
    guestName: 'Camila Torres',
    document: '157.444.990-03',
    room: 'Suíte Atlântico',
    peopleCount: 2,
    checkInDate: TODAY_KEY,
    checkOutDate: getDateByOffset(3),
    status: 'reserved',
    notes: 'Exemplo: chegada prevista para hoje.',
  },
  {
    id: 'stay-example-checkout',
    guestName: 'Diego Lima',
    document: '320.117.880-60',
    room: 'Chalé Serra Azul',
    peopleCount: 2,
    checkInDate: getDateByOffset(-2),
    checkOutDate: TODAY_KEY,
    status: 'checked_in',
    notes: 'Exemplo: saída prevista para hoje.',
    checkedInAt: `${getDateByOffset(-2)}T15:10:00`,
  },
  {
    id: 'stay-1',
    guestName: 'Mariana Costa',
    document: '112.334.889-10',
    room: 'Bangalô Oceano',
    peopleCount: 2,
    checkInDate: getDateByOffset(1),
    checkOutDate: getDateByOffset(4),
    status: 'reserved',
    notes: 'Lua de mel. Solicita espumante.',
  },
  {
    id: 'stay-2',
    guestName: 'Rafael Nunes',
    document: '904.221.730-55',
    room: 'Suíte Coral Premium',
    peopleCount: 3,
    checkInDate: getDateByOffset(-1),
    checkOutDate: getDateByOffset(2),
    status: 'checked_in',
    notes: 'Chegada tardia registrada na madrugada.',
    checkedInAt: `${getDateByOffset(-1)}T23:42:00`,
  },
  {
    id: 'stay-3',
    guestName: 'Paulo Menezes',
    document: '201.555.221-40',
    room: 'Bangalô Oceano',
    peopleCount: 2,
    checkInDate: getDateByOffset(-5),
    checkOutDate: getDateByOffset(-1),
    status: 'checked_out',
    notes: 'Checkout finalizado sem pendencias.',
    checkedInAt: `${getDateByOffset(-5)}T15:15:00`,
    checkedOutAt: `${getDateByOffset(-1)}T11:06:00`,
  },
];

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value?: string) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function statusBadge(status: StayStatus) {
  if (status === 'checked_in') {
    return 'bg-emerald-500/10 text-emerald-300 border-emerald-400/25';
  }

  if (status === 'checked_out') {
    return 'bg-slate-600/30 text-slate-200 border-slate-400/30';
  }

  return 'bg-sky-500/10 text-sky-300 border-sky-400/30';
}

function statusLabel(status: StayStatus) {
  if (status === 'checked_in') {
    return 'Hospedado';
  }

  if (status === 'checked_out') {
    return 'Checkout finalizado';
  }

  return 'Reserva confirmada';
}

export default function CheckPage() {
  const [stays, setStays] = useState<Stay[]>(INITIAL_STAYS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | StayStatus>('all');
  const [logs, setLogs] = useState<string[]>([]);
  const [form, setForm] = useState({
    guestName: '',
    document: '',
    room: '',
    peopleCount: '1',
    checkInDate: '',
    checkOutDate: '',
    notes: '',
  });

  const filteredStays = useMemo(() => {
    return stays.filter((stay) => {
      const matchesFilter = filter === 'all' ? true : stay.status === filter;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        term.length === 0 ||
        stay.guestName.toLowerCase().includes(term) ||
        stay.room.toLowerCase().includes(term) ||
        stay.document.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [filter, search, stays]);

  const totals = useMemo(() => {
    return {
      arrivals: stays.filter((stay) => stay.status === 'reserved').length,
      inHouse: stays.filter((stay) => stay.status === 'checked_in').length,
      departuresDone: stays.filter((stay) => stay.status === 'checked_out').length,
    };
  }, [stays]);

  function canCheckInToday(stay: Stay) {
    return stay.status === 'reserved' && stay.checkInDate === TODAY_KEY;
  }

  function canCheckOutToday(stay: Stay) {
    return stay.status === 'checked_in' && stay.checkOutDate === TODAY_KEY;
  }

  function pushLog(message: string) {
    const time = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());

    setLogs((prev) => [`${time} - ${message}`, ...prev].slice(0, 8));
  }

  function handleCheckIn(stayId: string) {
    const current = stays.find((stay) => stay.id === stayId);
    if (!current || current.status !== 'reserved') {
      return;
    }

    if (current.checkInDate !== TODAY_KEY) {
      pushLog(`Check-in bloqueado para ${current.guestName}. Permitido somente no dia ${formatShortDate(current.checkInDate)}.`);
      return;
    }

    const checkedInAt = new Date().toISOString();
    setStays((prev) => prev.map((stay) => (stay.id === stayId ? { ...stay, status: 'checked_in', checkedInAt } : stay)));
    pushLog(`Check-in realizado para ${current.guestName} no quarto ${current.room}.`);
  }

  function handleCheckOut(stayId: string) {
    const current = stays.find((stay) => stay.id === stayId);
    if (!current || current.status !== 'checked_in') {
      return;
    }

    if (current.checkOutDate !== TODAY_KEY) {
      pushLog(
        `Checkout bloqueado para ${current.guestName}. Permitido somente no último dia da reserva (${formatShortDate(current.checkOutDate)}).`,
      );
      return;
    }

    const checkedOutAt = new Date().toISOString();
    setStays((prev) => prev.map((stay) => (stay.id === stayId ? { ...stay, status: 'checked_out', checkedOutAt } : stay)));
    pushLog(`Checkout finalizado para ${current.guestName} no quarto ${current.room}.`);
  }

  function handleCreateStay(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.guestName || !form.room || !form.checkInDate || !form.checkOutDate) {
      return;
    }

    if (form.checkOutDate <= form.checkInDate) {
      pushLog('Período inválido: o checkout deve ser posterior ao check-in.');
      return;
    }

    const newStay: Stay = {
      id: globalThis.crypto?.randomUUID?.() ?? `stay-${Date.now()}`,
      guestName: form.guestName,
      document: form.document || 'Não informado',
      room: form.room,
      peopleCount: Number(form.peopleCount) || 1,
      checkInDate: form.checkInDate,
      checkOutDate: form.checkOutDate,
      status: 'reserved',
      notes: form.notes || 'Reserva criada manualmente pela recepção.',
    };

    setStays((prev) => [newStay, ...prev]);
    setForm({
      guestName: '',
      document: '',
      room: '',
      peopleCount: '1',
      checkInDate: '',
      checkOutDate: '',
      notes: '',
    });
    pushLog(`Nova reserva mock criada para ${newStay.guestName}.`);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">Recepção Viva Mar</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Check-in e Check-out com mocks operacionais</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              Fluxo completo sem banco: cadastro de reserva mock, check-in, check-out, filtros por status e histórico de ações em tempo real.
            </p>
          </div>
          <div className="rounded-2xl border border-sky-400/25 bg-sky-500/10 px-4 py-3 text-sm text-sky-200">
            Ambiente de treino e validação de processo interno.
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-[24px] border border-white/10 bg-slate-900/80 p-5 text-white">
          <p className="text-sm text-slate-400">Chegadas pendentes</p>
          <p className="mt-2 text-3xl font-semibold">{totals.arrivals}</p>
        </article>
        <article className="rounded-[24px] border border-white/10 bg-slate-900/80 p-5 text-white">
          <p className="text-sm text-slate-400">Hóspedes na casa</p>
          <p className="mt-2 text-3xl font-semibold">{totals.inHouse}</p>
        </article>
        <article className="rounded-[24px] border border-white/10 bg-slate-900/80 p-5 text-white">
          <p className="text-sm text-slate-400">Saídas concluídas</p>
          <p className="mt-2 text-3xl font-semibold">{totals.departuresDone}</p>
        </article>
      </section>


      <section className="grid gap-6 xl:grid-cols-[1.1fr_minmax(0,0.9fr)]">
        <article className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por hóspede, quarto ou documento"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 py-2.5 pl-9 pr-3 text-sm text-white outline-none ring-sky-300 transition focus:ring"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'Todos' },
                { value: 'reserved', label: 'Reservas' },
                { value: 'checked_in', label: 'Hospedados' },
                { value: 'checked_out', label: 'Finalizados' },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value as 'all' | StayStatus)}
                  className={[
                    'rounded-xl border px-3 py-2 text-sm transition',
                    filter === item.value
                      ? 'border-sky-300/40 bg-sky-500/10 text-sky-200'
                      : 'border-white/10 bg-slate-950/50 text-slate-300 hover:border-white/20',
                  ].join(' ')}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead className="bg-slate-950/60 text-left text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Hóspede</th>
                    <th className="px-4 py-3 font-medium">Período</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-slate-900/50">
                  {filteredStays.length ? (
                    filteredStays.map((stay) => (
                      <tr key={stay.id} className="transition-colors hover:bg-white/[0.03]">
                        <td className="px-4 py-3">
                          <p className="font-medium text-white">{stay.guestName}</p>
                          <p className="text-xs text-slate-400">
                            {stay.room} · {stay.peopleCount} pessoa(s)
                          </p>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {formatShortDate(stay.checkInDate)} - {formatShortDate(stay.checkOutDate)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${statusBadge(stay.status)}`}>
                            {statusLabel(stay.status)}
                          </span>
                          <p className="mt-1 text-xs text-slate-500">
                            In: {formatDateTime(stay.checkedInAt)} · Out: {formatDateTime(stay.checkedOutAt)}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={!canCheckInToday(stay)}
                              onClick={() => handleCheckIn(stay.id)}
                              className="inline-flex items-center gap-1 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200 disabled:cursor-not-allowed disabled:opacity-35"
                            >
                              <DoorOpen className="h-3.5 w-3.5" /> Check-in
                            </button>
                            <button
                              type="button"
                              disabled={!canCheckOutToday(stay)}
                              onClick={() => handleCheckOut(stay.id)}
                              className="inline-flex items-center gap-1 rounded-xl border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-200 disabled:cursor-not-allowed disabled:opacity-35"
                            >
                              <ClipboardCheck className="h-3.5 w-3.5" /> Check-out
                            </button>
                          </div>
                          <p className="mt-2 text-xs text-slate-500">
                            {stay.status === 'reserved'
                              ? canCheckInToday(stay)
                                ? 'Check-in liberado hoje.'
                                : `Check-in somente em ${formatShortDate(stay.checkInDate)}.`
                              : stay.status === 'checked_in'
                                ? canCheckOutToday(stay)
                                  ? 'Check-out liberado hoje.'
                                  : `Checkout permitido apenas em ${formatShortDate(stay.checkOutDate)}.`
                                : 'Reserva já finalizada.'}
                          </p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-slate-400">
                        Nenhuma hospedagem encontrada com o filtro atual.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </article>

        <article className="space-y-6">
          <form
            onSubmit={handleCreateStay}
            className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20"
          >
            <h3 className="text-xl font-semibold text-white">Nova reserva mock</h3>
            <p className="mt-1 text-sm text-slate-400">Simula uma entrada da recepção sem integração externa.</p>

            <div className="mt-4 grid gap-3">
              <input
                value={form.guestName}
                onChange={(event) => setForm((prev) => ({ ...prev, guestName: event.target.value }))}
                required
                placeholder="Nome do hóspede"
                className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none ring-sky-300 transition focus:ring"
              />
              <input
                value={form.document}
                onChange={(event) => setForm((prev) => ({ ...prev, document: event.target.value }))}
                placeholder="Documento"
                className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none ring-sky-300 transition focus:ring"
              />
              <input
                value={form.room}
                onChange={(event) => setForm((prev) => ({ ...prev, room: event.target.value }))}
                required
                placeholder="Quarto"
                className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none ring-sky-300 transition focus:ring"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={form.checkInDate}
                  onChange={(event) => setForm((prev) => ({ ...prev, checkInDate: event.target.value }))}
                  required
                  className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none ring-sky-300 transition focus:ring"
                />
                <input
                  type="date"
                  value={form.checkOutDate}
                  onChange={(event) => setForm((prev) => ({ ...prev, checkOutDate: event.target.value }))}
                  required
                  className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none ring-sky-300 transition focus:ring"
                />
              </div>
              <input
                type="number"
                min={1}
                value={form.peopleCount}
                onChange={(event) => setForm((prev) => ({ ...prev, peopleCount: event.target.value }))}
                placeholder="Quantidade de hóspedes"
                className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none ring-sky-300 transition focus:ring"
              />
              <textarea
                value={form.notes}
                onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                rows={3}
                placeholder="Observações"
                className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none ring-sky-300 transition focus:ring"
              />
            </div>

            <button
              type="submit"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-900/30"
            >
              <UserRoundPlus className="h-4 w-4" /> Criar reserva mock
            </button>
          </form>

          <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
            <h3 className="text-xl font-semibold text-white">Log de operação</h3>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              {logs.length ? (
                logs.map((log) => (
                  <p key={log} className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2">
                    {log}
                  </p>
                ))
              ) : (
                <p className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-slate-400">
                  Nenhuma ação executada ainda. Faça um check-in, checkout ou crie uma reserva.
                </p>
              )}
            </div>
          </section>
        </article>
      </section>
    </div>
  );
}
