import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Route = {
  code: string;
  origin: string;
  destination: string;
  base_price: number;
  distance_km: number | null;
};

export default async function TestDbPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("routes")
    .select("code, origin, destination, base_price, distance_km")
    .order("code");

  if (error) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold text-red-600">Lỗi kết nối Supabase</h1>
        <pre className="mt-4 overflow-auto rounded bg-red-50 p-4 text-sm text-red-900">
          {JSON.stringify(error, null, 2)}
        </pre>
      </main>
    );
  }

  const routes = (data ?? []) as Route[];

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">Kết nối Supabase OK</h1>
      <p className="mt-2 text-sm text-gray-600">
        Đã fetch {routes.length} tuyến từ bảng <code>routes</code>.
      </p>
      <ul className="mt-6 divide-y rounded border">
        {routes.map((r) => (
          <li key={r.code} className="flex items-center justify-between p-3">
            <div>
              <div className="font-mono text-sm text-gray-500">{r.code}</div>
              <div className="font-medium">
                {r.origin} → {r.destination}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">
                {r.base_price.toLocaleString("vi-VN")}đ
              </div>
              {r.distance_km !== null && (
                <div className="text-xs text-gray-500">{r.distance_km} km</div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
