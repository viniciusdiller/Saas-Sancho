// app/api/public/viva-mar/route.ts
import { NextResponse } from "next/server";
import { getRooms } from "@/services/tenantService";

// Pode remover o OPTIONS manual daqui já que colocamos no next.config.ts

export async function GET() {
  const VIVA_MAR_TENANT_ID = 1;
  try {
    const rooms = await getRooms(VIVA_MAR_TENANT_ID);
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar quartos" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  // Vamos apenas imprimir no terminal do SaaS que os dados chegaram da Landing Page!
  console.log("=========================================");
  console.log("RESERVA RECEBIDA DA LANDING PAGE!");
  console.log("Quarto ID:", body.roomId);
  console.log("Hóspede:", body.guestName);
  console.log("Check In:", body.checkIn);
  console.log("Check Out:", body.checkOut);
  console.log("Valor R$:", body.amount);
  console.log("=========================================");

  // Retorna sucesso "fictício" para a LP não dar erro
  return NextResponse.json(
    { message: "Reserva simulada com sucesso recebida pelo SaaS!" },
    { status: 201 },
  );
}
