import type { ChannexBookingPayload } from '@/types/channex';

export const CREATE_BOOKING_EXAMPLE: ChannexBookingPayload = {
  booking: {
    property_id: '716305c4-561a-4561-a187-7f5b8aeb5920',
    arrival_date: '2026-03-30',
    departure_date: '2026-04-04',
    status: 'new',
    currency: 'BRL',
    amount: '2870.00',
    notes: 'Reserva manual - Saas-Sancho',
    customer: {
      name: 'Paulo',
      surname: 'Menezes',
      email: 'paulo@cliente.com',
      phone: '+5585955554455',
    },
    rooms: [
      {
        checkin_date: '2026-03-30',
        checkout_date: '2026-04-04',
        room_type_id: 'vm-rt-01',
        rate_plan_id: 'vm-rateplan-std-01',
        amount: '2870.00',
        occupancy: { adults: 2, children: 0, infants: 0 },
      },
    ],
  },
};

export const UPDATE_ROOM_TYPE_EXAMPLE = {
  room_type: {
    name: 'Bangalô Oceano Premium',
    max_occupancy: {
      adults: 2,
      children: 1,
    },
    status: 'active',
  },
};

export const CREATE_PROPERTY_EXAMPLE = {
  property: {
    title: 'Demo Hotel',
    currency: 'BRL',
    email: 'hotel@channex.io',
    phone: '5581999999999',
    zip_code: '52000-000',
    country: 'BR',
    state: 'Pernambuco',
    city: 'Recife',
    address: 'Rua Demo, 100',
    timezone: 'America/Recife',
    property_type: 'hotel',
    facilities: [],
    settings: {
      allow_availability_autoupdate_on_confirmation: true,
      allow_availability_autoupdate_on_modification: false,
      allow_availability_autoupdate_on_cancellation: false,
      min_stay_type: 'both',
      state_length: 500,
      cut_off_time: '00:00:00',
      cut_off_days: 0,
    },
  },
};

export const INVITE_PROPERTY_USER_EXAMPLE = {
  invite: {
    property_id: '52397a6e-c330-44f4-a293-47042d3a3607',
    user_email: 'other_user@channex.io',
    role: 'user',
    overrides: {},
  },
};

export const CREATE_GROUP_EXAMPLE = {
  group: {
    title: 'South London Group',
  },
};

export const INVITE_GROUP_USER_EXAMPLE = {
  invite: {
    group_id: '52397a6e-c330-44f4-a293-47042d3a3607',
    user_email: 'other_user@channex.io',
    role: 'user',
    overrides: {},
  },
};

export const CREATE_ROOM_TYPE_EXAMPLE = {
  room_type: {
    property_id: '716305c4-561a-4561-a187-7f5b8aeb5920',
    title: 'Standard Room',
    count_of_rooms: 20,
    occ_adults: 3,
    occ_children: 0,
    occ_infants: 0,
    default_occupancy: 2,
    room_kind: 'room',
    facilities: [],
  },
};

export const CREATE_RATE_PLAN_EXAMPLE = {
  rate_plan: {
    title: 'Best Available Rate',
    property_id: '716305c4-561a-4561-a187-7f5b8aeb5920',
    room_type_id: '994d1375-dbbd-4072-8724-b2ab32ce781b',
    options: [
      {
        occupancy: 3,
        is_primary: true,
        rate: 0,
      },
    ],
    sell_mode: 'per_room',
    rate_mode: 'manual',
  },
};

export const GET_RESTRICTIONS_QUERY_EXAMPLE =
  '/restrictions?filter[property_id]=716305c4-561a-4561-a187-7f5b8aeb5920&filter[date][gte]=2026-03-01&filter[date][lte]=2026-03-10&filter[restrictions]=rate,min_stay_arrival';

export const UPDATE_RESTRICTIONS_EXAMPLE = {
  values: [
    {
      property_id: '716305c4-561a-4561-a187-7f5b8aeb5920',
      rate_plan_id: 'bab451e7-9ab1-4cc4-aa16-107bf7bbabb2',
      date_from: '2026-04-01',
      date_to: '2026-04-30',
      days: ['fr', 'sa', 'su'],
      rate: 35000,
      min_stay_through: 2,
      closed_to_arrival: false,
      closed_to_departure: false,
    },
  ],
};

export const UPDATE_AVAILABILITY_EXAMPLE = {
  values: [
    {
      property_id: '716305c4-561a-4561-a187-7f5b8aeb5920',
      room_type_id: '994d1375-dbbd-4072-8724-b2ab32ce781b',
      date_from: '2026-04-01',
      date_to: '2026-04-30',
      availability: 5,
    },
  ],
};

export const CREATE_WEBHOOK_EXAMPLE = {
  webhook: {
    callback_url: 'https://pousada.exemplo.com/hooks/channex',
    event_mask: 'booking',
    property_id: '716305c4-561a-4561-a187-7f5b8aeb5920',
    headers: {
      'x-signature': 'secret-demo',
    },
    is_active: true,
    send_data: true,
  },
};

export const CREATE_CHANNEL_EXAMPLE = {
  channel: {
    property_id: '716305c4-561a-4561-a187-7f5b8aeb5920',
    channel: 'booking',
    title: 'Booking.com Main',
    is_active: true,
  },
};

export const UPDATE_CHANNEL_SETTINGS_EXAMPLE = {
  settings: {
    max_advance_reservation: 365,
    min_advance_reservation: 0,
  },
};

