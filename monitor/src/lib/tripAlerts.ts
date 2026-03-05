import { ensureAlert } from './alertUtils';

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

/**
 * Alert for duplicate POD numbers
 */
export async function createDuplicatePODAlert(
  podNumber: string,
  count: number,
  tripIds: string[],
  context?: Partial<TripAlertContext>
) {
  return ensureAlert({
    sourceType: 'system',
    sourceId: podNumber,
    sourceLabel: `POD: ${podNumber}`,
    category: 'duplicate_pod',
    severity: 'medium',
    title: 'Duplicate POD Number Detected',
    message: `POD number ${podNumber} is used in ${count} active trips`,
    metadata: {
      pod_number: podNumber,
      duplicate_count: count,
      trip_ids: tripIds,
      issue_type: 'duplicate_pod',
      ...(context?.fleetNumber && { fleet_number: context.fleetNumber }),
      ...(context?.driverName && { driver_name: context.driverName }),
      ...(context?.clientName && { client_name: context.clientName }),
      resolved: false,
    },
  });
}

/**
 * Alert for missing base revenue
 */
export async function createMissingRevenueAlert(
  tripId: string,
  tripNumber: string,
  context?: Partial<TripAlertContext>
) {
  return ensureAlert({
    sourceType: 'trip',
    sourceId: tripId,
    sourceLabel: `Trip: ${tripNumber}`,
    category: 'load_exception',
    severity: 'medium',
    title: 'Missing Base Revenue',
    message: `Trip ${tripNumber} has no base revenue set. This affects profit calculations.`,
    metadata: {
      trip_id: tripId,
      trip_number: tripNumber,
      issue_type: 'missing_revenue',
      ...(context?.fleetNumber && { fleet_number: context.fleetNumber }),
      ...(context?.driverName && { driver_name: context.driverName }),
      ...(context?.clientName && { client_name: context.clientName }),
      resolved: false,
    },
  });
}

/**
 * Alert for flagged costs that need investigation
 */
export async function createFlaggedCostAlert(
  tripId: string,
  tripNumber: string,
  flaggedCount: number,
  costDetails?: Array<{ amount: number; description?: string; reason?: string }>,
  context?: Partial<TripAlertContext>
) {
  return ensureAlert({
    sourceType: 'trip',
    sourceId: tripId,
    sourceLabel: `Trip: ${tripNumber}`,
    category: 'fuel_anomaly',
    severity: 'high',
    title: 'Flagged Costs Require Investigation',
    message: `Trip ${tripNumber} has ${flaggedCount} flagged cost${flaggedCount > 1 ? 's' : ''} that need review`,
    metadata: {
      trip_id: tripId,
      trip_number: tripNumber,
      issue_type: 'flagged_costs',
      flagged_count: flaggedCount,
      cost_details: costDetails,
      ...(context?.fleetNumber && { fleet_number: context.fleetNumber }),
      ...(context?.driverName && { driver_name: context.driverName }),
      resolved: false,
    },
  });
}

/**
 * Alert for trips with no costs recorded
 */
export async function createNoCostsAlert(
  tripId: string,
  tripNumber: string,
  daysInProgress?: number,
  context?: Partial<TripAlertContext>
) {
  const severity = daysInProgress && daysInProgress > 7 ? 'high' : 'medium';

  return ensureAlert({
    sourceType: 'trip',
    sourceId: tripId,
    sourceLabel: `Trip: ${tripNumber}`,
    category: 'load_exception',
    severity,
    title: 'No Costs Recorded',
    message: daysInProgress && daysInProgress > 7
      ? `Trip ${tripNumber} has been in progress for ${daysInProgress} days with no costs recorded`
      : `Trip ${tripNumber} has no costs recorded`,
    metadata: {
      trip_id: tripId,
      trip_number: tripNumber,
      issue_type: 'no_costs',
      days_in_progress: daysInProgress,
      ...(context?.fleetNumber && { fleet_number: context.fleetNumber }),
      ...(context?.driverName && { driver_name: context.driverName }),
      resolved: false,
    },
  });
}

/**
 * Alert for long-running trips (over 14 days)
 */
export async function createLongRunningTripAlert(
  tripId: string,
  tripNumber: string,
  daysInProgress: number,
  context?: Partial<TripAlertContext>
) {
  return ensureAlert({
    sourceType: 'trip',
    sourceId: tripId,
    sourceLabel: `Trip: ${tripNumber}`,
    category: 'trip_delay',
    severity: daysInProgress > 21 ? 'critical' : 'high',
    title: 'Long Running Trip Detected',
    message: `Trip ${tripNumber} has been in progress for ${daysInProgress} days`,
    metadata: {
      trip_id: tripId,
      trip_number: tripNumber,
      issue_type: 'long_running',
      days_in_progress: daysInProgress,
      ...(context?.fleetNumber && { fleet_number: context.fleetNumber }),
      ...(context?.driverName && { driver_name: context.driverName }),
      ...(context?.clientName && { client_name: context.clientName }),
      resolved: false,
    },
  });
}

/**
 * Alert for payment status issues
 */
export async function createPaymentStatusAlert(
  tripId: string,
  tripNumber: string,
  paymentStatus: string,
  revenue?: number,
  context?: Partial<TripAlertContext>
) {
  if (paymentStatus === 'paid') return null; // No alert for paid trips

  const severity = paymentStatus === 'unpaid' && revenue && revenue > 10000 ? 'high' : 'medium';

  return ensureAlert({
    sourceType: 'trip',
    sourceId: tripId,
    sourceLabel: `Trip: ${tripNumber}`,
    category: 'load_exception',
    severity,
    title: `Payment ${paymentStatus === 'unpaid' ? 'Overdue' : 'Partially Paid'}`,
    message: paymentStatus === 'unpaid'
      ? `Trip ${tripNumber} is unpaid${revenue ? ` (${formatCurrency(revenue, context?.revenueCurrency)})` : ''}`
      : `Trip ${tripNumber} is only partially paid`,
    metadata: {
      trip_id: tripId,
      trip_number: tripNumber,
      issue_type: 'payment_status',
      payment_status: paymentStatus,
      revenue_amount: revenue,
      ...(context?.fleetNumber && { fleet_number: context.fleetNumber }),
      ...(context?.clientName && { client_name: context.clientName }),
      resolved: false,
    },
  });
}

/**
 * Alert for flagged trips that need review
 */
export async function createFlaggedTripAlert(
  tripId: string,
  tripNumber: string,
  reason: string,
  context?: Partial<TripAlertContext>
) {
  return ensureAlert({
    sourceType: 'trip',
    sourceId: tripId,
    sourceLabel: `Trip: ${tripNumber}`,
    category: 'load_exception',
    severity: 'high',
    title: 'Trip Flagged for Review',
    message: `Trip ${tripNumber} has been flagged: ${reason}`,
    fleetNumber: context?.fleetNumber,
    metadata: {
      trip_id: tripId,
      trip_number: tripNumber,
      issue_type: 'flagged_trip',
      flag_reason: reason,
      ...(context?.fleetNumber && { fleet_number: context.fleetNumber }),
      ...(context?.driverName && { driver_name: context.driverName }),
      ...(context?.clientName && { client_name: context.clientName }),
      is_flagged: true,
      needs_review: true,
      resolved: false,
    },
  });
}

// Helper function for currency formatting in alerts
function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}