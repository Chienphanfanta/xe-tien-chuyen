"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { requireDriver } from "@/lib/auth/require-driver";
import { createClient } from "@/lib/supabase/server";

const MIN_LEAD_MINUTES = 30;
const MAX_LEAD_DAYS = 30;

const createTripSchema = z.object({
  route_code: z.string().min(1, "Chưa chọn tuyến"),
  vehicle_id: z.uuid("Chưa chọn xe"),
  departure_time: z.string().min(1, "Chưa chọn giờ khởi hành"),
  total_seats: z.coerce.number().int().min(1).max(16),
  price_per_seat: z.coerce.number().int().min(10000),
  pickup_note: z.string().max(500).optional(),
});

export type CreateTripState = { error: string | null };

export async function createTripAction(
  _prev: CreateTripState,
  formData: FormData,
): Promise<CreateTripState> {
  const parsed = createTripSchema.safeParse({
    route_code: formData.get("route_code"),
    vehicle_id: formData.get("vehicle_id"),
    departure_time: formData.get("departure_time"),
    total_seats: formData.get("total_seats"),
    price_per_seat: formData.get("price_per_seat"),
    pickup_note: formData.get("pickup_note") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  }

  const departureMs = new Date(parsed.data.departure_time).getTime();
  if (Number.isNaN(departureMs)) {
    return { error: "Giờ khởi hành không hợp lệ" };
  }
  const nowMs = Date.now();
  if (departureMs < nowMs + MIN_LEAD_MINUTES * 60_000) {
    return { error: `Giờ khởi hành phải cách hiện tại ít nhất ${MIN_LEAD_MINUTES} phút` };
  }
  if (departureMs > nowMs + MAX_LEAD_DAYS * 86_400_000) {
    return { error: `Chỉ tạo chuyến trong vòng ${MAX_LEAD_DAYS} ngày tới` };
  }

  const driver = await requireDriver();
  const supabase = await createClient();

  const { data: vehicle, error: vehicleError } = await supabase
    .from("vehicles")
    .select("id, seats, driver_id, active")
    .eq("id", parsed.data.vehicle_id)
    .eq("driver_id", driver.driverId)
    .maybeSingle();

  if (vehicleError || !vehicle || !vehicle.active) {
    return { error: "Xe không hợp lệ hoặc không thuộc tài khoản của bạn" };
  }

  if (parsed.data.total_seats > vehicle.seats) {
    return {
      error: `Số ghế không được vượt quá số ghế của xe (${vehicle.seats})`,
    };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("trips")
    .insert({
      driver_id: driver.driverId,
      vehicle_id: vehicle.id,
      route_code: parsed.data.route_code,
      departure_time: new Date(departureMs).toISOString(),
      total_seats: parsed.data.total_seats,
      available_seats: parsed.data.total_seats,
      price_per_seat: parsed.data.price_per_seat,
      pickup_note: parsed.data.pickup_note ?? null,
      status: "scheduled",
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    return { error: `Không tạo được chuyến: ${insertError?.message ?? "lỗi không rõ"}` };
  }

  redirect(`/driver/trips/${inserted.id}`);
}
