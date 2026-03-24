import { NextResponse } from 'next/server';
import { getAuthenticatedSession } from '@/lib/auth';
import { createExpense, getExpenses, getReservations } from '@/services/tenantService';
import type { Expense } from '@/types/channex';

export async function GET() {
  try {
    const session = await getAuthenticatedSession();

    if (!session) {
      return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });
    }

    const [reservations, expenses] = await Promise.all([
      getReservations(session.tenantId),
      getExpenses(session.tenantId),
    ]);

    return NextResponse.json({ reservations, expenses });
  } catch (error) {
    return NextResponse.json(
      { message: 'Falha ao carregar financeiro.', detail: error instanceof Error ? error.message : 'Erro desconhecido.' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthenticatedSession();

    if (!session) {
      return NextResponse.json({ message: 'Não autenticado.' }, { status: 401 });
    }

    const body = (await request.json()) as { expense?: Omit<Expense, 'id'> };

    if (!body.expense) {
      return NextResponse.json({ message: 'Despesa inválida.' }, { status: 400 });
    }

    const expense = await createExpense(session.tenantId, body.expense);
    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Falha ao salvar despesa.', detail: error instanceof Error ? error.message : 'Erro desconhecido.' },
      { status: 500 },
    );
  }
}
