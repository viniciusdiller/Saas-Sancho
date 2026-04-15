import { NextResponse } from "next/server";
import { updateRoomPrice } from "@/services/tenantService";
// import { getAuthenticatedSession } from '@/lib/auth'; // Descomente quando ativar o login do SaaS

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const session = await getAuthenticatedSession();
    // const tenantId = session.tenantId;

    const tenantId = 1;

    const localRoomId = params.id;
    const body = await request.json();

    if (body.price === undefined || body.price < 0) {
      return NextResponse.json({ error: "Preço inválido" }, { status: 400 });
    }

    const updatedRoom = await updateRoomPrice(
      tenantId,
      localRoomId,
      Number(body.price),
    );

    return NextResponse.json(updatedRoom, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao atualizar preço do quarto:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
