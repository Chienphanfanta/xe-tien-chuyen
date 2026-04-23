import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarClock,
  CarFront,
  CheckCircle2,
  MapPin,
  Phone,
  Users,
} from "lucide-react";

import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { HOTLINE_DISPLAY, HOTLINE_TEL, SITE } from "@/constants/site";
import { createClient } from "@/lib/supabase/server";
import type {
  Booking,
  Profile,
  Route,
  Trip,
  Vehicle,
} from "@/types/database";

export const metadata: Metadata = {
  title: "Đặt chỗ thành công",
};

export const dynamic = "force-dynamic";

type BookingSummary = Pick<
  Booking,
  | "id"
  | "seats"
  | "passenger_name"
  | "passenger_phone"
  | "pickup_address"
  | "dropoff_address"
  | "total_price"
  | "note"
  | "created_at"
> & {
  trips:
    | (Pick<Trip, "departure_time"> & {
        routes: Pick<
          Route,
          "origin" | "destination" | "distance_km"
        > | null;
        vehicles: Pick<Vehicle, "license_plate" | "brand" | "model"> | null;
        drivers: {
          profiles: Pick<Profile, "full_name"> | null;
        } | null;
      })
    | null;
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatVnd(n: number) {
  return n.toLocaleString("vi-VN");
}

export default async function BookingSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, seats, passenger_name, passenger_phone, pickup_address, dropoff_address, total_price, note, created_at, trips(departure_time, routes(origin, destination, distance_km), vehicles(license_plate, brand, model), drivers(profiles(full_name)))",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const booking = data as unknown as BookingSummary;
  const trip = booking.trips;
  const driverName = trip?.drivers?.profiles?.full_name ?? "—";
  const vehicleLabel = trip?.vehicles
    ? `${trip.vehicles.license_plate}${
        trip.vehicles.brand || trip.vehicles.model
          ? ` · ${[trip.vehicles.brand, trip.vehicles.model].filter(Boolean).join(" ")}`
          : ""
      }`
    : "—";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <section className="flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8">
          <CheckCircle2
            className="size-12 text-emerald-600 sm:size-14"
            aria-hidden
          />
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-emerald-900 sm:text-3xl">
            Đặt chỗ thành công
          </h1>
          <p className="mt-1 text-sm text-emerald-900/80 sm:text-base">
            Tài xế sẽ liên hệ qua SĐT <strong>{booking.passenger_phone}</strong>{" "}
            trước giờ khởi hành.
          </p>
          <p className="mt-4 font-mono text-xs text-emerald-900/60">
            Mã đặt chỗ: {booking.id.slice(0, 8).toUpperCase()}
          </p>
        </section>

        <section className="mt-5 rounded-2xl border border-border bg-background p-5 sm:p-6">
          <h2 className="text-base font-semibold">Thông tin chuyến</h2>
          <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 sm:text-base">
            <InfoRow
              icon={MapPin}
              label="Hành trình"
              value={
                trip?.routes
                  ? `${trip.routes.origin} → ${trip.routes.destination}`
                  : "—"
              }
            />
            <InfoRow
              icon={CalendarClock}
              label="Giờ khởi hành"
              value={trip ? formatDateTime(trip.departure_time) : "—"}
            />
            <InfoRow
              icon={MapPin}
              label="Cự ly ước tính"
              value={
                trip?.routes?.distance_km
                  ? `${trip.routes.distance_km} km`
                  : "—"
              }
            />
            <InfoRow
              icon={Users}
              label="Số ghế"
              value={`${booking.seats} ghế`}
            />
            <InfoRow
              icon={CarFront}
              label="Đơn vị vận tải"
              value={SITE.name}
            />
            <InfoRow icon={Users} label="Tài xế" value={driverName} />
            <InfoRow icon={CarFront} label="Biển số xe" value={vehicleLabel} />
            <InfoRow
              icon={Phone}
              label="Hotline hỗ trợ"
              value={
                <a
                  href={`tel:${HOTLINE_TEL}`}
                  className="font-medium text-primary hover:underline"
                >
                  {HOTLINE_DISPLAY}
                </a>
              }
            />
          </dl>
        </section>

        <section className="mt-5 rounded-2xl border border-border bg-background p-5 sm:p-6">
          <h2 className="text-base font-semibold">Điểm đón & trả</h2>
          <dl className="mt-3 flex flex-col gap-3 text-sm sm:text-base">
            <div>
              <dt className="text-xs text-muted-foreground">Điểm đón</dt>
              <dd className="font-medium">{booking.pickup_address}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Điểm trả</dt>
              <dd className="font-medium">{booking.dropoff_address}</dd>
            </div>
            {booking.note && (
              <div>
                <dt className="text-xs text-muted-foreground">Ghi chú</dt>
                <dd>{booking.note}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground sm:text-base">
              {booking.seats} ghế · Thanh toán khi lên xe
            </span>
            <span className="text-xl font-bold text-primary sm:text-2xl">
              {formatVnd(booking.total_price)}đ
            </span>
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={`tel:${HOTLINE_TEL}`}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground"
          >
            <Phone className="size-4" aria-hidden />
            Gọi {HOTLINE_DISPLAY}
          </a>
          <Link
            href="/"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-border px-5 text-base font-semibold"
          >
            Về trang chủ
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Thông tin hiển thị theo Điều 35 Nghị định 10/2020/NĐ-CP.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <div className="min-w-0 flex-1">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="font-medium">{value}</dd>
      </div>
    </div>
  );
}
