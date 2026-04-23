import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";

import { logoutAction } from "@/app/(auth)/login/actions";
import { SITE } from "@/constants/site";
import type { DriverSession } from "@/lib/auth/require-driver";

export function DriverHeader({ driver }: { driver: DriverSession }) {
  const initials = (driver.fullName ?? driver.email ?? "T")
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link href="/driver" className="flex items-center gap-2 min-w-0">
          <span
            aria-hidden
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold"
          >
            XT
          </span>
          <span className="hidden sm:inline text-base font-semibold">
            {SITE.shortName} · Tài xế
          </span>
        </Link>

        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span
              aria-hidden
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-xs font-semibold text-secondary"
            >
              {initials || "T"}
            </span>
            <div className="hidden text-right text-sm sm:block min-w-0">
              <div className="truncate font-medium">
                {driver.fullName ?? driver.email ?? "Tài xế"}
              </div>
              {driver.status === "verified" && (
                <div className="flex items-center justify-end gap-0.5 text-xs text-brand-success">
                  <ShieldCheck className="size-3" aria-hidden />
                  Đã xác minh
                </div>
              )}
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              aria-label="Đăng xuất"
              className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <LogOut className="size-4" aria-hidden />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
