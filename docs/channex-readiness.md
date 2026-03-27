# Channex Readiness (Pousada PMS)

Este documento consolida as ações do PMS atual e como cada ação se comporta ao integrar com Channex.

## Resultado rápido

- **Suportadas diretamente**: criação de reserva manual (via estratégia ARI), bloqueio operacional, no-show.
- **Parcialmente suportadas**: editar datas de reserva OTA, cancelamento, troca de quarto.
- **Não suportadas na API Channex (devem ficar internas)**: check-in, check-out, status de governança (limpeza/manutenção operacional).

## Matriz de ações

| Ação do PMS | Suporte em Channex | Estratégia recomendada |
|---|---|---|
| Criar reserva manual | Suportado | Criar no PMS e sincronizar inventário/tarifa/restrição via ARI |
| Criar bloqueio de manutenção | Suportado | Converter bloqueio em fechamento/restrição de disponibilidade |
| Editar datas da reserva | Parcial | OTA via booking feed/revisions; manual via PMS + ARI |
| Cancelar reserva | Parcial | Cancelar internamente e usar operações específicas permitidas por canal |
| Alterar quarto da reserva | Parcial | Troca no PMS com ajuste de inventário dos room types envolvidos |
| Check-in | Não suportado | Manter 100% no PMS |
| Check-out | Não suportado | Manter 100% no PMS |
| Marcar no-show | Suportado | Usar endpoint dedicado de no-show |
| Alterar status de governança (vaga/limpeza/ocupado/manutenção) | Não suportado | Manter 100% no PMS |

## Gaps críticos para evitar dor na integração

1. **Separar domínio operacional vs. distribuição**  
   Check-in/check-out/governança não devem depender de sucesso na API de distribuição.

2. **Persistir trilha de sincronização (outbox)**  
   Toda ação que impacta disponibilidade/comercial deve gerar evento interno para sincronização assíncrona com retry.

3. **Idempotência por operação**  
   Cada envio para Channex deve ter chave idempotente local (`tenant + action + external_id + version`).

4. **Estados de reserva por origem**  
   Reservas OTA e manuais precisam regras diferentes (quem é dono da verdade para alteração/cancelamento).

5. **Regras de fallback**  
   Se Channex falhar temporariamente, manter operação local e enfileirar reenvio sem travar recepção.

## Endpoints de referência considerados

- `/api/v1/bookings`
- `/api/v1/booking_revisions/feed`
- `/api/v1/booking_revisions/:id/ack`
- `/api/v1/bookings/:booking_id/no_show`
- `/api/v1/bookings/:booking_id/invalid_card`
- `/api/v1/bookings/:booking_id/cancel_due_invalid_card`
- `/api/v1/availability`
- `/api/v1/restrictions`
- `/api/v1/rates`

> Observação: este documento é o baseline arquitetural para integração; os detalhes finais de payload e permissões devem ser validados na conta/sandbox da pousada antes do go-live.
