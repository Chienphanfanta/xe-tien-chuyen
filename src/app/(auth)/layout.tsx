import Link from "next/link";

import { SITE } from "@/constants/site";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-foreground"
      >
        <span
          aria-hidden
          className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold"
        >
          XT
        </span>
        <span className="text-base font-semibold">{SITE.name}</span>
      </Link>
      {children}
    </main>
  );
}
