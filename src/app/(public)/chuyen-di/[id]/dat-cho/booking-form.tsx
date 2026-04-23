"use client";

import { Loader2 } from "lucide-react";
import { useActionState, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  createBookingAction,
  type CreateBookingState,
} from "./actions";

const INITIAL_STATE: CreateBookingState = { error: null };

function formatVnd(n: number) {
  return n.toLocaleString("vi-VN");
}

export function BookingForm({
  tripId,
  pricePerSeat,
  availableSeats,
}: {
  tripId: string;
  pricePerSeat: number;
  availableSeats: number;
}) {
  const [state, formAction, isPending] = useActionState(
    createBookingAction,
    INITIAL_STATE,
  );

  const [seats, setSeats] = useState(1);
  const maxSeats = Math.min(availableSeats, 10);
  const total = useMemo(() => seats * pricePerSeat, [seats, pricePerSeat]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="trip_id" value={tripId} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="passenger_name">Họ tên</Label>
        <Input
          id="passenger_name"
          name="passenger_name"
          type="text"
          required
          autoComplete="name"
          minLength={2}
          maxLength={80}
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="passenger_phone">Số điện thoại</Label>
        <Input
          id="passenger_phone"
          name="passenger_phone"
          type="tel"
          required
          autoComplete="tel"
          pattern="^(0|\+84)\d{8,10}$"
          placeholder="0912 345 678"
        />
        <p className="text-xs text-muted-foreground">
          Tài xế sẽ liên hệ qua số này trước giờ khởi hành.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="seats">Số ghế</Label>
        <Input
          id="seats"
          name="seats"
          type="number"
          required
          min={1}
          max={maxSeats}
          value={seats}
          onChange={(e) => {
            const n = Number.parseInt(e.target.value, 10);
            if (!Number.isNaN(n)) setSeats(Math.min(Math.max(n, 1), maxSeats));
          }}
        />
        <p className="text-xs text-muted-foreground">
          Còn {availableSeats} ghế trống
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="pickup_address">Điểm đón</Label>
        <Input
          id="pickup_address"
          name="pickup_address"
          type="text"
          required
          minLength={3}
          maxLength={200}
          placeholder="Số 10, đường Lê Lợi, TP Thái Bình"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="dropoff_address">Điểm trả</Label>
        <Input
          id="dropoff_address"
          name="dropoff_address"
          type="text"
          required
          minLength={3}
          maxLength={200}
          placeholder="Số 100, đường Nguyễn Trãi, Quận Thanh Xuân, Hà Nội"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="note">Ghi chú (tuỳ chọn)</Label>
        <textarea
          id="note"
          name="note"
          rows={2}
          maxLength={500}
          placeholder="Ví dụ: mang theo 1 vali lớn, có trẻ em đi cùng..."
          className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 text-sm">
        <div className="flex items-center justify-between">
          <span>
            {seats} ghế × {formatVnd(pricePerSeat)}đ
          </span>
          <span className="text-lg font-bold text-primary">
            {formatVnd(total)}đ
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Thanh toán bằng tiền mặt khi lên xe. Không thu trước.
        </p>
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
        disabled={isPending || availableSeats < 1}
        className="h-12 text-base"
      >
        {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Xác nhận đặt chỗ
      </Button>
    </form>
  );
}
