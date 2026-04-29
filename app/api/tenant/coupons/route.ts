import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// LISTAR: Pega todos os cupons da Pousada Viva Mar
export async function GET() {
  try {
    const { Coupon } = getDb();
    const coupons = await Coupon.findAll({
      where: { tenantId: 1 },
      order: [["createdAt", "DESC"]],
    });
    return NextResponse.json(coupons, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// CRIAR: Adiciona um novo cupom no banco
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { Coupon } = getDb();

    // Verifica se o código já existe
    const existing = await Coupon.findOne({
      where: { tenantId: 1, code: body.code.toUpperCase() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Já existe um cupom com este código." },
        { status: 400 },
      );
    }

    const newCoupon = await Coupon.create({
      tenantId: 1,
      code: body.code.toUpperCase(),
      discountPercentage: Number(body.discountPercentage),
      usageLimit: body.usageLimit ? Number(body.usageLimit) : null,
      status: "active",
      usedCount: 0,
    });

    return NextResponse.json(newCoupon, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
