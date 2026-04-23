import { FileCheck, Phone, ShieldCheck } from "lucide-react";

import { HOTLINE_DISPLAY, HOTLINE_TEL, LEGAL } from "@/constants/site";

export function LegalTrust() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="grid grid-cols-1 gap-6 rounded-3xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm">
            Minh bạch & hợp pháp
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Vận hành đúng quy định pháp luật
          </h2>

          <div className="mt-6 space-y-4 text-sm sm:text-base">
            <div className="flex gap-3">
              <FileCheck
                className="mt-0.5 size-5 shrink-0 text-secondary"
                aria-hidden
              />
              <div>
                <div className="font-semibold">Cơ sở pháp lý</div>
                <div className="mt-0.5 text-muted-foreground">{LEGAL.basis}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <ShieldCheck
                className="mt-0.5 size-5 shrink-0 text-secondary"
                aria-hidden
              />
              <div>
                <div className="font-semibold">Mô hình hoạt động</div>
                <div className="mt-0.5 text-muted-foreground">{LEGAL.model}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-2xl bg-secondary p-6 text-secondary-foreground sm:p-8">
          <p className="text-sm font-medium text-white/80">Hỗ trợ 24/7</p>
          <p className="mt-1 text-xs text-white/70">
            Đặt xe, hỏi tuyến, khiếu nại chuyến
          </p>
          <a
            href={`tel:${HOTLINE_TEL}`}
            className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-bold shadow-lg transition hover:bg-primary/90 sm:h-14 sm:text-lg"
          >
            <Phone className="size-5" aria-hidden />
            {HOTLINE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
