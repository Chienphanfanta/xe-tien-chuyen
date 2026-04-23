import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { LegalTrust } from "@/components/home/legal-trust";
import { HomeRoute, RoutesGrid } from "@/components/home/routes-grid";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { createClient } from "@/lib/supabase/server";

async function fetchRoutes(): Promise<HomeRoute[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("routes")
    .select("code, origin, destination, distance_km, duration_minutes, base_price")
    .eq("active", true);

  if (error || !data) return [];

  return (data as HomeRoute[]).sort((a, b) => {
    const aOut = a.code.startsWith("TB_");
    const bOut = b.code.startsWith("TB_");
    if (aOut !== bOut) return aOut ? -1 : 1;
    return a.code.localeCompare(b.code);
  });
}

export default async function HomePage() {
  const routes = await fetchRoutes();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <RoutesGrid routes={routes} />
        <HowItWorks />
        <LegalTrust />
      </main>
      <SiteFooter />
    </>
  );
}
