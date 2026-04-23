"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createTripAction, type CreateTripState } from "./actions";
import type { RouteOption, VehicleOption } from "./page";

const INITIAL_STATE: CreateTripState = { error: null };

function formatVnd(n: number) {
  return n.toLocaleString("vi-VN");
}

function defaultDepartureLocal() {
  const d = new Date(Date.now() + 2 * 60 * 60 * 1000);
  d.setMinutes(0, 0, 0);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function NewTripForm({
  routes,
  vehicles,
}: {
  routes: RouteOption[];
  vehicles: VehicleOption[];
}) {
  const [state, formAction, isPending] = useActionState(
    createTripAction,
    INITIAL_STATE,
  );

  const [routeCode, setRouteCode] = useState(routes[0]?.code ?? "");
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? "");

  const selectedRoute = useMemo(
    () => routes.find((r) => r.code === routeCode),
    [routes, routeCode],
  );
  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === vehicleId),
    [vehicles, vehicleId],
  );

  const maxSeats = selectedVehicle?.seats ?? 16;
  const defaultPrice = selectedRoute?.base_price ?? 0;

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="route_code">Tuyến</Label>
        <select
          id="route_code"
          name="route_code"
          required
          value={routeCode}
          onChange={(e) => setRouteCode(e.target.value)}
          className="h-11 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {routes.map((r) => (
            <option key={r.code} value={r.code}>
              {r.origin} → {r.destination} · {formatVnd(r.base_price)}đ
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="vehicle_id">Xe</Label>
        <select
          id="vehicle_id"
          name="vehicle_id"
          required
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          className="h-11 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {vehicles.map((v) => {
            const label = [v.brand, v.model].filter(Boolean).join(" ");
            return (
              <option key={v.id} value={v.id}>
                {v.license_plate}
                {label ? ` · ${label}` : ""} · {v.seats} ghế
              </option>
            );
          })}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="departure_time">Giờ khởi hành</Label>
        <Input
          id="departure_time"
          name="departure_time"
          type="datetime-local"
          required
          defaultValue={defaultDepartureLocal()}
        />
        <p className="text-xs text-muted-foreground">
          Phải cách hiện tại ít nhất 30 phút, tối đa 30 ngày.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="total_seats">Số ghế bán</Label>
          <Input
            id="total_seats"
            name="total_seats"
            type="number"
            required
            min={1}
            max={maxSeats}
            defaultValue={maxSeats}
            key={`seats-${maxSeats}`}
          />
          <p className="text-xs text-muted-foreground">
            Tối đa {maxSeats} ghế
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="price_per_seat">Giá mỗi ghế (đ)</Label>
          <Input
            id="price_per_seat"
            name="price_per_seat"
            type="number"
            required
            min={10000}
            step={1000}
            defaultValue={defaultPrice}
            key={`price-${defaultPrice}`}
          />
          <p className="text-xs text-muted-foreground">
            Giá đề xuất: {formatVnd(defaultPrice)}đ
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="pickup_note">Ghi chú đón khách (tuỳ chọn)</Label>
        <textarea
          id="pickup_note"
          name="pickup_note"
          rows={2}
          maxLength={500}
          placeholder="Ví dụ: Đón tại trung tâm TP Thái Bình, khách vui lòng chờ trước 10 phút"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 h-11 text-base"
      >
        {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Tạo chuyến
      </Button>
    </form>
  );
}
