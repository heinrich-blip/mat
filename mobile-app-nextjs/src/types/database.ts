export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// User profile from the users table
export interface UserProfile {
  user_id: number;
  name: string;
  username: string;
  shortcode: string;
  email?: string | null;
  phone?: string | null;
  role_id: number | null;
  status: string;
  avatar_url?: string | null;
  role?: string | null; // Joined from roles table
  full_name?: string | null; // Alias for name (backward compatibility)
}

// Keep Profile as an alias for backward compatibility
export type Profile = UserProfile;

// Driver document types
export type DriverDocumentType = 'license' | 'pdp' | 'passport' | 'medical' | 'retest' | 'defensive_driving';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: number;
          name: string;
          username: string;
          shortcode: string;
          email: string | null;
          phone: string | null;
          role_id: number | null;
          status: string;
          avatar_url: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          name: string;
          username: string;
          shortcode: string;
          email?: string | null;
          phone?: string | null;
          role_id?: number | null;
          status?: string;
          avatar_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          role?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      vehicles: {
        Row: {
          id: string;
          fleet_number: string;
          registration_number: string;
          make: string | null;
          model: string | null;
          vehicle_type: string | null;
          tonnage: number | null;
          active: boolean | null;
          current_driver_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          fleet_number: string;
          registration_number: string;
          make?: string | null;
          model?: string | null;
          vehicle_type?: string | null;
          tonnage?: number | null;
          active?: boolean | null;
          current_driver_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          fleet_number?: string;
          registration_number?: string;
          make?: string | null;
          model?: string | null;
          vehicle_type?: string | null;
          tonnage?: number | null;
          active?: boolean | null;
          current_driver_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      diesel_entries: {
        Row: {
          id: string;
          vehicle_id: string;
          driver_id: string | null;
          date: string;
          odometer_reading: number;
          litres: number;
          cost: number | null;
          cost_per_litre: number | null;
          station: string | null;
          notes: string | null;
          fleet_number: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          driver_id?: string | null;
          date: string;
          odometer_reading: number;
          litres: number;
          cost?: number | null;
          cost_per_litre?: number | null;
          station?: string | null;
          notes?: string | null;
          fleet_number?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          driver_id?: string | null;
          date?: string;
          odometer_reading?: number;
          litres?: number;
          cost?: number | null;
          cost_per_litre?: number | null;
          station?: string | null;
          notes?: string | null;
          fleet_number?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      freight_entries: {
        Row: {
          id: string;
          vehicle_id: string;
          driver_id: string | null;
          date: string;
          customer: string | null;
          origin: string | null;
          destination: string | null;
          weight_tonnes: number | null;
          revenue: number | null;
          notes: string | null;
          status: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          driver_id?: string | null;
          date: string;
          customer?: string | null;
          origin?: string | null;
          destination?: string | null;
          weight_tonnes?: number | null;
          revenue?: number | null;
          notes?: string | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          driver_id?: string | null;
          date?: string;
          customer?: string | null;
          origin?: string | null;
          destination?: string | null;
          weight_tonnes?: number | null;
          revenue?: number | null;
          notes?: string | null;
          status?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      cost_entries: {
        Row: {
          id: string;
          trip_id: string | null;
          category: string;
          sub_category: string | null;
          amount: number;
          currency: string;
          reference_number: string | null;
          date: string;
          notes: string | null;
          is_flagged: boolean;
          is_system_generated: boolean;
          flag_reason: string | null;
          investigation_notes: string | null;
          investigation_status: string | null;
          resolved_at: string | null;
          resolved_by: string | null;
          diesel_record_id: string | null;
          vehicle_identifier: string | null;
          driver_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          trip_id?: string | null;
          category: string;
          sub_category?: string | null;
          amount: number;
          currency?: string;
          reference_number?: string | null;
          date: string;
          notes?: string | null;
          is_flagged?: boolean;
          is_system_generated?: boolean;
          flag_reason?: string | null;
          investigation_notes?: string | null;
          investigation_status?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          diesel_record_id?: string | null;
          vehicle_identifier?: string | null;
          driver_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          trip_id?: string | null;
          category?: string;
          sub_category?: string | null;
          amount?: number;
          currency?: string;
          reference_number?: string | null;
          date?: string;
          notes?: string | null;
          is_flagged?: boolean;
          is_system_generated?: boolean;
          flag_reason?: string | null;
          investigation_notes?: string | null;
          investigation_status?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          diesel_record_id?: string | null;
          vehicle_identifier?: string | null;
          driver_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      trips: {
        Row: {
          id: string;
          trip_number: string;
          vehicle_id: string | null;
          driver_name: string | null;
          driver_id: string | null;
          client_name: string | null;
          origin: string | null;
          destination: string | null;
          route: string | null;
          departure_date: string | null;
          arrival_date: string | null;
          status: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          trip_number: string;
          vehicle_id?: string | null;
          driver_name?: string | null;
          driver_id?: string | null;
          client_name?: string | null;
          origin?: string | null;
          destination?: string | null;
          route?: string | null;
          departure_date?: string | null;
          arrival_date?: string | null;
          status?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          trip_number?: string;
          vehicle_id?: string | null;
          driver_name?: string | null;
          driver_id?: string | null;
          client_name?: string | null;
          origin?: string | null;
          destination?: string | null;
          route?: string | null;
          departure_date?: string | null;
          arrival_date?: string | null;
          status?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      driver_documents: {
        Row: {
          id: string;
          driver_id: string;
          document_type: DriverDocumentType;
          document_number: string | null;
          expiry_date: string | null;
          file_url: string | null;
          file_path: string | null;
          file_name: string | null;
          file_size: number | null;
          mime_type: string | null;
          uploaded_by: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          driver_id: string;
          document_type: DriverDocumentType;
          document_number?: string | null;
          expiry_date?: string | null;
          file_url?: string | null;
          file_path?: string | null;
          file_name?: string | null;
          file_size?: number | null;
          mime_type?: string | null;
          uploaded_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          driver_id?: string;
          document_type?: DriverDocumentType;
          document_number?: string | null;
          expiry_date?: string | null;
          file_url?: string | null;
          file_path?: string | null;
          file_name?: string | null;
          file_size?: number | null;
          mime_type?: string | null;
          uploaded_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      driver_document_type: DriverDocumentType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Helper types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Common types used across the app
export type Vehicle = Tables<"vehicles">;
export type DieselEntry = Tables<"diesel_entries">;
export type FreightEntry = Tables<"freight_entries">;
export type CostEntry = Tables<"cost_entries">;
export type DriverDocument = Tables<"driver_documents">;
export type Trip = Tables<"trips">;