import { ensureAlert } from './alertUtils';

export interface DieselRecordData {
  id: string;
  trip_number?: string;
  vehicle_identifier?: string;
  driver_name?: string;
  litres_consumed?: number;
  total_km?: number;
  km_per_litre?: number;
  fleet_number?: string;
  date?: string;
  fuel_station?: string;
  litres_filled?: number;
  total_cost?: number;
  currency?: 'ZAR' | 'USD';
  distance_travelled?: number;
  probe_discrepancy?: number;
  debrief_signed?: boolean;
  debrief_notes?: string;
}

export interface DieselAlertMetadata {
  diesel_record_id: string;
  trip_number?: string;
  fleet_number?: string;
  driver_name?: string;
  date?: string;
  km_per_litre?: number;
  probe_discrepancy?: number;
  litres_filled?: number;
  distance_travelled?: number;
  issue_type: 'low_efficiency' | 'probe_discrepancy' | 'missing_debrief' | 'high_consumption';
  threshold?: number;
  actual_value?: number;
  expected_value?: number;
}

/**
 * Create an alert for low fuel efficiency
 */
export async function createLowEfficiencyAlert(
  dieselRecord: DieselRecordData,
  efficiency: number,
  threshold: number = 2.0
) {
  const severity = efficiency < 1.5 ? 'critical' : efficiency < 2.0 ? 'high' : 'medium';

  return ensureAlert({
    sourceType: 'fuel',
    sourceId: dieselRecord.id,
    sourceLabel: `Diesel: ${dieselRecord.fleet_number || dieselRecord.vehicle_identifier || 'Unknown'}`,
    category: 'fuel_anomaly',
    severity,
    title: `Low Fuel Efficiency Detected`,
    message: `${dieselRecord.fleet_number || dieselRecord.vehicle_identifier} achieved ${efficiency.toFixed(2)} km/L, below threshold of ${threshold} km/L`,
    fleetNumber: dieselRecord.fleet_number,
    metadata: {
      diesel_record_id: dieselRecord.id,
      trip_number: dieselRecord.trip_number,
      fleet_number: dieselRecord.fleet_number,
      driver_name: dieselRecord.driver_name,
      date: dieselRecord.date,
      km_per_litre: efficiency,
      litres_filled: dieselRecord.litres_filled,
      distance_travelled: dieselRecord.distance_travelled,
      issue_type: 'low_efficiency',
      threshold,
      actual_value: efficiency,
      expected_value: threshold,
    },
  });
}

/**
 * Create an alert for probe discrepancy
 */
export async function createProbeDiscrepancyAlert(
  dieselRecord: DieselRecordData,
  discrepancy: number,
  threshold: number = 5.0
) {
  const severity = discrepancy > 10 ? 'critical' : discrepancy > 7 ? 'high' : 'medium';

  return ensureAlert({
    sourceType: 'fuel',
    sourceId: dieselRecord.id,
    sourceLabel: `Diesel: ${dieselRecord.fleet_number || dieselRecord.vehicle_identifier || 'Unknown'}`,
    category: 'fuel_anomaly',
    severity,
    title: `Fuel Probe Discrepancy Detected`,
    message: `${dieselRecord.fleet_number || dieselRecord.vehicle_identifier} has ${discrepancy.toFixed(1)}% discrepancy between expected and actual fuel consumption`,
    fleetNumber: dieselRecord.fleet_number,
    metadata: {
      diesel_record_id: dieselRecord.id,
      trip_number: dieselRecord.trip_number,
      fleet_number: dieselRecord.fleet_number,
      driver_name: dieselRecord.driver_name,
      date: dieselRecord.date,
      probe_discrepancy: discrepancy,
      litres_filled: dieselRecord.litres_filled,
      distance_travelled: dieselRecord.distance_travelled,
      issue_type: 'probe_discrepancy',
      threshold,
      actual_value: discrepancy,
      expected_value: threshold,
    },
  });
}

/**
 * Create an alert for missing debrief
 */
export async function createMissingDebriefAlert(
  dieselRecord: DieselRecordData,
  daysOld: number
) {
  const severity = daysOld > 7 ? 'high' : daysOld > 3 ? 'medium' : 'low';

  return ensureAlert({
    sourceType: 'fuel',
    sourceId: dieselRecord.id,
    sourceLabel: `Diesel: ${dieselRecord.fleet_number || dieselRecord.vehicle_identifier || 'Unknown'}`,
    category: 'fuel_anomaly',
    severity,
    title: `Diesel Record Missing Debrief`,
    message: `${dieselRecord.fleet_number || dieselRecord.vehicle_identifier} diesel record from ${dieselRecord.date} has not been debriefed for ${daysOld} days`,
    fleetNumber: dieselRecord.fleet_number,
    metadata: {
      diesel_record_id: dieselRecord.id,
      trip_number: dieselRecord.trip_number,
      fleet_number: dieselRecord.fleet_number,
      driver_name: dieselRecord.driver_name,
      date: dieselRecord.date,
      days_old: daysOld,
      issue_type: 'missing_debrief',
    },
  });
}

/**
 * Create an alert for high fuel consumption
 */
export async function createHighConsumptionAlert(
  dieselRecord: DieselRecordData,
  litresFilled: number,
  distanceTravelled: number,
  expectedConsumption?: number
) {
  const consumptionRate = distanceTravelled > 0 ? litresFilled / distanceTravelled * 100 : 0; // L/100km
  const severity = consumptionRate > 50 ? 'critical' : consumptionRate > 40 ? 'high' : 'medium';

  return ensureAlert({
    sourceType: 'fuel',
    sourceId: dieselRecord.id,
    sourceLabel: `Diesel: ${dieselRecord.fleet_number || dieselRecord.vehicle_identifier || 'Unknown'}`,
    category: 'fuel_anomaly',
    severity,
    title: `High Fuel Consumption Detected`,
    message: `${dieselRecord.fleet_number || dieselRecord.vehicle_identifier} consumed ${litresFilled.toFixed(1)}L for ${distanceTravelled.toFixed(1)}km (${consumptionRate.toFixed(1)}L/100km)`,
    fleetNumber: dieselRecord.fleet_number,
    metadata: {
      diesel_record_id: dieselRecord.id,
      trip_number: dieselRecord.trip_number,
      fleet_number: dieselRecord.fleet_number,
      driver_name: dieselRecord.driver_name,
      date: dieselRecord.date,
      litres_filled: litresFilled,
      distance_travelled: distanceTravelled,
      consumption_rate: consumptionRate,
      expected_consumption: expectedConsumption,
      issue_type: 'high_consumption',
    },
  });
}