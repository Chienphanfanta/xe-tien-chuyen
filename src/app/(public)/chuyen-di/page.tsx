import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, Users } from "lucide-react";

import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Tìm chuyến",
  description: "Danh sách chuyến xe ghép đang mở đặt chỗ",
};

export const dynamic = "force-dynamic";

type OpenTrip = {
  id: string;
  departure_time: string;
  available_seats: number;
  total_seats: number;
  price_per_seat: number;
  status: "scheduled" | "boarding";
  routes: { origin: string; destination: string } | null;
};

async function fetchOpenTrips(): Promise<OpenTrip[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("trips")
    .select(
      "id, departure_time, available_seats, total_seats, price_per_seat, status, routes(origin, destination)",
    )
    .in("status", ["scheduled", "boarding"])
    .gte("departure_time", new Date().toISOString())
    .gt("available_seats", 0)
    .order("departure_time")
    .limit(50);

  return (data ?? []) as unknown as OpenTrip[];
}

function formatVnd(n: number) {
  return n.toLocaleString("vi-VN");
}

function groupByDate(trips: OpenTrip[]) {
  const map = new Map<string, OpenTrip[]>();
  for (const t of trips) {
    const key = new Date(t.departure_time).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const list = map.get(key);
    if (list) list.push(t);
    else map.set(key, [t]);
  }
  return Array.from(map.entries());
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function TripsIndexPage() {
  const trips = await fetchOpenTrips();
  const groups = groupByDate(trips);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm">
            Chuyến đang mở
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {trips.length > 0
              ? `${trips.length} chuyến sẵn sàng đón khách`
              : "Chưa có chuyến nào đang mở"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Chọn chuyến phù hợp với lịch trình, đặt chỗ trong 2 phút. Giá niêm
            yết đã bao gồm phí đón tận nhà nội thành.
          </p>
        </header>

        {trips.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-8">
            {groups.map(([date, list]) => (
              <section key={date}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {date}
                </h2>
                <ul className="flex flex-col gap-3">
                  {list.map((t) => (
                    <li key={t.id}>
                      <TripRow trip={t} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background py-14 text-center">
      <CalendarClock className="mx-auto size-10 text-muted-foreground/60" aria-hidden />
      <p className="mt-3 font-medium">Chưa có chuyến nào đang mở</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Vui lòng quay lại sau hoặc gọi hotline để được hỗ trợ.
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex h-10 items-center rounded-full border border-border px-5 text-sm font-semibold hover:bg-muted"
      >
        Về trang chủ
      </Link>
    </div>
  );
}

function TripRow({ trip }: { trip: OpenTrip }) {
  const route = trip.routes;
  return (
    <Link
      href={`/chuyen-di/${trip.id}`}
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-border bg-background p-4 transition hover:border-primary/60 hover:shadow-sm sm:p-5"
    >
      <div className="flex flex-col items-center justify-center rounded-lg bg-primary/10 px-3 py-2 text-primary">
        <span className="text-xl font-bold leading-none sm:text-2xl">
          {formatTime(trip.departure_time)}
        </span>
      </div>

      <div className="min-w-0">
        <div className="font-semibold sm:text-lg">
          {route ? `${route.origin} → ${route.destination}` : "—"}
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground sm:text-sm">
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" aria-hidden />
            Còn {trip.available_seats}/{trip.total_seats} ghế
          </span>
          {trip.status === "boarding" && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
              Đang đón khách
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="text-lg font-bold sm:text-xl">
            {formatVnd(trip.price_per_seat)}
            <span className="ml-0.5 text-xs font-medium text-muted-foreground">
              đ/ghế
            </span>
          </div>
        </div>
        <ArrowRight
          className="size-5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary"
          aria-hidden
        />
      </div>
    </Link>
  );
}