export const UPDATE_CHANNEL_MAPPINGS_EXAMPLE = {
  mappings: {
    room_type_map: {
      '994d1375-dbbd-4072-8724-b2ab32ce781b': 'booking-room-1',
    },
  },
};

export const CREATE_PHOTO_EXAMPLE = {
  photo: {
    property_id: '52397a6e-c330-44f4-a293-47042d3a3607',
    url: 'https://img.channex.io/af08bc1d-8074-476c-bdb7-cec931edaf6a/',
    room_type_id: null,
    kind: 'photo',
    author: 'Author Name',
    description: 'Room View',
    position: 0,
  },
};

export const CREATE_HOTEL_POLICY_EXAMPLE = {
  hotel_policy: {
    property_id: '52397a6e-c330-44f4-a293-47042d3a3607',
    title: 'Hotel Policy',
    currency: 'BRL',
    is_adults_only: false,
    max_count_of_guests: 20,
    checkin_time: '14:00',
    checkout_time: '12:00',
    internet_access_type: 'wifi',
    internet_access_coverage: 'entire_property',
    parking_type: 'on_site',
    parking_reservation: 'needed',
    parking_is_private: true,
    pets_policy: 'allowed',
    pets_non_refundable_fee: '0.00',
    pets_refundable_deposit: '0.00',
    smoking_policy: 'no_smoking',
  },
};

export const SEND_BOOKING_MESSAGE_EXAMPLE = {
  message: {
    message: 'Olá! Seu check-in está confirmado para 14:00.',
  },
};

export const CREATE_ATTACHMENT_EXAMPLE = {
  attachment: {
    file: 'base64_encoded_file_content',
    file_name: 'voucher.pdf',
    file_type: 'application/pdf',
  },
};

export const SEND_THREAD_ATTACHMENT_EXAMPLE = {
  message: {
    attachment_id: 'c40a00f9-d3d3-4809-8d46-adc378c95f20',
    message: 'Segue o comprovante solicitado.',
  },
};

export const REPLY_TO_REVIEW_EXAMPLE = {
  reply: {
    reply: 'Obrigado pelo feedback! Ficamos felizes que você tenha gostado da estadia.',
  },
};

export const SEND_GUEST_REVIEW_EXAMPLE = {
  review: {
    scores: [
      {
        category: 'respect_house_rules',
        rating: 5,
      },
      {
        category: 'communication',
        rating: 5,
      },
      {
        category: 'cleanliness',
        rating: 5,
      },
    ],
    private_review: 'Hóspede atencioso e tranquilo.',
    public_review: 'Ótima comunicação durante toda a estadia.',
    is_reviewee_recommended: true,
    tags: ['host_review_guest_positive_neat_and_tidy'],
  },
};

export const CREATE_CHANNEL_AVAILABILITY_RULE_EXAMPLE = {
  channel_availability_rule: {
    title: 'Fechamento feriado',
    type: 'close_out',
    affected_channels: ['aa771972-ca6c-4985-a4ea-1aad29a0c2fd'],
    affected_room_types: ['ae1c960d-5123-4be1-94ad-b50b181fc259'],
    days: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
    start_date: '2026-12-20',
    end_date: '2026-12-27',
    property_id: '18535b75-26a0-4716-ae99-0578006639c5',
  },
};

export const PAYMENT_APP_CONNECT_EXAMPLE = {
  provider: 'stripe',
  title: 'Stripe Conta Principal',
  redirect_url: 'https://pousada.exemplo.com/channex/payments/callback',
};

export const PAYMENT_PROVIDER_LIST_EXAMPLE = {
  page: 1,
  limit: 10,
};

export const PAYMENT_PROVIDER_UPDATE_EXAMPLE = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  params: {
    title: 'Stripe Matriz',
  },
};

export const PRE_AUTH_PAYMENT_EXAMPLE = {
  amount: '100.50',
  booking_id: '513866a5-bdb1-4ff5-b02f-390f7fad7bd2',
  payment_provider_id: 'ccaf28f3-f066-4f7d-b5a5-6dafd8a98753',
  description: 'Pré-autorização no check-in',
};

export const SETTLE_OR_VOID_PAYMENT_EXAMPLE = {
  payment_id: 'ba8dcd0f-fc91-4778-ae9f-6927a359c849',
};

export const CHARGE_PAYMENT_EXAMPLE = {
  booking_id: '513866a5-bdb1-4ff5-b02f-390f7fad7bd2',
  payment_provider_id: 'ccaf28f3-f066-4f7d-b5a5-6dafd8a98753',
  amount: '10.00',
  description: 'Cobrança de diária extra',
};

export const REFUND_PAYMENT_EXAMPLE = {
  amount: '100.50',
  payment_id: '73538783-d1c1-436a-b947-b4263232023b',
};

export const ONE_TIME_TOKEN_EXAMPLE = {
  one_time_token: {
    property_id: '18535b75-26a0-4716-ae99-0578006639c5',
    group_id: '52397a6e-c330-44f4-a293-47042d3a3607',
    username: 'vinicius.diller',
  },
};

export const PAYMENT_TRANSACTIONS_QUERY_EXAMPLE = {
  pagination: {
    page: 1,
    limit: 10,
  },
  order: {
    inserted_at: 'desc',
  },
  filter: {},
};

export const UPDATE_RATES_EXAMPLE = {
  values: [
    {
      property_id: '716305c4-561a-4561-a187-7f5b8aeb5920',
      rate_plan_id: 'bab451e7-9ab1-4cc4-aa16-107bf7bbabb2',
      date_from: '2026-04-01',
      date_to: '2026-04-30',
      days: ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'],
      rate: 35000,
    },
  ],
};
