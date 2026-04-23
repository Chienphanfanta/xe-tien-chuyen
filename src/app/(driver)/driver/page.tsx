import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, Plus, Star, Users } from "lucide-react";

import { requireDriver } from "@/lib/auth/require-driver";
import { createClient } from "@/lib/supabase/server";
import type { Route, Trip } from "@/types/database";

export const metadata: Metadata = {
  title: "Bảng điều khiển",
};

type UpcomingTrip = Pick<
  Trip,
  | "id"
  | "departure_time"
  | "route_code"
  | "available_seats"
  | "total_seats"
  | "price_per_seat"
> & {
  routes: Pick<Route, "origin" | "destination"> | null;
};

async function fetchUpcomingTrips(driverId: string): Promise<UpcomingTrip[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("trips")
    .select(
      "id, departure_time, route_code, available_seats, total_seats, price_per_seat, routes(origin, destination)",
    )
    .eq("driver_id", driverId)
    .gte("departure_time", new Date().toISOString())
    .in("status", ["scheduled", "boarding"])
    .order("departure_time")
    .limit(10);

  return (data ?? []) as unknown as UpcomingTrip[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DriverDashboardPage() {
  const driver = await requireDriver();
  const trips = await fetchUpcomingTrips(driver.driverId);

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Xin chào, {driver.fullName ?? "Tài xế"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Quản lý các chuyến sắp chạy và xem lịch đặt chỗ.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          icon={CalendarClock}
          label="Chuyến sắp tới"
          value={trips.length.toString()}
        />
        <StatCard
          icon={Users}
          label="Tổng chuyến đã chạy"
          value={driver.totalTrips.toString()}
        />
        <StatCard
          icon={Star}
          label="Đánh giá"
          value={
            driver.rating !== null ? driver.rating.toFixed(2) : "—"
          }
          className="col-span-2 sm:col-span-1"
        />
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold sm:text-xl">
            Chuyến sắp tới
          </h2>
          <Link
            href="/driver/trips/new"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <Plus className="size-4" aria-hidden />
            Tạo chuyến
          </Link>
        </div>

        {trips.length === 0 ? (
          <EmptyTrips />
        ) : (
          <ul className="flex flex-col gap-3">
            {trips.map((t) => (
              <li key={t.id}>
                <TripRow trip={t} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border border-border bg-background p-4 sm:p-5 ${className ?? ""}`}
    >
      <Icon className="size-5 text-primary" aria-hidden />
      <span className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        {value}
      </span>
      <span className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
        {label}
      </span>
    </div>
  );
}

function EmptyTrips() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-background py-10 text-center sm:py-14">
      <CalendarClock
        className="size-10 text-muted-foreground/60"
        aria-hidden
      />
      <p className="mt-3 font-medium">Chưa có chuyến nào sắp tới</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Tạo chuyến mới để khách có thể đặt chỗ.
      </p>
      <Link
        href="/driver/trips/new"
        className="mt-5 inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
      >
        <Plus className="size-4" aria-hidden />
        Tạo chuyến đầu tiên
      </Link>
    </div>
  );
}

function TripRow({ trip }: { trip: UpcomingTrip }) {
  const route = trip.routes;
  return (
    <Link
      href={`/driver/trips/${trip.id}`}
      className="group flex items-center gap-3 rounded-2xl border border-border bg-background p-4 transition hover:border-primary/60 sm:p-5"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <CalendarClock className="size-3.5" aria-hidden />
          {formatDate(trip.departure_time)}
        </div>
        <div className="mt-1 font-semibold sm:text-lg">
          {route ? `${route.origin} → ${route.destination}` : trip.route_code}
        </div>
        <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
          {trip.available_seats}/{trip.total_seats} ghế còn ·{" "}
          {trip.price_per_seat.toLocaleString("vi-VN")}đ/ghế
        </div>
      </div>
      <ArrowRight
        className="size-5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary"
        aria-hidden
      />
    </Link>
  );
}
