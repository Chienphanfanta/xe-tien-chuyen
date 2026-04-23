import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Car } from "lucide-react";

import { requireDriver } from "@/lib/auth/require-driver";
import { createClient } from "@/lib/supabase/server";
import type { Route, Vehicle } from "@/types/database";

import { NewTripForm } from "./new-trip-form";

export const metadata: Metadata = {
  title: "Tạo chuyến mới",
};

export type RouteOption = Pick<
  Route,
  "code" | "origin" | "destination" | "base_price"
>;

export type VehicleOption = Pick<
  Vehicle,
  "id" | "license_plate" | "brand" | "model" | "seats"
>;

export default async function NewTripPage() {
  const driver = await requireDriver();
  const supabase = await createClient();

  const [routesRes, vehiclesRes] = await Promise.all([
    supabase
      .from("routes")
      .select("code, origin, destination, base_price")
      .eq("active", true)
      .order("code"),
    supabase
      .from("vehicles")
      .select("id, license_plate, brand, model, seats")
      .eq("driver_id", driver.driverId)
      .eq("active", true)
      .order("created_at"),
  ]);

  const routes = (routesRes.data ?? []) as RouteOption[];
  const vehicles = (vehiclesRes.data ?? []) as VehicleOption[];

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/driver"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Về bảng điều khiển
      </Link>

      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Tạo chuyến mới
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Điền thông tin chuyến. Khách sẽ thấy trên trang chủ sau khi tạo.
        </p>
      </header>

      <div className="rounded-2xl border border-border bg-background p-5 sm:p-6">
        {vehicles.length === 0 ? (
          <NoVehicleState />
        ) : (
          <NewTripForm routes={routes} vehicles={vehicles} />
        )}
      </div>
    </div>
  );
}

function NoVehicleState() {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <Car className="size-10 text-muted-foreground/60" aria-hidden />
      <p className="mt-3 font-medium">Chưa có xe nào trong hệ thống</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Bạn cần thêm ít nhất 1 xe trước khi tạo chuyến. Liên hệ quản trị viên
        để thêm xe vào hồ sơ tài xế của bạn.
      </p>
    </div>
  );
}
