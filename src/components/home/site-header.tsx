import Link from "next/link";
import { Phone } from "lucide-react";

import { HOTLINE_DISPLAY, HOTLINE_TEL, SITE } from "@/constants/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold"
          >
            XT
          </span>
          <span className="text-base font-semibold tracking-tight sm:text-lg">
            {SITE.name}
          </span>
        </Link>

        <a
          href={`tel:${HOTLINE_TEL}`}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:h-11 sm:px-5"
        >
          <Phone className="size-4" aria-hidden />
          <span className="hidden sm:inline">Gọi {HOTLINE_DISPLAY}</span>
          <span className="sm:hidden">Gọi ngay</span>
        </a>
      </div>
    </header>
  );
}
