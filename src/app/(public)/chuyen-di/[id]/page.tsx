import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  CarFront,
  MapPin,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";

import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { HOTLINE_DISPLAY, HOTLINE_TEL, SITE } from "@/constants/site";
import { createClient } from "@/lib/supabase/server";
import type {
  Profile,
  Route,
  Trip,
  Vehicle,
} from "@/types/database";

export const metadata: Metadata = {
  title: "Chi tiết chuyến",
};

export const dynamic = "force-dynamic";

type PublicTrip = Pick<
  Trip,
  | "id"
  | "departure_time"
  | "total_seats"
  | "available_seats"
  | "price_per_seat"
  | "pickup_note"
  | "status"
> & {
  routes: Pick<
    Route,
    "origin" | "destination" | "distance_km" | "duration_minutes"
  > | null;
  vehicles: Pick<
    Vehicle,
    "license_plate" | "brand" | "model" | "seats"
  > | null;
  drivers: {
    profiles: Pick<Profile, "full_name"> | null;
  } | null;
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

function formatDuration(minutes: number | null) {
  if (minutes === null) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h${m}`;
  if (h) return `${h}h`;
  return `${m} phút`;
}

export default async function PublicTripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("trips")
    .select(
      "id, departure_time, total_seats, available_seats, price_per_seat, pickup_note, status, routes(origin, destination, distance_km, duration_minutes), vehicles(license_plate, brand, model, seats), drivers(profiles(full_name))",
    )
    .eq("id", id)
    .in("status", ["scheduled", "boarding"])
    .maybeSingle();

  if (error || !data) notFound();

  const trip = data as unknown as PublicTrip;
  const soldOut = trip.available_seats <= 0;
  const driverName = trip.drivers?.profiles?.full_name ?? "—";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <Link
          href="/chuyen-di"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Về danh sách chuyến
        </Link>

        <header className="mt-4">
          {trip.status === "boarding" && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              Đang đón khách
            </span>
          )}
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {trip.routes
              ? `${trip.routes.origin} → ${trip.routes.destination}`
              : "Chuyến"}
          </h1>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground sm:text-base">
            <CalendarClock className="size-4" aria-hidden />
            {formatDateTime(trip.departure_time)}
          </p>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <StatTile
            label="Giá mỗi ghế"
            value={`${formatVnd(trip.price_per_seat)}đ`}
            highlight
          />
          <StatTile
            label="Ghế còn"
            value={`${trip.available_seats}/${trip.total_seats}`}
          />
          <StatTile
            label="Cự ly"
            value={
              trip.routes?.distance_km ? `${trip.routes.distance_km} km` : "—"
            }
          />
          <StatTile
            label="Thời gian"
            value={formatDuration(trip.routes?.duration_minutes ?? null) ?? "—"}
          />
        </section>

        {trip.pickup_note && (
          <section className="mt-4 rounded-2xl border border-border bg-muted/30 p-4 text-sm sm:p-5 sm:text-base">
            <span className="font-semibold">Ghi chú đón khách: </span>
            {trip.pickup_note}
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-border bg-background p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="size-4 text-secondary" aria-hidden />
            <h2 className="text-base font-semibold">Thông tin vận hành</h2>
          </div>
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 sm:text-base">
            <InfoRow icon={CarFront} label="Đơn vị vận tải" value={SITE.name} />
            <InfoRow icon={Users} label="Tài xế" value={driverName} />
            <InfoRow
              icon={CarFront}
              label="Biển số xe"
              value={
                trip.vehicles
                  ? `${trip.vehicles.license_plate}${
                      trip.vehicles.brand || trip.vehicles.model
                        ? ` · ${[trip.vehicles.brand, trip.vehicles.model].filter(Boolean).join(" ")}`
                        : ""
                    }`
                  : "—"
              }
            />
            <InfoRow
              icon={MapPin}
              label="Hành trình"
              value={
                trip.routes
                  ? `${trip.routes.origin} → ${trip.routes.destination}`
                  : "—"
              }
            />
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
          <p className="mt-4 text-xs text-muted-foreground">
            Thông tin hiển thị theo Điều 35 Nghị định 10/2020/NĐ-CP.
          </p>
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {soldOut ? (
            <span className="inline-flex h-13 flex-1 items-center justify-center rounded-full bg-muted px-6 text-base font-semibold text-muted-foreground">
              Hết chỗ
            </span>
          ) : (
            <Link
              href={`/chuyen-di/${trip.id}/dat-cho`}
              className="inline-flex h-13 flex-1 items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90"
            >
              Đặt chỗ ngay
            </Link>
          )}
          <a
            href={`tel:${HOTLINE_TEL}`}
            className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-border px-6 text-base font-semibold transition hover:bg-muted"
          >
            <Phone className="size-4" aria-hidden />
            Gọi tổng đài
          </a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function StatTile({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-xl border p-3 sm:p-4 ${
        highlight
          ? "border-primary/40 bg-primary/5"
          : "border-border bg-background"
      }`}
    >
      <span
        className={`text-base font-bold sm:text-xl ${highlight ? "text-primary" : ""}`}
      >
        {value}
      </span>
      <span className="mt-0.5 text-xs text-muted-foreground">{label}</span>
    </div>
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
