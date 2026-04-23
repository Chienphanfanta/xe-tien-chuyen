import { CarFront, MessageSquareText, Search } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Chọn tuyến & giờ",
    body: "Xem danh sách chuyến đang mở, chọn giờ và số ghế phù hợp.",
  },
  {
    icon: MessageSquareText,
    title: "Xác nhận qua SMS",
    body: "Nhập số điện thoại, nhận mã OTP, xác nhận chỗ trong vài giây.",
  },
  {
    icon: CarFront,
    title: "Tài xế đón tận nơi",
    body: "Lái xe liên hệ trước giờ khởi hành. Thanh toán khi lên xe.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="cach-hoat-dong" className="bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-8 sm:mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm">
            Cách hoạt động
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Đặt xe trong 3 bước
          </h2>
        </div>

        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="relative flex flex-col rounded-2xl border border-border bg-background p-6"
            >
              <span
                aria-hidden
                className="absolute -top-3 left-6 inline-flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
              >
                {i + 1}
              </span>
              <step.icon className="size-8 text-primary" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
