-- =========================================================
-- Xe Tiện Chuyến — initial schema
-- Ride-sharing platform (Nghị định 10/2020/NĐ-CP, Điều 35)
-- =========================================================

-- Extensions ----------------------------------------------
create extension if not exists "postgis";
create extension if not exists "pgcrypto";

-- Enums ---------------------------------------------------
create type user_role as enum ('passenger', 'driver', 'admin');

create type driver_status as enum (
  'pending_verification',
  'verified',
  'suspended'
);

create type trip_status as enum (
  'scheduled',
  'boarding',
  'in_progress',
  'completed',
  'cancelled'
);

create type booking_status as enum (
  'pending',
  'confirmed',
  'paid',
  'completed',
  'cancelled',
  'no_show'
);

-- profiles (extends auth.users) ---------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text unique,
  full_name text,
  avatar_url text,
  role user_role not null default 'passenger',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- routes (tuyến cố định) ----------------------------------
create table public.routes (
  code text primary key,
  origin text not null,
  destination text not null,
  distance_km numeric(6,2),
  duration_minutes int,
  base_price int not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- drivers -------------------------------------------------
create table public.drivers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  license_number text not null unique,
  license_image_url text,
  id_card_number text unique,
  id_card_front_url text,
  id_card_back_url text,
  status driver_status not null default 'pending_verification',
  rating numeric(3,2) default 5.00,
  total_trips int not null default 0,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- vehicles ------------------------------------------------
create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.drivers(id) on delete cascade,
  license_plate text not null unique,
  brand text,
  model text,
  color text,
  seats int not null default 4 check (seats between 2 and 16),
  registration_image_url text,
  insurance_image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- trips ---------------------------------------------------
create table public.trips (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.drivers(id) on delete restrict,
  vehicle_id uuid not null references public.vehicles(id) on delete restrict,
  route_code text not null references public.routes(code),
  departure_time timestamptz not null,
  total_seats int not null check (total_seats between 1 and 16),
  available_seats int not null check (available_seats >= 0),
  price_per_seat int not null,
  pickup_note text,
  status trip_status not null default 'scheduled',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trips_available_le_total check (available_seats <= total_seats)
);

create index trips_departure_time_idx on public.trips (departure_time);
create index trips_route_code_idx on public.trips (route_code);
create index trips_status_departure_idx on public.trips (status, departure_time);

-- bookings ------------------------------------------------
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete restrict,
  passenger_id uuid not null references public.profiles(id) on delete restrict,
  seats int not null default 1 check (seats between 1 and 10),
  passenger_name text not null,
  passenger_phone text not null,
  pickup_address text not null,
  dropoff_address text not null,
  total_price int not null,
  status booking_status not null default 'pending',
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bookings_trip_idx on public.bookings (trip_id);
create index bookings_passenger_idx on public.bookings (passenger_id);

-- reviews -------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  trip_id uuid not null references public.trips(id) on delete cascade,
  driver_id uuid not null references public.drivers(id) on delete cascade,
  passenger_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create index reviews_driver_idx on public.reviews (driver_id);

-- =========================================================
-- Auto-create profile on new auth.users insert
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, phone, full_name)
  values (
    new.id,
    new.phone,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- Seed routes
-- Giá chuẩn: TB-HN 250k, TB-NB 280k, TB-HP 200k, TB-CB 230k
-- =========================================================
insert into public.routes (code, origin, destination, distance_km, duration_minutes, base_price) values
  ('TB_HN', 'Thái Bình',    'Hà Nội',        110, 150, 250000),
  ('HN_TB', 'Hà Nội',       'Thái Bình',     110, 150, 250000),
  ('TB_NB', 'Thái Bình',    'Sân bay Nội Bài', 140, 180, 280000),
  ('NB_TB', 'Sân bay Nội Bài', 'Thái Bình',    140, 180, 280000),
  ('TB_HP', 'Thái Bình',    'Hải Phòng',      70, 100, 200000),
  ('HP_TB', 'Hải Phòng',    'Thái Bình',      70, 100, 200000),
  ('TB_CB', 'Thái Bình',    'Sân bay Cát Bi',  80, 110, 230000),
  ('CB_TB', 'Sân bay Cát Bi', 'Thái Bình',     80, 110, 230000)
on conflict (code) do nothing;

-- =========================================================
-- Row Level Security
-- =========================================================
alter table public.profiles enable row level security;
alter table public.routes   enable row level security;
alter table public.drivers  enable row level security;
alter table public.vehicles enable row level security;
alter table public.trips    enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews  enable row level security;

-- profiles: user xem và sửa hồ sơ của chính mình
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- routes: public read
create policy "routes_select_public"
  on public.routes for select
  using (true);

-- trips: public read các chuyến scheduled / boarding
create policy "trips_select_public_scheduled"
  on public.trips for select
  using (status in ('scheduled', 'boarding'));

-- trips: driver xem được chuyến của chính mình (mọi status)
create policy "trips_select_own_driver"
  on public.trips for select
  using (
    exists (
      select 1 from public.drivers d
      where d.id = trips.driver_id and d.profile_id = auth.uid()
    )
  );

-- drivers: public read (để show thông tin tài xế trên trip detail)
create policy "drivers_select_public"
  on public.drivers for select
  using (true);

-- vehicles: public read (legal requirement — show license plate)
create policy "vehicles_select_public"
  on public.vehicles for select
  using (true);

-- bookings: passenger xem booking của mình
create policy "bookings_select_own_passenger"
  on public.bookings for select
  using (auth.uid() = passenger_id);

-- bookings: driver xem booking của chuyến mình lái
create policy "bookings_select_own_driver"
  on public.bookings for select
  using (
    exists (
      select 1 from public.trips t
      join public.drivers d on d.id = t.driver_id
      where t.id = bookings.trip_id and d.profile_id = auth.uid()
    )
  );

-- bookings: passenger tự tạo booking cho chính mình
create policy "bookings_insert_own"
  on public.bookings for insert
  with check (auth.uid() = passenger_id);

-- reviews: public read
create policy "reviews_select_public"
  on public.reviews for select
  using (true);

-- reviews: passenger tự viết review cho booking của mình
create policy "reviews_insert_own"
  on public.reviews for insert
  with check (auth.uid() = passenger_id);
