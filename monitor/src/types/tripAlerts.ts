export interface TripAlertContext {
  tripId: string;
  tripNumber: string;
  fleetNumber?: string;
  driverName?: string;
  clientName?: string;
  departureDate?: string;
  revenueCurrency?: string;
}

export interface TripAlertMetadata {
  trip_id: string;
  trip_number: string;
  issue_type: 'duplicate_pod' | 'missing_revenue' | 'flagged_costs' | 'no_costs' | 'long_running' | 'payment_status' | 'flagged_trip';
  fleet_number?: string;
  driver_name?: string;
  client_name?: string;
  duplicate_count?: number;
  flagged_count?: number;
  days_in_progress?: number;
  payment_status?: string;
  revenue_amount?: number;
  flag_reason?: string;
  is_flagged?: boolean;
  needs_review?: boolean;
}