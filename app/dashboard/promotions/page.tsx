"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/components/toast-provider";
import {
  BadgePercent,
  CircleDollarSign,
  Plus,
  Power,
  PowerOff,
  Trash2,
  X,
  TrendingUp,
  Save,
} from "lucide-react";
import type { Room } from "@/types/channex";

interface Coupon {
  id: number;
  code: string;
  discountPercentage: string | number;
  status: "active" | "inactive";
  usageLimit: number | null;
  usedCount: number;
}

export default function PromotionsPage() {
  const { showToast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    limit: "",
  });

  const [editingPrices, setEditingPrices] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const invRes = await fetch("/api/tenant/inventory");
      const invData = await invRes.json();
      if (invData.rooms) setRooms(invData.rooms);

      const coupRes = await fetch("/api/tenant/coupons");
      const coupData = await coupRes.json();
      setCoupons(coupData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  // ===================== LÓGICA DE PREÇOS =====================
  const handlePriceChange = (roomId: string, value: string) => {
    setEditingPrices((prev) => ({ ...prev, [roomId]: value }));
  };

  const saveRoomPrice = async (roomId: string) => {
    const newPrice = editingPrices[roomId];
    if (!newPrice) return;

    try {
      const res = await fetch(`/api/tenant/rooms/${roomId}/price`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: parseFloat(newPrice) }),
      });

      if (res.ok) {
        showToast("Preço atualizado com sucesso!");
        fetchData();
        setEditingPrices((prev) => {
          const newState = { ...prev };
          delete newState[roomId];
          return newState;
        });
      }
    } catch (error) {
      showToast("Erro ao atualizar preço da acomodação.");
    }
  };

  // ===================== LÓGICA DE CUPONS =====================
  const handleCreateCoupon = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discount) {
      showToast("Preencha o código e o percentual de desconto.");
      return;
    }

    try {
      const res = await fetch("/api/tenant/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newCoupon.code,
          discountPercentage: newCoupon.discount,
          usageLimit: newCoupon.limit ? parseInt(newCoupon.limit) : null,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewCoupon({ code: "", discount: "", limit: "" });
        fetchData();
        showToast("Cupom criado com sucesso!");
      } else {
        const errorData = await res.json();
        showToast(`Erro: ${errorData.error}`);
      }
    } catch (error) {
      showToast("Erro de conexão ao criar cupom.");
    }
  };

  const toggleCouponStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await fetch(`/api/tenant/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchData();
      showToast(
        newStatus === "active" ? "Cupom ativado!" : "Cupom desativado.",
      );
    } catch (error) {
      showToast("Erro ao alterar status do cupom.");
    }
  };

  const deleteCoupon = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir permanentemente este cupom?"))
      return;

    try {
      await fetch(`/api/tenant/coupons/${id}`, { method: "DELETE" });
      fetchData();
      showToast("Cupom excluído com sucesso.");
    } catch (error) {
      showToast("Erro ao excluir cupom.");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-white font-medium">
        Carregando estratégia de vendas...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <section className="rounded-[30px] border border-white/10 bg-slate-900/85 p-6 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
              Revenue Management
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Tarifas & Promoções
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              Controle os valores base das suas acomodações e crie campanhas de
              desconto (cupons) para impulsionar reservas diretas.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-4">
            <TrendingUp className="h-6 w-6 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                Cupons Ativos
              </p>
              <p className="text-xl font-bold text-white">
                {coupons.filter((c) => c.status === "active").length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DUAS COLUNAS */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* COLUNA 1: PREÇOS DOS QUARTOS */}
        <section className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl border border-white/10 bg-slate-950/50 p-2">
              <CircleDollarSign className="h-5 w-5 text-sky-300" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              Tabela de Preços Base
            </h3>
          </div>

          <div className="space-y-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 transition-all hover:border-white/20"
              >
                <div>
                  <p className="font-semibold text-slate-200">{room.name}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                    Preço Atual: R$ {Number(room.price).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm font-medium">R$</span>
                  <input
                    type="number"
                    placeholder={String(room.price)}
                    value={
                      editingPrices[room.id] !== undefined
                        ? editingPrices[room.id]
                        : ""
                    }
                    onChange={(e) => handlePriceChange(room.id, e.target.value)}
                    className="w-24 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
                  />
                  {editingPrices[room.id] !== undefined &&
                    editingPrices[room.id] !== "" && (
                      <button
                        onClick={() => saveRoomPrice(room.id)}
                        className="rounded-xl bg-emerald-500/20 p-2 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                        title="Salvar Novo Preço"
                      >
                        <Save className="h-5 w-5" />
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COLUNA 2: CUPONS DE DESCONTO */}
        <section className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-white/10 bg-slate-950/50 p-2">
                <BadgePercent className="h-5 w-5 text-violet-300" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Cupons de Desconto
              </h3>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              <Plus className="h-4 w-4" /> Novo
            </button>
          </div>

          <div className="space-y-4">
            {coupons.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6 border border-dashed border-white/10 rounded-2xl">
                Nenhum cupom criado ainda.
              </p>
            ) : (
              coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 transition-all hover:border-white/20"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg font-bold text-white bg-slate-900 px-2 py-1 rounded-md border border-white/5">
                        {coupon.code}
                      </span>
                      <span
                        className={
                          coupon.status === "active"
                            ? "text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20"
                            : "text-xs font-semibold text-slate-500 bg-slate-800 px-2 py-1 rounded-full"
                        }
                      >
                        {coupon.status === "active" ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">
                      <strong className="text-violet-300">
                        {Number(coupon.discountPercentage)}% OFF
                      </strong>{" "}
                      • Usos: {coupon.usedCount}{" "}
                      {coupon.usageLimit
                        ? `/ ${coupon.usageLimit}`
                        : "(Ilimitado)"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        toggleCouponStatus(coupon.id, coupon.status)
                      }
                      className={`rounded-xl border border-white/10 p-2 transition ${coupon.status === "active" ? "bg-slate-900 text-amber-400 hover:bg-amber-400/10" : "bg-slate-900 text-emerald-400 hover:bg-emerald-400/10"}`}
                      title={
                        coupon.status === "active" ? "Desativar" : "Ativar"
                      }
                    >
                      {coupon.status === "active" ? (
                        <PowerOff className="h-4 w-4" />
                      ) : (
                        <Power className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteCoupon(coupon.id)}
                      className="rounded-xl border border-white/10 bg-slate-900 p-2 text-rose-400 transition hover:bg-rose-400/10"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* MODAL DE NOVO CUPOM */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              className="w-full max-w-md rounded-[30px] border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-slate-950/40"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    Criar Cupom
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Gere um novo código promocional.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white bg-slate-950/50 p-2 rounded-xl"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-200">
                    Código do Cupom
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Ex: VERAO2026"
                    value={newCoupon.code}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white uppercase outline-none focus:border-violet-500"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-200">
                      Desconto (%)
                    </span>
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      placeholder="Ex: 15"
                      value={newCoupon.discount}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, discount: e.target.value })
                      }
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-slate-200">
                      Limite de Uso
                    </span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Vazio = Sem limite"
                      value={newCoupon.limit}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, limit: e.target.value })
                      }
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                    />
                  </label>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="rounded-2xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 hover:bg-violet-500 transition"
                  >
                    Salvar Cupom
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
