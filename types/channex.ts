export type OtaSource = 'booking' | 'expedia' | 'hotels_com' | 'manual';

export type Room = {
  id: string;
  channexRoomTypeId: string;
  name: string;
  maxGuests: number;
  status: 'active' | 'maintenance';
};

export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled' | 'blocked';

export type Customer = {
  name: string;
  email: string;
  phone: string;
};

export type Reservation = {
  id: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: ReservationStatus;
  otaSource: OtaSource;
  channelReference: string;
  amount: number;
  currency: string;
  customer: Customer;
  notes: string;
};

export type ExpenseCategory = 'limpeza' | 'manutenção' | 'impostos' | 'insumos' | 'comissões' | 'outros';

export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
};

export type ChannexError = {
  code: string;
  title: string;
  details?: Record<string, string[]>;
};

export type ChannexMeta = {
  message?: string;
  limit?: number;
  page?: number;
  total?: number;
};

export type ChannexResponse<T> = {
  data: T | T[];
  meta?: ChannexMeta;
  errors?: ChannexError;
};

export type ChannexCreateRequest<T> = {
  [type: string]: T;
};

export type ChannexRoomType = {
  id: string;
  type: 'room_type';
  attributes: {
    title?: string;
    name?: string;
    status?: 'active' | 'inactive' | string;
    max_occupancy?: {
      adults?: number;
      children?: number;
      infants?: number;
    };
  };
};

export type ChannexBooking = {
  id: string;
  type: 'booking';
  attributes: {
    property_id?: string;
    arrival_date?: string;
    departure_date?: string;
    status?: 'new' | 'modified' | 'cancelled' | string;
    currency?: string;
    amount?: string | number;
    notes?: string;
    ota_source?: OtaSource;
    channel_reference?: string;
    reference?: string;
    customer?: {
      name?: string;
      surname?: string;
      email?: string;
      phone?: string;
    };
    rooms?: Array<{
      checkin_date?: string;
      checkout_date?: string;
      room_type_id?: string;
      rate_plan_id?: string;
      amount?: string;
      occupancy?: {
        adults?: number;
        children?: number;
        infants?: number;
      };
    }>;
  };
};

export interface ChannexBookingPayload {
  booking: {
    property_id: string;
    arrival_date: string;
    departure_date: string;
    status: 'new' | 'modified' | 'cancelled';
    currency: string;
    amount: string;
    notes?: string;
    customer: {
      name: string;
      surname?: string;
      email: string;
      phone?: string;
    };
    rooms: Array<{
      checkin_date: string;
      checkout_date: string;
      room_type_id: string;
      rate_plan_id: string;
      amount: string;
      occupancy: { adults: number; children: number; infants: number };
    }>;
  };
}

export type ChannexPropertyType =
  | 'apart_hotel'
  | 'apartment'
  | 'boat'
  | 'camping'
  | 'capsule_hotel'
  | 'chalet'
  | 'country_house'
  | 'farm_stay'
  | 'guest_house'
  | 'holiday_home'
  | 'holiday_park'
  | 'homestay'
  | 'hostel'
  | 'hotel'
  | 'inn'
  | 'lodge'
  | 'motel'
  | 'resort'
  | 'riad'
  | 'ryokan'
  | 'tent'
  | 'villa';

export type ChannexPropertySettings = {
  allow_availability_autoupdate_on_confirmation?: boolean;
  allow_availability_autoupdate_on_modification?: boolean;
  allow_availability_autoupdate_on_cancellation?: boolean;
  min_stay_type?: 'both' | 'arrival' | 'through';
  min_price?: string | number | null;
  max_price?: string | number | null;
  state_length?: number;
  cut_off_time?: string;
  cut_off_days?: number;
  max_day_advance?: number | null;
};

export type ChannexPropertyContent = {
  description?: string | null;
  important_information?: string | null;
  photos?: Array<{
    url: string;
    position?: number;
    author?: string;
    kind?: 'photo' | 'ad' | 'menu';
    description?: string;
  }>;
};

export type ChannexPropertyAttributes = {
  id?: string;
  title: string;
  is_active?: boolean;
  email?: string;
  phone?: string;
  currency: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  zip_code?: string;
  latitude?: string | null;
  longitude?: string | null;
  timezone?: string;
  property_type?: ChannexPropertyType;
  website?: string;
  logo_url?: string | null;
  settings?: ChannexPropertySettings;
  content?: ChannexPropertyContent;
};

export type ChannexProperty = {
  type: 'property';
  id: string;
  attributes: ChannexPropertyAttributes;
};

export type ChannexPropertyOption = {
  type: 'properties';
  id: string;
  attributes: {
    id: string;
    title: string;
    currency: string;
  };
};

export type ChannexCreatePropertyPayload = {
  property: ChannexPropertyAttributes & {
    group_id?: string;
    facilities?: string[];
  };
};

export type ChannexUpdatePropertyPayload = ChannexCreatePropertyPayload;
