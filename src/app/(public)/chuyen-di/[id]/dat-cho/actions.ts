"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const phoneRegex = /^(0|\+84)\d{8,10}$/;

const schema = z.object({
  trip_id: z.uuid(),
  passenger_name: z.string().trim().min(2, "Họ tên quá ngắn").max(80),
  passenger_phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Số điện thoại không hợp lệ"),
  seats: z.coerce.number().int().min(1).max(10),
  pickup_address: z.string().trim().min(3, "Điểm đón quá ngắn").max(200),
  dropoff_address: z.string().trim().min(3, "Điểm trả quá ngắn").max(200),
  note: z.string().trim().max(500).optional(),
});

const ERROR_MESSAGES: Record<string, string> = {
  not_authenticated: "Phiên bị ngắt, vui lòng thử lại",
  invalid_seats: "Số ghế không hợp lệ",
  invalid_name: "Họ tên không hợp lệ",
  invalid_phone: "Số điện thoại không hợp lệ",
  invalid_pickup: "Điểm đón không hợp lệ",
  invalid_dropoff: "Điểm trả không hợp lệ",
  trip_not_found: "Không tìm thấy chuyến",
  trip_not_bookable: "Chuyến đã đóng đặt chỗ",
  trip_already_departed: "Chuyến đã khởi hành",
  not_enough_seats: "Không còn đủ ghế trống",
};

export type CreateBookingState = { error: string | null };

export async function createBookingAction(
  _prev: CreateBookingState,
  formData: FormData,
): Promise<CreateBookingState> {
  const parsed = schema.safeParse({
    trip_id: formData.get("trip_id"),
    passenger_name: formData.get("passenger_name"),
    passenger_phone: formData.get("passenger_phone"),
    seats: formData.get("seats"),
    pickup_address: formData.get("pickup_address"),
    dropoff_address: formData.get("dropoff_address"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const { error: signInError } = await supabase.auth.signInAnonymously();
    if (signInError) {
      return {
        error:
          "Không thể khởi tạo phiên đặt chỗ. Vui lòng gọi hotline để đặt.",
      };
    }
  }

  const { data: bookingId, error: rpcError } = await supabase.rpc(
    "book_seats",
    {
      p_trip_id: parsed.data.trip_id,
      p_passenger_name: parsed.data.passenger_name,
      p_passenger_phone: parsed.data.passenger_phone,
      p_seats: parsed.data.seats,
      p_pickup_address: parsed.data.pickup_address,
      p_dropoff_address: parsed.data.dropoff_address,
      p_note: parsed.data.note ?? null,
    },
  );

  if (rpcError) {
    const mapped = ERROR_MESSAGES[rpcError.message];
    return {
      error: mapped ?? `Đặt chỗ thất bại: ${rpcError.message}`,
    };
  }

  if (!bookingId) {
    return { error: "Đặt chỗ thất bại, vui lòng thử lại" };
  }

  redirect(`/dat-cho-thanh-cong/${bookingId}`);
}
