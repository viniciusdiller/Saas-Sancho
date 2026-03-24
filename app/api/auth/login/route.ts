import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { createSessionToken, authConfig } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return NextResponse.json({ message: 'Informe e-mail e senha.' }, { status: 400 });
    }

    const { User, Tenant } = getDb();

    const user = await User.findOne({
      where: { email: body.email },
      include: [{ model: Tenant, as: 'tenant' }],
    });

    if (!user) {
      return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 });
    }

    const tenant = user.get('tenant') as InstanceType<typeof Tenant> | undefined;

    if (!tenant || tenant.status !== 'active') {
      return NextResponse.json({ message: 'Conta inativa ou inexistente.' }, { status: 403 });
    }

    const isValid = await bcrypt.compare(body.password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json({ message: 'Credenciais inválidas.' }, { status: 401 });
    }

    const token = await createSessionToken({
      userId: user.id,
      tenantId: tenant.id,
      plan: tenant.plan,
      tenantName: tenant.name,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(authConfig.cookieName, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: authConfig.tokenTtlSeconds,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Falha ao autenticar.', detail: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 },
    );
  }
}
