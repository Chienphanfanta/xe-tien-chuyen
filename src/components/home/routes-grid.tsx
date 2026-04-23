import { ArrowRight, Clock, MapPin } from "lucide-react";

import type { Route } from "@/types/database";

export type HomeRoute = Pick<
  Route,
  | "code"
  | "origin"
  | "destination"
  | "distance_km"
  | "duration_minutes"
  | "base_price"
>;

function formatVnd(value: number) {
  return value.toLocaleString("vi-VN");
}

function formatDuration(minutes: number | null) {
  if (minutes === null) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h${m}`;
  if (h) return `${h}h`;
  return `${m} phút`;
}

export function RoutesGrid({ routes }: { routes: HomeRoute[] }) {
  return (
    <section
      id="tuyen"
      className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20"
    >
      <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm">
            Tuyến cố định
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {routes.length} tuyến đang chạy
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Giá niêm yết đã bao gồm đón tại nhà trong nội thành và phí cầu đường
            cơ bản.
          </p>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {routes.map((r) => (
          <li key={r.code}>
            <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition hover:border-primary/60 hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex rounded-md bg-secondary/10 px-2 py-0.5 font-mono text-xs font-semibold tracking-wider text-secondary">
                  {r.code}
                </span>
                <span className="text-right text-lg font-bold text-foreground">
                  {formatVnd(r.base_price)}
                  <span className="ml-0.5 text-xs font-medium text-muted-foreground">
                    đ
                  </span>
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-1 text-sm sm:text-base">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="size-3.5 text-muted-foreground" aria-hidden />
                  {r.origin}
                </span>
                <span className="ml-[0.2rem] flex items-center text-muted-foreground">
                  <ArrowRight className="size-3.5" aria-hidden />
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="size-3.5 text-muted-foreground" aria-hidden />
                  {r.destination}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground sm:text-sm">
                {r.distance_km !== null && (
                  <div className="flex items-center gap-1">
                    <span className="sr-only">Cự ly</span>
                    <span>{r.distance_km} km</span>
                  </div>
                )}
                {r.duration_minutes !== null && (
                  <div className="flex items-center gap-1">
                    <span className="sr-only">Thời gian</span>
                    <Clock className="size-3.5" aria-hidden />
                    <span>{formatDuration(r.duration_minutes)}</span>
                  </div>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
