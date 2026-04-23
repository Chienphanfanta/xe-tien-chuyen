"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";

import type { TripStatus } from "@/types/database";

import {
  updateTripStatusAction,
  type UpdateTripStatusState,
} from "./actions";

const INITIAL_STATE: UpdateTripStatusState = { error: null };

const PRIMARY_TRANSITION: Partial<Record<TripStatus, { label: string; to: TripStatus }>> = {
  scheduled: { label: "Bắt đầu đón khách", to: "boarding" },
  boarding: { label: "Khởi hành", to: "in_progress" },
  in_progress: { label: "Hoàn thành chuyến", to: "completed" },
};

export function StatusActions({
  tripId,
  status,
}: {
  tripId: string;
  status: TripStatus;
}) {
  const [state, formAction, isPending] = useActionState(
    updateTripStatusAction,
    INITIAL_STATE,
  );

  if (status === "completed" || status === "cancelled") {
    return null;
  }

  const primary = PRIMARY_TRANSITION[status];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-5 sm:p-6">
      <h2 className="text-base font-semibold">Điều hành chuyến</h2>

      {state.error && (
        <p
          role="alert"
          className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        {primary && (
          <form action={formAction} className="flex-1">
            <input type="hidden" name="trip_id" value={tripId} />
            <input type="hidden" name="next_status" value={primary.to} />
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
            >
              {isPending && (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              )}
              {primary.label}
            </button>
          </form>
        )}

        <form
          action={formAction}
          className="sm:w-auto"
          onSubmit={(e) => {
            if (!confirm("Huỷ chuyến này? Thao tác không thể hoàn tác.")) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="trip_id" value={tripId} />
          <input type="hidden" name="next_status" value="cancelled" />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-destructive/40 px-5 text-sm font-semibold text-destructive transition hover:bg-destructive/10 disabled:opacity-60 sm:w-auto"
          >
            Huỷ chuyến
          </button>
        </form>
      </div>
    </div>
  );
}
