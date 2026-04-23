import { Clock, MapPin, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[#c54d1f] text-primary-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_25%_20%,white_0,transparent_45%),radial-gradient(circle_at_80%_80%,white_0,transparent_45%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur sm:text-sm">
          <span className="size-1.5 rounded-full bg-white" />
          Đang hoạt động tại Thái Bình
        </p>

        <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Xe ghép liên tỉnh{" "}
          <span className="block text-white/95">
            Thái Bình ↔ Hà Nội, Nội Bài, Hải Phòng, Cát Bi
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-base text-white/90 sm:text-lg">
          Đặt chỗ trong 2 phút. Giá cố định, xe đón tận nhà, tài xế xác minh.
          Không phát sinh phụ phí.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#tuyen"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-primary shadow-lg transition hover:bg-white/95 sm:h-13 sm:text-base"
          >
            Xem 8 tuyến đang chạy
          </a>
          <a
            href="#cach-hoat-dong"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-6 text-sm font-semibold text-white transition hover:bg-white/10 sm:h-13 sm:text-base"
          >
            Cách đặt xe
          </a>
        </div>

        <dl className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-3">
          <HeroFeature icon={MapPin} label="Đón tận nhà" />
          <HeroFeature icon={Clock} label="Đúng giờ khởi hành" />
          <HeroFeature icon={ShieldCheck} label="Tài xế xác minh" />
        </dl>
      </div>
    </section>
  );
}

function HeroFeature({
  icon: Icon,
  label,
}: {
  icon: typeof MapPin;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
      <Icon className="size-5 text-white" aria-hidden />
      <span className="text-sm font-medium sm:text-base">{label}</span>
    </div>
  );
}
