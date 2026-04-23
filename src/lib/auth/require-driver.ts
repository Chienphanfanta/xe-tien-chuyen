import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type DriverSession = {
  userId: string;
  email: string | null;
  fullName: string | null;
  driverId: string;
  status: "pending_verification" | "verified" | "suspended";
  rating: number | null;
  totalTrips: number;
};

export async function requireDriver(): Promise<DriverSession> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/driver");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "driver") {
    await supabase.auth.signOut();
    redirect("/login?error=not_driver");
  }

  const { data: driver } = await supabase
    .from("drivers")
    .select("id, status, rating, total_trips")
    .eq("profile_id", user.id)
    .single();

  if (!driver) {
    await supabase.auth.signOut();
    redirect("/login?error=no_driver_record");
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    fullName: profile.full_name,
    driverId: driver.id,
    status: driver.status,
    rating: driver.rating,
    totalTrips: driver.total_trips,
  };
}
