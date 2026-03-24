import { Landmark } from 'lucide-react';
import { getAuthenticatedSession } from '@/lib/auth';
import { getExpenses, getReservations } from '@/services/tenantService';

function formatCurrency(value: number, currency = 'BRL') {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatLongDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

export default async function FinancePage() {
  const session = await getAuthenticatedSession();

  if (!session) {
    return null;
  }

  if (session.plan === 'basic') {
    return (
      <section className="glass-panel rounded-[28px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/20">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">Plano atual: Basic</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Módulo Financeiro indisponível</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          O módulo Financeiro exige o plano Pro para liberar KPIs, despesas e margem líquida da operação.
        </p>
        <button className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-950/30">
          Fazer Upgrade
        </button>
      </section>
    );
  }

  const [reservations, expenses] = await Promise.all([getReservations(session.tenantId), getExpenses(session.tenantId)]);
  const grossRevenue = reservations
    .filter((reservation) => reservation.status !== 'cancelled' && reservation.status !== 'blocked')
    .reduce((total, reservation) => total + reservation.amount, 0);
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const netProfit = grossRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">Aba financeira</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Saúde financeira da operação</h2>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 text-white">Faturamento Bruto: {formatCurrency(grossRevenue)}</div>
        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 text-white">Total de Despesas: {formatCurrency(totalExpenses)}</div>
        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 text-white">Lucro Líquido: {formatCurrency(netProfit)}</div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
        <h3 className="text-2xl font-semibold text-white">Custos registrados</h3>
        <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <thead className="bg-slate-950/60 text-left text-slate-400">
                <tr>
                  <th className="px-5 py-4 font-medium">Descrição</th>
                  <th className="px-5 py-4 font-medium">Categoria</th>
                  <th className="px-5 py-4 font-medium">Data</th>
                  <th className="px-5 py-4 text-right font-medium">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-slate-900/50">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="transition-colors hover:bg-white/[0.03]">
                    <td className="px-5 py-4 text-white">{expense.description}</td>
                    <td className="px-5 py-4 text-slate-300">{expense.category}</td>
                    <td className="px-5 py-4 text-slate-300">{formatLongDate(expense.date)}</td>
                    <td className="px-5 py-4 text-right font-semibold text-rose-300">{formatCurrency(expense.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-400">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/50 px-3 py-2">
            <Landmark className="h-4 w-4 text-sky-300" />
            Receita baseada no campo <span className="font-medium text-slate-200">amount</span> das reservas.
          </div>
        </div>
      </section>
    </div>
  );
}
