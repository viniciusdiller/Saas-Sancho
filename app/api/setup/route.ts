// app/api/setup/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();

    // 1. Sincroniza o banco e recria as tabelas (apagando dados velhos)
    await db.sequelize.sync({ alter: true });

    // 2. Cria a Pousada Viva Mar
    const [tenant] = await db.Tenant.findOrCreate({
      where: { id: 1 },
      defaults: {
        name: "Pousada Viva Mar",
        plan: "pro",
        status: "active",
      },
    });

    // 3. Cria o Quarto
    const [room] = await db.Room.findOrCreate({
      where: { localRoomId: "vm-bangalow-01" },
      defaults: {
        localRoomId: "vm-bangalow-01",
        tenantId: tenant.id,
        name: "Bangalô Vista Mar",
        maxGuests: 4,
        status: "active",
        channexRoomTypeId: "mock-channex-id",
      },
    });

    // 4. NOVO: Cria o Usuário (Cliente que está fazendo a reserva)
    const [user] = await db.User.findOrCreate({
      where: { email: "cliente@vivamar.com" },
      defaults: {
        email: "cliente@vivamar.com",
        passwordHash: "senha-falsa-123",
        role: "customer", // O papel novo que criamos!
        tenantId: tenant.id,
      },
    });

    // 5. NOVO: Cria uma Reserva conectando o Quarto e o Usuário!
    const [reservation] = await db.Reservation.findOrCreate({
      where: { channexReservationId: "setup-teste-001" },
      defaults: {
        tenantId: tenant.id,
        roomId: room.id,
        channexReservationId: "setup-teste-001",
        otaSource: "manual",
        guestName: "Cliente de Teste",
        guestEmail: user.email,
        guestPhone: "22999999999",
        checkIn: new Date().toISOString(),
        checkOut: new Date().toISOString(),
        status: "confirmed",
        channelReference: "teste-setup",
        amount: 450.0,
        currency: "BRL",
        notes: "Testando a chave estrangeira",
        createdByUserId: user.id,
      },
    });

    // Agora mandamos o navegador mostrar TUDO!
    return NextResponse.json({
      message: "Banco configurado com sucesso! Tabelas criadas.",
      tenant,
      room,
      user,
      reservation, // Quando isso imprimir, você vai ver o createdByUserId
    });
  } catch (error: any) {
    console.error("Erro no Setup do DB:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
