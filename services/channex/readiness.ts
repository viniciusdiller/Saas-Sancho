export type LocalPmsAction =
  | 'create_manual_reservation'
  | 'create_maintenance_block'
  | 'edit_reservation_dates'
  | 'cancel_reservation'
  | 'change_room_assignment'
  | 'check_in'
  | 'check_out'
  | 'mark_no_show'
  | 'change_housekeeping_status';

export type ChannexSupport = 'supported' | 'partially_supported' | 'not_supported';

export type ActionReadiness = {
  action: LocalPmsAction;
  support: ChannexSupport;
  reason: string;
  recommendedFlow: string;
  channexEndpoints: string[];
};

export const CHANNEX_READINESS_MATRIX: ActionReadiness[] = [
  {
    action: 'create_manual_reservation',
    support: 'supported',
    reason: 'A reserva pode ser criada e mantida no PMS próprio, com sincronização de ARI no Channex.',
    recommendedFlow: 'Criar reserva localmente e reduzir disponibilidade/preço via ARI no room type/rate plan correspondente.',
    channexEndpoints: ['/api/v1/availability', '/api/v1/restrictions', '/api/v1/rates'],
  },
  {
    action: 'create_maintenance_block',
    support: 'supported',
    reason: 'Bloqueios operacionais são modelados como ajustes de disponibilidade/restrição.',
    recommendedFlow: 'Criar bloqueio local e propagar fechamento de inventário em ARI para o período.',
    channexEndpoints: ['/api/v1/availability', '/api/v1/restrictions'],
  },
  {
    action: 'edit_reservation_dates',
    support: 'partially_supported',
    reason: 'Alterações de reservas OTA devem respeitar origem e políticas do canal; normalmente chegam por feed.',
    recommendedFlow: 'Para reservas OTA, consumir booking feed/revisions; para manual, editar local + recalcular ARI.',
    channexEndpoints: ['/api/v1/bookings', '/api/v1/booking_revisions/feed', '/api/v1/booking_revisions/:id/ack'],
  },
  {
    action: 'cancel_reservation',
    support: 'partially_supported',
    reason: 'Cancelamento total depende de origem da reserva. Há ações de exceção (cartão inválido) e no-show.',
    recommendedFlow: 'Implementar cancelamento local e usar operações específicas de bookings quando permitido pelo canal.',
    channexEndpoints: [
      '/api/v1/bookings/:booking_id/no_show',
      '/api/v1/bookings/:booking_id/invalid_card',
      '/api/v1/bookings/:booking_id/cancel_due_invalid_card',
    ],
  },
  {
    action: 'change_room_assignment',
    support: 'partially_supported',
    reason: 'Mudança de quarto existe no PMS, mas requer coerência com room type/rate plan e inventário.',
    recommendedFlow: 'Fazer mudança local, registrar auditoria e atualizar disponibilidade dos room types afetados.',
    channexEndpoints: ['/api/v1/bookings', '/api/v1/availability'],
  },
  {
    action: 'check_in',
    support: 'not_supported',
    reason: 'Check-in é processo operacional de front desk e não evento nativo da API de distribuição.',
    recommendedFlow: 'Manter check-in no domínio interno do PMS e usar Channex apenas para distribuição/estado comercial.',
    channexEndpoints: [],
  },
  {
    action: 'check_out',
    support: 'not_supported',
    reason: 'Check-out também é processo operacional local e não endpoint nativo em Channex.',
    recommendedFlow: 'Persistir checkout internamente e desacoplar da camada de distribuição.',
    channexEndpoints: [],
  },
  {
    action: 'mark_no_show',
    support: 'supported',
    reason: 'Existe endpoint dedicado para reportar no-show na reserva.',
    recommendedFlow: 'Permitir ação de no-show com envio do payload de penalidade quando aplicável.',
    channexEndpoints: ['/api/v1/bookings/:booking_id/no_show'],
  },
  {
    action: 'change_housekeeping_status',
    support: 'not_supported',
    reason: 'Status como limpo/sujo/manutenção operacional não fazem parte da API de channel manager.',
    recommendedFlow: 'Gerenciar housekeeping no próprio PMS, sem tentar espelhar isso na API Channex.',
    channexEndpoints: [],
  },
];

export function getReadinessSummary() {
  const totals = CHANNEX_READINESS_MATRIX.reduce(
    (acc, item) => {
      acc[item.support] += 1;
      return acc;
    },
    {
      supported: 0,
      partially_supported: 0,
      not_supported: 0,
    } as Record<ChannexSupport, number>,
  );

  return {
    totals,
    matrix: CHANNEX_READINESS_MATRIX,
    generatedAt: new Date().toISOString(),
  };
}
