import { HOTLINE_DISPLAY, HOTLINE_TEL, SITE } from "@/constants/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6 sm:py-14">
        <div>
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-flex size-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground"
            >
              XT
            </span>
            <span className="text-base font-semibold">{SITE.name}</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{SITE.tagline}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Liên hệ</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              Hotline:{" "}
              <a
                href={`tel:${HOTLINE_TEL}`}
                className="font-semibold text-foreground hover:text-primary"
              >
                {HOTLINE_DISPLAY}
              </a>
            </li>
            <li>Email: hotro@xetienchuyen.vn</li>
            <li>Địa chỉ: TP Thái Bình, tỉnh Thái Bình</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Quy định</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Điều khoản sử dụng</li>
            <li>Chính sách bảo mật</li>
            <li>Hoàn / huỷ chuyến</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} {SITE.name}. Nền tảng kết nối vận tải.
      </div>
    </footer>
  );
}
