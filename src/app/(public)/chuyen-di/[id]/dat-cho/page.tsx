import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock } from "lucide-react";

import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { createClient } from "@/lib/supabase/server";

import { BookingForm } from "./booking-form";

export const metadata: Metadata = {
  title: "Đặt chỗ",
};

export const dynamic = "force-dynamic";

type BookingTrip = {
  id: string;
  departure_time: string;
  available_seats: number;
  price_per_seat: number;
  status: "scheduled" | "boarding";
  routes: { origin: string; destination: string } | null;
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

export default async function BookingFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("trips")
    .select(
      "id, departure_time, available_seats, price_per_seat, status, routes(origin, destination)",
    )
    .eq("id", id)
    .in("status", ["scheduled", "boarding"])
    .maybeSingle();

  if (error || !data) notFound();

  const trip = data as unknown as BookingTrip;

  if (trip.available_seats <= 0) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
          <div className="rounded-2xl border border-border bg-muted/30 py-12 text-center">
            <p className="font-semibold">Chuyến đã hết chỗ</p>
            <Link
              href="/chuyen-di"
              className="mt-4 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              Xem chuyến khác
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <Link
          href={`/chuyen-di/${trip.id}`}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Quay lại chi tiết chuyến
        </Link>

        <header className="mt-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Đặt chỗ
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Thông tin của bạn chỉ chia sẻ với tài xế.
          </p>
        </header>

        <section className="mt-4 rounded-2xl border border-border bg-muted/30 p-4 sm:p-5">
          <div className="font-semibold sm:text-lg">
            {trip.routes
              ? `${trip.routes.origin} → ${trip.routes.destination}`
              : "Chuyến"}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="size-3.5" aria-hidden />
              {formatDateTime(trip.departure_time)}
            </span>
            <span>{formatVnd(trip.price_per_seat)}đ/ghế</span>
          </div>
        </section>

        <div className="mt-6 rounded-2xl border border-border bg-background p-5 sm:p-6">
          <BookingForm
            tripId={trip.id}
            pricePerSeat={trip.price_per_seat}
            availableSeats={trip.available_seats}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
