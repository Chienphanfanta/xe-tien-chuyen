import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  CarFront,
  MapPin,
  Phone,
  Users,
} from "lucide-react";

import { HOTLINE_DISPLAY, HOTLINE_TEL, SITE } from "@/constants/site";
import { requireDriver } from "@/lib/auth/require-driver";
import { createClient } from "@/lib/supabase/server";
import type {
  Booking,
  BookingStatus,
  Route,
  Trip,
  TripStatus,
  Vehicle,
} from "@/types/database";

import { StatusActions } from "./status-actions";

export const metadata: Metadata = {
  title: "Chi tiết chuyến",
};

type TripRecord = Pick<
  Trip,
  | "id"
  | "departure_time"
  | "total_seats"
  | "available_seats"
  | "price_per_seat"
  | "pickup_note"
  | "status"
> & {
  routes: Pick<Route, "origin" | "destination" | "distance_km"> | null;
  vehicles: Pick<
    Vehicle,
    "license_plate" | "brand" | "model" | "color" | "seats"
  > | null;
};

type BookingRecord = Pick<
  Booking,
  | "id"
  | "seats"
  | "passenger_name"
  | "passenger_phone"
  | "pickup_address"
  | "dropoff_address"
  | "total_price"
  | "status"
  | "note"
  | "created_at"
>;

const TRIP_STATUS_LABEL: Record<TripStatus, string> = {
  scheduled: "Đã lên lịch",
  boarding: "Đang đón khách",
  in_progress: "Đang chạy",
  completed: "Hoàn thành",
  cancelled: "Đã huỷ",
};

const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  paid: "Đã thanh toán",
  completed: "Hoàn thành",
  cancelled: "Đã huỷ",
  no_show: "Không đến",
};

const STATUS_COLOR: Record<TripStatus, string> = {
  scheduled: "bg-secondary/10 text-secondary",
  boarding: "bg-amber-100 text-amber-800",
  in_progress: "bg-primary/10 text-primary",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-muted text-muted-foreground",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    weekday: "short",
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

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const driver = await requireDriver();
  const supabase = await createClient();

  const { data: tripData, error: tripError } = await supabase
    .from("trips")
    .select(
      "id, departure_time, total_seats, available_seats, price_per_seat, pickup_note, status, routes(origin, destination, distance_km), vehicles(license_plate, brand, model, color, seats)",
    )
    .eq("id", id)
    .eq("driver_id", driver.driverId)
    .maybeSingle();

  if (tripError || !tripData) {
    notFound();
  }

  const trip = tripData as unknown as TripRecord;

  const { data: bookingsData } = await supabase
    .from("bookings")
    .select(
      "id, seats, passenger_name, passenger_phone, pickup_address, dropoff_address, total_price, status, note, created_at",
    )
    .eq("trip_id", id)
    .order("created_at");

  const bookings = (bookingsData ?? []) as BookingRecord[];
  const bookedSeats = trip.total_seats - trip.available_seats;
  const revenue = bookings
    .filter((b) => b.status === "paid" || b.status === "completed")
    .reduce((sum, b) => sum + b.total_price, 0);

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/driver"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Về bảng điều khiển
      </Link>

      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLOR[trip.status]}`}
          >
            {TRIP_STATUS_LABEL[trip.status]}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {trip.routes
            ? `${trip.routes.origin} → ${trip.routes.destination}`
            : "Chuyến"}
        </h1>
        <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground sm:text-base">
          <CalendarClock className="size-4" aria-hidden />
          {formatDateTime(trip.departure_time)}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InfoCard title="Thông tin chuyến">
          <InfoRow
            icon={MapPin}
            label="Cự ly ước tính"
            value={trip.routes?.distance_km ? `${trip.routes.distance_km} km` : "—"}
          />
          <InfoRow
            icon={Users}
            label="Ghế đã đặt"
            value={`${bookedSeats}/${trip.total_seats} ghế`}
          />
          <InfoRow
            icon={CalendarClock}
            label="Giá mỗi ghế"
            value={`${formatVnd(trip.price_per_seat)}đ`}
          />
          {trip.pickup_note && (
            <div className="mt-2 rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Ghi chú đón: </span>
              {trip.pickup_note}
            </div>
          )}
        </InfoCard>

        <InfoCard title="Thông tin vận hành">
          <InfoRow
            icon={CarFront}
            label="Đơn vị vận tải"
            value={SITE.name}
          />
          <InfoRow
            icon={Users}
            label="Tài xế"
            value={driver.fullName ?? "—"}
          />
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
        </InfoCard>
      </div>

      <StatusActions tripId={trip.id} status={trip.status} />

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold sm:text-xl">
            Khách đã đặt chỗ ({bookings.length})
          </h2>
          {revenue > 0 && (
            <span className="text-sm text-muted-foreground sm:text-base">
              Doanh thu:{" "}
              <span className="font-semibold text-foreground">
                {formatVnd(revenue)}đ
              </span>
            </span>
          )}
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background py-10 text-center">
            <Users className="mx-auto size-10 text-muted-foreground/60" aria-hidden />
            <p className="mt-3 font-medium">Chưa có khách đặt chỗ</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Khách sẽ thấy chuyến này trên trang chủ.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="rounded-2xl border border-border bg-background p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold">{b.passenger_name}</div>
                    <a
                      href={`tel:${b.passenger_phone}`}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <Phone className="size-3.5" aria-hidden />
                      {b.passenger_phone}
                    </a>
                  </div>
                  <span className="inline-flex shrink-0 items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                    {BOOKING_STATUS_LABEL[b.status]}
                  </span>
                </div>
                <dl className="mt-3 grid grid-cols-1 gap-1 text-sm sm:grid-cols-2 sm:gap-3">
                  <InfoLine label="Số ghế" value={`${b.seats} ghế`} />
                  <InfoLine
                    label="Tổng tiền"
                    value={`${formatVnd(b.total_price)}đ`}
                  />
                  <InfoLine label="Điểm đón" value={b.pickup_address} />
                  <InfoLine label="Điểm trả" value={b.dropoff_address} />
                </dl>
                {b.note && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Ghi chú: </span>
                    {b.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-5 sm:p-6">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="flex flex-col gap-2">{children}</div>
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
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium sm:text-base">{value}</div>
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
