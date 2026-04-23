"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireDriver } from "@/lib/auth/require-driver";
import { createClient } from "@/lib/supabase/server";
import type { TripStatus } from "@/types/database";

const ALLOWED_NEXT: Record<TripStatus, TripStatus[]> = {
  scheduled: ["boarding", "cancelled"],
  boarding: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

const schema = z.object({
  trip_id: z.uuid(),
  next_status: z.enum([
    "scheduled",
    "boarding",
    "in_progress",
    "completed",
    "cancelled",
  ]),
});

export type UpdateTripStatusState = { error: string | null };

export async function updateTripStatusAction(
  _prev: UpdateTripStatusState,
  formData: FormData,
): Promise<UpdateTripStatusState> {
  const parsed = schema.safeParse({
    trip_id: formData.get("trip_id"),
    next_status: formData.get("next_status"),
  });

  if (!parsed.success) {
    return { error: "Dữ liệu không hợp lệ" };
  }

  const driver = await requireDriver();
  const supabase = await createClient();

  const { data: trip, error: fetchError } = await supabase
    .from("trips")
    .select("status, driver_id")
    .eq("id", parsed.data.trip_id)
    .eq("driver_id", driver.driverId)
    .maybeSingle();

  if (fetchError || !trip) {
    return { error: "Không tìm thấy chuyến hoặc bạn không có quyền" };
  }

  const current = trip.status as TripStatus;
  if (!ALLOWED_NEXT[current].includes(parsed.data.next_status)) {
    return {
      error: `Không thể chuyển từ '${current}' sang '${parsed.data.next_status}'`,
    };
  }

  const { error: updateError } = await supabase
    .from("trips")
    .update({ status: parsed.data.next_status })
    .eq("id", parsed.data.trip_id);

  if (updateError) {
    return { error: `Không cập nhật được: ${updateError.message}` };
  }

  revalidatePath(`/driver/trips/${parsed.data.trip_id}`);
  revalidatePath("/driver");
  return { error: null };
}
