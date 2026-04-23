-- =========================================================
-- Driver write policies — RLS for INSERT/UPDATE on trips and bookings
-- =========================================================
-- Initial schema enabled RLS and added SELECT policies only. The
-- /driver flow needs drivers to insert new trips, update their
-- status, and mark bookings. All policies scope writes to rows
-- belonging to the authenticated driver.
-- =========================================================

-- trips ---------------------------------------------------
create policy "trips_insert_own_driver"
  on public.trips for insert
  with check (
    exists (
      select 1 from public.drivers d
      where d.id = trips.driver_id and d.profile_id = auth.uid()
    )
  );

create policy "trips_update_own_driver"
  on public.trips for update
  using (
    exists (
      select 1 from public.drivers d
      where d.id = trips.driver_id and d.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.drivers d
      where d.id = trips.driver_id and d.profile_id = auth.uid()
    )
  );

-- bookings ------------------------------------------------
-- Drivers mark bookings on their own trips (paid / no_show / completed).
create policy "bookings_update_own_driver"
  on public.bookings for update
  using (
    exists (
      select 1 from public.trips t
      join public.drivers d on d.id = t.driver_id
      where t.id = bookings.trip_id and d.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.trips t
      join public.drivers d on d.id = t.driver_id
      where t.id = bookings.trip_id and d.profile_id = auth.uid()
    )
  );
