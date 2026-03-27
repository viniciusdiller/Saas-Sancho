'use client';

import { useMemo, useState } from 'react';
import { BadgeCheck, BriefcaseBusiness, Clock3, Plus, UsersRound } from 'lucide-react';

import { INITIAL_TEAM_MOCK } from '@/mocks/dashboard';

type TeamRole = 'Recepção' | 'Limpeza' | 'Manutenção' | 'Gestão';
type EmploymentStatus = 'ativo' | 'inativo';
type ShiftStatus = 'fora' | 'em_turno';

type TeamMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: TeamRole;
  shift: 'Manhã' | 'Tarde' | 'Noite';
  employmentStatus: EmploymentStatus;
  shiftStatus: ShiftStatus;
  tasksToday: number;
  finishedTasks: number;
  lastPunch?: string;
};

const INITIAL_TEAM: TeamMember[] = INITIAL_TEAM_MOCK.map((member) => ({ ...member }));


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

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'Todos' | TeamRole>('Todos');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Recepção' as TeamRole,
    shift: 'Manhã' as TeamMember['shift'],
  });

  const filteredTeam = useMemo(() => {
    return team.filter((member) => {
      const matchesRole = roleFilter === 'Todos' ? true : member.role === roleFilter;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        term.length === 0 ||
        member.name.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.phone.toLowerCase().includes(term);

      return matchesRole && matchesSearch;
    });
  }, [roleFilter, search, team]);

  const summary = useMemo(() => {
    const active = team.filter((member) => member.employmentStatus === 'ativo').length;
    const onShift = team.filter((member) => member.shiftStatus === 'em_turno').length;
    const totalTasks = team.reduce((sum, member) => sum + member.tasksToday, 0);

    return { active, onShift, totalTasks };
  }, [team]);

  function addMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name || !form.email) {
      return;
    }

    const member: TeamMember = {
      id: globalThis.crypto?.randomUUID?.() ?? `tm-${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone || 'Não informado',
      role: form.role,
      shift: form.shift,
      employmentStatus: 'ativo',
      shiftStatus: 'fora',
      tasksToday: 0,
      finishedTasks: 0,
    };

    setTeam((prev) => [member, ...prev]);
    setForm({
      name: '',
      email: '',
      phone: '',
      role: 'Recepção',
      shift: 'Manhã',
    });
  }

  function toggleEmploymentStatus(memberId: string) {
    setTeam((prev) =>
      prev.map((member) => {
        if (member.id !== memberId) {
          return member;
        }

        if (member.employmentStatus === 'ativo') {
          return { ...member, employmentStatus: 'inativo', shiftStatus: 'fora' };
        }

        return { ...member, employmentStatus: 'ativo' };
      }),
    );
  }

  function toggleShift(memberId: string) {
    setTeam((prev) =>
      prev.map((member) => {
        if (member.id !== memberId || member.employmentStatus !== 'ativo') {
          return member;
        }

        if (member.shiftStatus === 'fora') {
          return { ...member, shiftStatus: 'em_turno', lastPunch: new Date().toISOString() };
        }

        return { ...member, shiftStatus: 'fora', lastPunch: new Date().toISOString() };
      }),
    );
  }

  function randomizeTaskProgress(memberId: string) {
    setTeam((prev) =>
      prev.map((member) => {
        if (member.id !== memberId || member.employmentStatus !== 'ativo') {
          return member;
        }

        const tasksToday = Math.max(member.tasksToday, 1);
        const increment = Math.floor(Math.random() * 2) + 1;
        const finishedTasks = Math.min(tasksToday, member.finishedTasks + increment);

        return { ...member, tasksToday, finishedTasks };
      }),
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">Operação interna</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Gerenciamento de Equipe com dados mockados</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          Controle total sem banco: cadastro de colaboradores, ativação/inativação, batida de turno e evolução de tarefas em tempo real.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-[24px] border border-white/10 bg-slate-900/80 p-5 text-white">
          <p className="text-sm text-slate-400">Colaboradores ativos</p>
          <p className="mt-2 text-3xl font-semibold">{summary.active}</p>
        </article>
        <article className="rounded-[24px] border border-white/10 bg-slate-900/80 p-5 text-white">
          <p className="text-sm text-slate-400">Em turno agora</p>
          <p className="mt-2 text-3xl font-semibold">{summary.onShift}</p>
        </article>
        <article className="rounded-[24px] border border-white/10 bg-slate-900/80 p-5 text-white">
          <p className="text-sm text-slate-400">Tarefas planejadas hoje</p>
          <p className="mt-2 text-3xl font-semibold">{summary.totalTasks}</p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_minmax(0,0.9fr)]">
        <article className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome, e-mail ou telefone"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none ring-sky-300 transition focus:ring md:max-w-sm"
            />
            <div className="flex flex-wrap gap-2">
              {(['Todos', 'Recepção', 'Limpeza', 'Manutenção', 'Gestão'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setRoleFilter(role)}
                  className={[
                    'rounded-xl border px-3 py-2 text-sm transition',
                    roleFilter === role
                      ? 'border-sky-300/40 bg-sky-500/10 text-sky-200'
                      : 'border-white/10 bg-slate-950/50 text-slate-300 hover:border-white/20',
                  ].join(' ')}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {filteredTeam.map((member) => (
              <div key={member.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-base font-semibold text-white">{member.name}</p>
                    <p className="text-sm text-slate-400">
                      {member.role} · Turno {member.shift}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{member.email}</p>
                    <p className="text-xs text-slate-500">{member.phone}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span
                      className={[
                        'rounded-full border px-2.5 py-1',
                        member.employmentStatus === 'ativo'
                          ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300'
                          : 'border-slate-500/40 bg-slate-700/30 text-slate-300',
                      ].join(' ')}
                    >
                      {member.employmentStatus === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                    <span
                      className={[
                        'rounded-full border px-2.5 py-1',
                        member.shiftStatus === 'em_turno'
                          ? 'border-sky-400/30 bg-sky-500/10 text-sky-200'
                          : 'border-slate-500/40 bg-slate-700/30 text-slate-300',
                      ].join(' ')}
                    >
                      {member.shiftStatus === 'em_turno' ? 'Em turno' : 'Fora de turno'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <BriefcaseBusiness className="h-3.5 w-3.5 text-sky-300" />
                    {member.finishedTasks}/{member.tasksToday} tarefas concluídas
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5 text-emerald-300" />
                    Última batida: {formatDateTime(member.lastPunch)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleShift(member.id)}
                    disabled={member.employmentStatus !== 'ativo'}
                    className="rounded-xl border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-200 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    {member.shiftStatus === 'fora' ? 'Iniciar turno' : 'Encerrar turno'}
                  </button>
                  <button
                    type="button"
                    onClick={() => randomizeTaskProgress(member.id)}
                    disabled={member.employmentStatus !== 'ativo'}
                    className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Avançar tarefas
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleEmploymentStatus(member.id)}
                    className="rounded-xl border border-white/15 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200"
                  >
                    {member.employmentStatus === 'ativo' ? 'Inativar colaborador' : 'Reativar colaborador'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="space-y-6">
          <form
            onSubmit={addMember}
            className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20"
          >
            <h3 className="text-xl font-semibold text-white">Novo colaborador (mock)</h3>
            <p className="mt-1 text-sm text-slate-400">Cadastro local para simular o time operacional da pousada.</p>

            <div className="mt-4 grid gap-3">
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
                placeholder="Nome completo"
                className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none ring-sky-300 transition focus:ring"
              />
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
                placeholder="E-mail"
                className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none ring-sky-300 transition focus:ring"
              />
              <input
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="Telefone"
                className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none ring-sky-300 transition focus:ring"
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.role}
                  onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as TeamRole }))}
                  className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none ring-sky-300 transition focus:ring"
                >
                  <option value="Recepção">Recepção</option>
                  <option value="Limpeza">Limpeza</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Gestão">Gestão</option>
                </select>
                <select
                  value={form.shift}
                  onChange={(event) => setForm((prev) => ({ ...prev, shift: event.target.value as TeamMember['shift'] }))}
                  className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none ring-sky-300 transition focus:ring"
                >
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-900/30"
            >
              <Plus className="h-4 w-4" /> Adicionar colaborador
            </button>
          </form>

          <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
            <h3 className="text-xl font-semibold text-white">Checklist do turno</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2">
                <BadgeCheck className="mr-2 inline h-4 w-4 text-emerald-300" />
                Validar abertura da recepção e kit de boas-vindas.
              </p>
              <p className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2">
                <UsersRound className="mr-2 inline h-4 w-4 text-sky-300" />
                Distribuir quartos para limpeza antes das 10h.
              </p>
              <p className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2">
                <BriefcaseBusiness className="mr-2 inline h-4 w-4 text-sky-300" />
                Revisar chamados de manutenção pendentes.
              </p>
            </div>
          </section>
        </article>
      </section>
    </div>
  );
}
