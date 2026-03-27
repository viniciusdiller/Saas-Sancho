# Pousada Viva Mar - SaaS de Demonstração

## Estrutura sugerida

```text
app/
  api/auth/
    login/route.ts
    logout/route.ts
  dashboard/
    calendar/page.tsx
    layout.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  calendar-skeleton.tsx
  login-form.tsx
  toast-provider.tsx
  unified-calendar.tsx
lib/
  auth.ts
  utils.ts
models/
  Reservation.ts
  Room.ts
  User.ts
  index.ts
services/
  tenantService.ts
  demoData.ts
types/
  channex.ts
middleware.ts
```

## Observações arquiteturais

- A UI lê quartos e reservas via `services/tenantService.ts`, com fallback para dados mock de demonstração em `services/demoData.ts`.
- Os modelos Sequelize estão prontos para MySQL hospedado e preparados para futura integração com Channex.io.
- A autenticação atual é de demonstração, baseada em cookie HttpOnly, para viabilizar o fluxo do MVP.


## Prontidão para integração Channex

- Matriz de aderência das ações do PMS em `docs/channex-readiness.md`.
- Endpoint autenticado de diagnóstico: `GET /api/tenant/channex/readiness`.
- Recomendação arquitetural: separar operações operacionais (check-in/check-out/governança) da sincronização de distribuição (ARI/bookings).



## Fetch real da Channex com fallback para mock

- Cliente HTTP centralizado em `lib/channex.ts` com header `user-api-key`, tratamento de `data/meta/errors`, paginação e filtros.
- Integração de leitura em `services/channex/api.ts` (bookings + room types) com mapeamento para os tipos internos.
- `services/tenantService.ts` agora tenta ler dados reais da Channex quando `CHANNEX_API_KEY` e `CHANNEX_PROPERTY_ID` estiverem definidos; caso contrário mantém banco/mock.
- Mock data centralizado na pasta `mocks/` (`mocks/demoData.ts` e `mocks/dashboard.ts`).



## Rate limit + propriedades (Channex)

- `lib/channex.ts` agora aplica proteção local para ARI por propriedade (até 10/min para `availability` e 10/min para `restrictions/rates`) e retry com exponential backoff ao receber `429`.
- Em caso de `429`, a propriedade entra em pausa temporária (padrão: 60s), evitando flood de requests.
- Fila assíncrona de ARI em `services/channex/queue.ts` com flush padrão de 6s para batch/spacing.
- Coleção de propriedades implementada em `services/channex/properties.ts` e exposta via `GET /api/tenant/channex/properties` (com `mode=options`).



## Novas coleções Channex integradas

- `property_users`: list, invite, get by id, update e delete (`/api/tenant/channex/property-users`).
- `groups`: list, get by id, create, update, delete, associar/remover propriedade (`/api/tenant/channex/groups`).
- `group_users`: list, invite, get by id, update e delete (`/api/tenant/channex/group-users`).
- `room_types`: list + filtro por propriedade, options, get by id, create, update e delete com `force` (`/api/tenant/channex/room-types`).
- `rate_plans`: list, options por propriedade, get by id, create, update e delete com `force` (`/api/tenant/channex/rate-plans`).
- `bookings` + `booking_revisions`: list/get, CRS create/update, reporting (`no_show`, `invalid_card`, `cancel_due_invalid_card`) e ack de revisões (`/api/tenant/channex/bookings`, `/api/tenant/channex/booking-revisions`).
- `channels`: list/get/create/update/delete + settings/mappings (`/api/tenant/channex/channels`).
- `photos`: list/get/create/update/delete + upload multipart (`/api/tenant/channex/photos`, `/api/tenant/channex/photos/upload`).
- `hotel_policies`: list/get/create/update/delete (`/api/tenant/channex/hotel-policies`).
- `facilities`: property/room list e options (`/api/tenant/channex/facilities/property`, `/api/tenant/channex/facilities/room`).



## ARI + Webhooks integrados

- ARI implementado em `services/channex/ari.ts` com endpoints para consultar e atualizar `restrictions` e `availability`.
- Rotas prontas:
  - `GET/POST /api/tenant/channex/ari/restrictions`
  - `GET/POST /api/tenant/channex/ari/availability`
- Atualizações ARI passam pela fila por propriedade (`services/channex/queue.ts`) para respeitar limites e reduzir risco de `429`.
- Webhooks implementado em `services/channex/webhooks.ts` com list/get/create/update/delete/test.
- Rotas prontas:
  - `GET/POST /api/tenant/channex/webhooks`
  - `GET/PUT/DELETE /api/tenant/channex/webhooks/:id`
  - `POST /api/tenant/channex/webhooks/test`

