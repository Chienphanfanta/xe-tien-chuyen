-- =========================================================
-- book_seats RPC — atomic booking with seat reservation
-- =========================================================
-- Anonymous + authenticated passengers call this via supabase.rpc().
-- Runs as security definer so it bypasses RLS for the INSERT/UPDATE
-- but enforces ownership by reading auth.uid() itself. Row-level
-- locking on trips prevents race conditions when two passengers
-- compete for the last seat.
-- =========================================================

create or replace function public.book_seats(
  p_trip_id uuid,
  p_passenger_name text,
  p_passenger_phone text,
  p_seats int,
  p_pickup_address text,
  p_dropoff_address text,
  p_note text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_trip public.trips%rowtype;
  v_booking_id uuid;
  v_uid uuid;
begin
  v_uid := auth.uid();
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = 'P0001';
  end if;

  if p_seats < 1 or p_seats > 10 then
    raise exception 'invalid_seats' using errcode = 'P0001';
  end if;
  if coalesce(length(trim(p_passenger_name)), 0) < 2 then
    raise exception 'invalid_name' using errcode = 'P0001';
  end if;
  if coalesce(length(trim(p_passenger_phone)), 0) < 9 then
    raise exception 'invalid_phone' using errcode = 'P0001';
  end if;
  if coalesce(length(trim(p_pickup_address)), 0) < 3 then
    raise exception 'invalid_pickup' using errcode = 'P0001';
  end if;
  if coalesce(length(trim(p_dropoff_address)), 0) < 3 then
    raise exception 'invalid_dropoff' using errcode = 'P0001';
  end if;

  select * into v_trip
    from public.trips
    where id = p_trip_id
    for update;

  if not found then
    raise exception 'trip_not_found' using errcode = 'P0001';
  end if;
  if v_trip.status not in ('scheduled', 'boarding') then
    raise exception 'trip_not_bookable' using errcode = 'P0001';
  end if;
  if v_trip.departure_time < now() then
    raise exception 'trip_already_departed' using errcode = 'P0001';
  end if;
  if v_trip.available_seats < p_seats then
    raise exception 'not_enough_seats' using errcode = 'P0001';
  end if;

  insert into public.bookings (
    trip_id, passenger_id, seats, passenger_name, passenger_phone,
    pickup_address, dropoff_address, total_price, note, status
  ) values (
    p_trip_id, v_uid, p_seats,
    trim(p_passenger_name), trim(p_passenger_phone),
    trim(p_pickup_address), trim(p_dropoff_address),
    v_trip.price_per_seat * p_seats,
    nullif(trim(coalesce(p_note, '')), ''),
    'pending'
  ) returning id into v_booking_id;

  update public.trips
    set available_seats = available_seats - p_seats
    where id = p_trip_id;

  return v_booking_id;
end;
$$;

grant execute on function public.book_seats(
  uuid, text, text, int, text, text, text
) to authenticated, anon;
