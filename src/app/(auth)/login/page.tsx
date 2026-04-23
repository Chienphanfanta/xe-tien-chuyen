import type { Metadata } from "next";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Đăng nhập tài xế",
};

const ERROR_MESSAGES: Record<string, string> = {
  not_driver:
    "Tài khoản chưa được cấp quyền tài xế. Liên hệ quản trị viên.",
  no_driver_record:
    "Hồ sơ tài xế chưa được tạo. Liên hệ quản trị viên.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const nextPath = next && next.startsWith("/") ? next : null;
  const errorMessage = error ? ERROR_MESSAGES[error] : undefined;

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Đăng nhập tài xế</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dùng email và mật khẩu đã đăng ký với quản trị viên.
          </p>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {errorMessage}
          </p>
        )}

        <LoginForm nextPath={nextPath} />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Khách đặt xe?{" "}
        <a href="/" className="font-medium text-primary hover:underline">
          Quay lại trang chủ
        </a>
      </p>
    </div>
  );
}
