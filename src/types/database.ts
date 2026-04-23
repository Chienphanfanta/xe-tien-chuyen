import type { Database } from "./supabase";

export type { Database };

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];

export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];

export type Enums<T extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][T];

export type FunctionArgs<T extends keyof PublicSchema["Functions"]> =
  PublicSchema["Functions"][T]["Args"];

export type FunctionReturns<T extends keyof PublicSchema["Functions"]> =
  PublicSchema["Functions"][T]["Returns"];

// Convenience row aliases — use these instead of repeating `Tables<"...">`.
export type Profile = Tables<"profiles">;
export type Route = Tables<"routes">;
export type Driver = Tables<"drivers">;
export type Vehicle = Tables<"vehicles">;
export type Trip = Tables<"trips">;
export type Booking = Tables<"bookings">;
export type Review = Tables<"reviews">;

export type TripStatus = Enums<"trip_status">;
export type BookingStatus = Enums<"booking_status">;
export type DriverStatus = Enums<"driver_status">;
export type UserRole = Enums<"user_role">;
