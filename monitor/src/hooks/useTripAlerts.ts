import { useEffect, useRef } from 'react';
import {
  createDuplicatePODAlert,
  createMissingRevenueAlert,
  createFlaggedCostAlert,
  createNoCostsAlert,
  createLongRunningTripAlert,
  createPaymentStatusAlert,
  createFlaggedTripAlert,
} from '@/lib/tripAlerts';
import { TripAlertContext } from '@/types/tripAlerts';

// Define proper types for JSON fields
interface DelayReason {
  reason: string;
  date?: string;
  duration_hours?: number;
  [key: string]: unknown;
}

interface CompletionValidation {
  validated_at?: string;
  validated_by?: string;
  flags_checked?: boolean;
  unresolved_flags?: number;
  [key: string]: unknown;
}

interface EditHistoryEntry {
  edited_at: string;
  edited_by: string;
  changes: Record<string, unknown>;
  [key: string]: unknown;
}

// Define proper types for costs
interface Cost {
  amount: number;
  description?: string;
  is_flagged?: boolean;
  investigation_status?: string;
}

interface AdditionalCost {
  amount: number;
  description?: string;
}

interface Trip {
  id: string;
  trip_number: string;
  fleet_number?: string;
  driver_name?: string;
  client_name?: string;
  base_revenue?: number;
  revenue_currency?: string;
  payment_status?: string;
  hasFlaggedCosts?: boolean;
  flaggedCostCount?: number;
  hasNoCosts?: boolean;
  daysInProgress?: number;
  costs?: Cost[];
  additional_costs?: AdditionalCost[];
  departure_date?: string;
  // Fields that can indicate a flagged trip - properly typed
  validation_notes?: string | null;
  delay_reasons?: DelayReason[] | null;
  completion_validation?: CompletionValidation | null;
  edit_history?: EditHistoryEntry[] | null;
  hasIssues?: boolean;
}

interface UseTripAlertsOptions {
  enabled?: boolean;
  onAlertCreated?: (alertId: string, type: string) => void;
  batchSize?: number; // Number of trips to process per batch
  delayBetweenBatches?: number; // Delay in ms between batches
}

