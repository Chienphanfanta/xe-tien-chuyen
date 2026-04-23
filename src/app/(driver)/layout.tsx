import { DriverHeader } from "@/components/driver/driver-header";
import { requireDriver } from "@/lib/auth/require-driver";

export default async function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const driver = await requireDriver();

  return (
    <div className="flex min-h-dvh flex-col bg-muted/30">
      <DriverHeader driver={driver} />
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}
