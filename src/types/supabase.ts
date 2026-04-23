// Generated from supabase/migrations/{001,002,003}_*.sql
// To regenerate after schema changes: pnpm db:types
// (requires SUPABASE_ACCESS_TOKEN env var, see .env.example)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          phone: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: Database["public"]["Enums"]["user_role"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          phone?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      routes: {
        Row: {
          code: string;
          origin: string;
          destination: string;
          distance_km: number | null;
          duration_minutes: number | null;
          base_price: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          code: string;
          origin: string;
          destination: string;
          distance_km?: number | null;
          duration_minutes?: number | null;
          base_price: number;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          code?: string;
          origin?: string;
          destination?: string;
          distance_km?: number | null;
          duration_minutes?: number | null;
          base_price?: number;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      drivers: {
        Row: {
          id: string;
          profile_id: string;
          license_number: string;
          license_image_url: string | null;
          id_card_number: string | null;
          id_card_front_url: string | null;
          id_card_back_url: string | null;
          status: Database["public"]["Enums"]["driver_status"];
          rating: number | null;
          total_trips: number;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          license_number: string;
          license_image_url?: string | null;
          id_card_number?: string | null;
          id_card_front_url?: string | null;
          id_card_back_url?: string | null;
          status?: Database["public"]["Enums"]["driver_status"];
          rating?: number | null;
          total_trips?: number;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          license_number?: string;
          license_image_url?: string | null;
          id_card_number?: string | null;
          id_card_front_url?: string | null;
          id_card_back_url?: string | null;
          status?: Database["public"]["Enums"]["driver_status"];
          rating?: number | null;
          total_trips?: number;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "drivers_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      vehicles: {
        Row: {
          id: string;
          driver_id: string;
          license_plate: string;
          brand: string | null;
          model: string | null;
          color: string | null;
          seats: number;
          registration_image_url: string | null;
          insurance_image_url: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          license_plate: string;
          brand?: string | null;
          model?: string | null;
          color?: string | null;
          seats?: number;
          registration_image_url?: string | null;
          insurance_image_url?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          driver_id?: string;
          license_plate?: string;
          brand?: string | null;
          model?: string | null;
          color?: string | null;
          seats?: number;
          registration_image_url?: string | null;
          insurance_image_url?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vehicles_driver_id_fkey";
            columns: ["driver_id"];
            isOneToOne: false;
            referencedRelation: "drivers";
            referencedColumns: ["id"];
          },
        ];
      };
      trips: {
        Row: {
          id: string;
          driver_id: string;
          vehicle_id: string;
          route_code: string;
          departure_time: string;
          total_seats: number;
          available_seats: number;
          price_per_seat: number;
          pickup_note: string | null;
          status: Database["public"]["Enums"]["trip_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          vehicle_id: string;
          route_code: string;
          departure_time: string;
          total_seats: number;
          available_seats: number;
          price_per_seat: number;
          pickup_note?: string | null;
          status?: Database["public"]["Enums"]["trip_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          driver_id?: string;
          vehicle_id?: string;
          route_code?: string;
          departure_time?: string;
          total_seats?: number;
          available_seats?: number;
          price_per_seat?: number;
          pickup_note?: string | null;
          status?: Database["public"]["Enums"]["trip_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trips_driver_id_fkey";
            columns: ["driver_id"];
            isOneToOne: false;
            referencedRelation: "drivers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trips_vehicle_id_fkey";
            columns: ["vehicle_id"];
            isOneToOne: false;
            referencedRelation: "vehicles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trips_route_code_fkey";
            columns: ["route_code"];
            isOneToOne: false;
            referencedRelation: "routes";
            referencedColumns: ["code"];
          },
        ];
      };
      bookings: {
        Row: {
          id: string;
          trip_id: string;
          passenger_id: string;
          seats: number;
          passenger_name: string;
          passenger_phone: string;
          pickup_address: string;
          dropoff_address: string;
          total_price: number;
          status: Database["public"]["Enums"]["booking_status"];
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          passenger_id: string;
          seats?: number;
          passenger_name: string;
          passenger_phone: string;
          pickup_address: string;
          dropoff_address: string;
          total_price: number;
          status?: Database["public"]["Enums"]["booking_status"];
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          passenger_id?: string;
          seats?: number;
          passenger_name?: string;
          passenger_phone?: string;
          pickup_address?: string;
          dropoff_address?: string;
          total_price?: number;
          status?: Database["public"]["Enums"]["booking_status"];
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_passenger_id_fkey";
            columns: ["passenger_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          trip_id: string;
          driver_id: string;
          passenger_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          trip_id: string;
          driver_id: string;
          passenger_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          trip_id?: string;
          driver_id?: string;
          passenger_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: true;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_driver_id_fkey";
            columns: ["driver_id"];
            isOneToOne: false;
            referencedRelation: "drivers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_passenger_id_fkey";
            columns: ["passenger_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: {
      book_seats: {
        Args: {
          p_trip_id: string;
          p_passenger_name: string;
          p_passenger_phone: string;
          p_seats: number;
          p_pickup_address: string;
          p_dropoff_address: string;
          p_note?: string | null;
        };
        Returns: string;
      };
    };
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "paid"
        | "completed"
        | "cancelled"
        | "no_show";
      driver_status: "pending_verification" | "verified" | "suspended";
      trip_status:
        | "scheduled"
        | "boarding"
        | "in_progress"
        | "completed"
        | "cancelled";
      user_role: "passenger" | "driver" | "admin";
    };
    CompositeTypes: Record<never, never>;
  };
};