export function useTripAlerts(trips: Trip[], options: UseTripAlertsOptions = {}) {
  const {
    enabled = true,
    onAlertCreated,
    batchSize = 10, // Process 10 trips at a time
    delayBetweenBatches = 500 // Wait 500ms between batches
  } = options;

  const processedAlerts = useRef<Set<string>>(new Set());
  const processingRef = useRef(false);

  useEffect(() => {
    if (!enabled || !trips.length || processingRef.current) return;

    const checkTripsForAlerts = async () => {
      processingRef.current = true;

      // Track duplicate PODs
      const podCounts: Record<string, { count: number; tripIds: string[]; contexts: TripAlertContext[] }> = {};

      // Process trips in batches to prevent overwhelming the browser
      for (let i = 0; i < trips.length; i += batchSize) {
        const batch = trips.slice(i, i + batchSize);

        // Process each trip in the current batch
        for (const trip of batch) {
          // Build context for alerts
          const context: TripAlertContext = {
            tripId: trip.id,
            tripNumber: trip.trip_number,
            fleetNumber: trip.fleet_number,
            driverName: trip.driver_name,
            clientName: trip.client_name,
            departureDate: trip.departure_date,
            revenueCurrency: trip.revenue_currency,
          };

          // Track POD for duplicate detection
          const pod = trip.trip_number;
          if (!podCounts[pod]) {
            podCounts[pod] = { count: 0, tripIds: [], contexts: [] };
          }
          podCounts[pod].count++;
          podCounts[pod].tripIds.push(trip.id);
          podCounts[pod].contexts.push(context);

          // Check for missing revenue
          if (!trip.base_revenue || trip.base_revenue === 0) {
            const alertKey = `missing-revenue-${trip.id}`;
            if (!processedAlerts.current.has(alertKey)) {
              processedAlerts.current.add(alertKey);
              try {
                await createMissingRevenueAlert(trip.id, trip.trip_number, context);
                onAlertCreated?.('', 'missing_revenue');
              } catch (error) {
                console.error('Error creating missing revenue alert:', error);
              }
            }
          }

          // Check for flagged costs
          if (trip.hasFlaggedCosts && trip.flaggedCostCount) {
            const alertKey = `flagged-costs-${trip.id}`;
            if (!processedAlerts.current.has(alertKey)) {
              processedAlerts.current.add(alertKey);
              try {
                await createFlaggedCostAlert(trip.id, trip.trip_number, trip.flaggedCostCount, undefined, context);
                onAlertCreated?.('', 'flagged_costs');
              } catch (error) {
                console.error('Error creating flagged costs alert:', error);
              }
            }
          }

          // Check for no costs
          if (trip.hasNoCosts) {
            const alertKey = `no-costs-${trip.id}`;
            if (!processedAlerts.current.has(alertKey)) {
              processedAlerts.current.add(alertKey);
              try {
                await createNoCostsAlert(trip.id, trip.trip_number, trip.daysInProgress, context);
                onAlertCreated?.('', 'no_costs');
              } catch (error) {
                console.error('Error creating no costs alert:', error);
              }
            }
          }

          // Check for long-running trips
          if (trip.daysInProgress && trip.daysInProgress > 14) {
            const alertKey = `long-running-${trip.id}`;
            if (!processedAlerts.current.has(alertKey)) {
              processedAlerts.current.add(alertKey);
              try {
                await createLongRunningTripAlert(trip.id, trip.trip_number, trip.daysInProgress, context);
                onAlertCreated?.('', 'long_running');
              } catch (error) {
                console.error('Error creating long running alert:', error);
              }
            }
          }

          // Check for payment status issues
          if (trip.payment_status && trip.payment_status !== 'paid') {
            const alertKey = `payment-${trip.id}`;
            if (!processedAlerts.current.has(alertKey)) {
              processedAlerts.current.add(alertKey);
              try {
                await createPaymentStatusAlert(
                  trip.id,
                  trip.trip_number,
                  trip.payment_status,
                  trip.base_revenue,
                  context
                );
                onAlertCreated?.('', 'payment_status');
              } catch (error) {
                console.error('Error creating payment status alert:', error);
              }
            }
          }

          // Check for flagged trips (validation notes, delay reasons, etc.)
          if (trip.validation_notes ||
            (trip.delay_reasons && trip.delay_reasons.length > 0) ||
            trip.completion_validation ||
            (trip.edit_history && trip.edit_history.length > 0) ||
            trip.hasIssues) {

            const alertKey = `flagged-trip-${trip.id}`;
            if (!processedAlerts.current.has(alertKey)) {
              processedAlerts.current.add(alertKey);

              // Determine reason from available fields
              let reason = 'Trip has been flagged for review';
              if (trip.validation_notes) {
                reason = `Validation notes: ${trip.validation_notes}`;
              } else if (trip.delay_reasons && trip.delay_reasons.length > 0) {
                const delayReason = trip.delay_reasons[0]?.reason || 'Trip has delays';
                reason = delayReason;
              } else if (trip.completion_validation) {
                reason = 'Trip completion requires validation';
              } else if (trip.edit_history && trip.edit_history.length > 0) {
                reason = 'Trip has been edited and needs review';
              }

              try {
                await createFlaggedTripAlert(
                  trip.id,
                  trip.trip_number,
                  reason,
                  context
                );
                onAlertCreated?.('', 'flagged_trip');
              } catch (error) {
                console.error('Error creating flagged trip alert:', error);
              }
            }
          }
        }

        // Wait between batches to prevent overwhelming the browser
        if (i + batchSize < trips.length) {
          await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }
      }

      // Check for duplicate PODs (process separately)
      for (const [pod, { count, tripIds, contexts }] of Object.entries(podCounts)) {
        if (count > 1) {
          const alertKey = `duplicate-pod-${pod}`;
          if (!processedAlerts.current.has(alertKey)) {
            processedAlerts.current.add(alertKey);
            try {
              await createDuplicatePODAlert(pod, count, tripIds, contexts[0]);
              onAlertCreated?.('', 'duplicate_pod');
            } catch (error) {
              console.error('Error creating duplicate POD alert:', error);
            }
          }
        }
      }

      processingRef.current = false;
    };

    checkTripsForAlerts();
  }, [trips, enabled, onAlertCreated, batchSize, delayBetweenBatches]);

  // Return function to manually trigger alert checks
  const refreshAlerts = () => {
    processedAlerts.current.clear();
  };

  return { refreshAlerts };
}