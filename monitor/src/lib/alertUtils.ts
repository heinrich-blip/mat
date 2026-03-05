import { supabase } from "@/integrations/supabase/client";

export interface AlertPayload {
  sourceType: string;
  sourceId: string | null;
  sourceLabel: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  fleetNumber?: string | null; // Optional fleet number for better context
}

// Define a type for metadata that can include original_source_id
interface AlertMetadata extends Record<string, unknown> {
  fleet_number?: string;
  created_from: string;
  created_at: string;
  original_source_id?: string;
}

/**
 * Checks if a string is a valid UUID
 */
function isValidUUID(uuid: string | null): boolean {
  if (!uuid) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Ensures an alert exists - either returns existing active alert ID or creates a new one
 * Integrates with Wialon fleet system by optionally adding fleet context to metadata
 */
export async function ensureAlert(payload: AlertPayload): Promise<string> {
  const {
    sourceType,
    sourceId,
    category,
    severity,
    title,
    message,
    metadata = {},
    sourceLabel,
    fleetNumber,
  } = payload;

  // Add fleet context + system metadata
  const enrichedMetadata: AlertMetadata = {
    ...metadata,
    ...(fleetNumber && { fleet_number: fleetNumber }),
    created_from: 'monitor-app',
    created_at: new Date().toISOString(),
  };

  // Store original sourceId in metadata if it's not a valid UUID
  if (sourceId && !isValidUUID(sourceId)) {
    enrichedMetadata.original_source_id = sourceId;
  }

  try {
    // Check if active alert exists
    let query = supabase
      .from('alerts')
      .select('id, status')
      .eq('source_type', sourceType)
      .eq('category', category)
      .eq('status', 'active');

    // Only add source_id filter if it's a valid UUID
    // This prevents errors when sourceId is a string like "30H19/02"
    if (sourceId !== null) {
      if (isValidUUID(sourceId)) {
        query = query.eq('source_id', sourceId);
      } else {
        // For non-UUID sourceIds (like POD numbers), don't filter by source_id
        console.log(`sourceId ${sourceId} is not a UUID, skipping source_id filter in existence check`);
        // We'll rely on source_type + category + status to check for duplicates
      }
    } else {
      query = query.is('source_id', null);
    }

    // Use order and limit to get the most recent alert if multiple exist
    const { data: existingAlerts, error: checkError } = await query
      .order('created_at', { ascending: false })
      .limit(1);

    if (checkError) {
      console.error('Error checking for existing alert:', checkError);
      // Don't throw - continue to create new alert
    }

    // Check if we found any existing alert
    const existing = existingAlerts && existingAlerts.length > 0 ? existingAlerts[0] : null;

    if (existing) {
      console.log(`Active alert already exists for ${sourceType}:${sourceId ?? 'null'} ${category}`);
      return existing.id;
    }

    // Create new alert - handle source_id properly
    const insertData: {
      source_type: string;
      source_id: string | null;
      source_label: string;
      title: string;
      message: string;
      category: string;
      severity: string;
      metadata: AlertMetadata;
      status: 'active';
    } = {
      source_type: sourceType,
      source_id: null,
      source_label: sourceLabel,
      title,
      message,
      category,
      severity,
      metadata: enrichedMetadata,
      status: 'active',
    };

    // Only set source_id if it's a valid UUID
    if (sourceId !== null && isValidUUID(sourceId)) {
      insertData.source_id = sourceId;
    }

    const { data, error } = await supabase
      .from('alerts')
      .insert(insertData)
      .select('id')
      .single();

    if (error) {
      console.error('Failed to create alert:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Alert created but no ID returned');
    }

    console.log(`Created new alert ${data.id} for ${sourceType}:${sourceId ?? 'null'} ${category}`);
    return data.id;
  } catch (err) {
    console.error('Error in ensureAlert:', err);
    throw err;
  }
}

/**
 * Helper function to create vehicle-specific alerts with fleet context
 */
export async function createVehicleAlert(
  vehicleId: string,
  vehicleName: string,
  fleetNumber: string | null,
  severity: AlertPayload['severity'],
  category: string,
  title: string,
  message: string,
  metadata?: Record<string, unknown>
): Promise<string> {
  return ensureAlert({
    sourceType: 'vehicle',
    sourceId: vehicleId,
    sourceLabel: vehicleName,
    category,
    severity,
    title,
    message,
    fleetNumber,
    metadata: {
      ...metadata,
      vehicle_id: vehicleId,
      vehicle_name: vehicleName,
    },
  });
}

/**
 * Helper function to create Wialon-specific vehicle alerts
 */
export async function createWialonVehicleAlert(
  wialonVehicleId: string,
  vehicleName: string,
  fleetNumber: string | null,
  severity: AlertPayload['severity'],
  category: string,
  title: string,
  message: string,
  metadata?: Record<string, unknown>
): Promise<string> {
  return ensureAlert({
    sourceType: 'vehicle', // Using 'vehicle' as source type for consistency
    sourceId: wialonVehicleId,
    sourceLabel: vehicleName,
    category,
    severity,
    title,
    message,
    fleetNumber,
    metadata: {
      ...metadata,
      wialon_vehicle_id: wialonVehicleId,
      vehicle_name: vehicleName,
      source: 'wialon',
    },
  });
}

/**
 * Helper function to create maintenance overdue alerts
 */
export async function createMaintenanceAlert(
  scheduleId: string,
  vehicleId: string,
  vehicleInfo: { fleet_number?: string | null; registration_number?: string },
  title: string,
  description: string | null,
  priority: 'low' | 'medium' | 'high' | 'critical',
  dueDate: string,
  daysOverdue: number
): Promise<string> {
  const severity = priority === 'critical' ? 'critical' :
    priority === 'high' ? 'high' : 'medium';

  const vehicleIdentifier = vehicleInfo.fleet_number || vehicleInfo.registration_number || 'Unknown';

  return ensureAlert({
    sourceType: 'maintenance',
    sourceId: scheduleId,
    sourceLabel: `Maintenance: ${title}`,
    category: 'maintenance_due',
    severity,
    title: `Overdue Maintenance: ${title}`,
    message: `${vehicleIdentifier} - ${daysOverdue} ${daysOverdue === 1 ? 'day' : 'days'} overdue`,
    fleetNumber: vehicleInfo.fleet_number,
    metadata: {
      maintenance_id: scheduleId,
      vehicle_id: vehicleId,
      title,
      description,
      due_date: dueDate,
      days_overdue: daysOverdue,
      priority,
      issue_type: 'overdue_maintenance',
    },
  });
}

/**
 * Helper function to create diesel/fuel alerts
 */
export async function createFuelAlert(
  recordId: string,
  vehicleIdentifier: string,
  fleetNumber: string | null,
  issueType: 'low_efficiency' | 'probe_discrepancy' | 'missing_debrief' | 'high_consumption',
  severity: 'critical' | 'high' | 'medium',
  title: string,
  message: string,
  metadata: Record<string, unknown>
): Promise<string> {
  return ensureAlert({
    sourceType: 'fuel',
    sourceId: recordId,
    sourceLabel: `Fuel: ${vehicleIdentifier}`,
    category: 'fuel_anomaly',
    severity,
    title,
    message,
    fleetNumber,
    metadata: {
      ...metadata,
      issue_type: issueType,
    },
  });
}

/**
 * Helper function to resolve an alert when condition is no longer active
 */
export async function resolveAlert(alertId: string, resolutionNote?: string): Promise<boolean> {
  const { error } = await supabase
    .from('alerts')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      resolution_note: resolutionNote || 'Condition cleared',
    })
    .eq('id', alertId);

  if (error) {
    console.error('Failed to resolve alert:', error);
    throw error;
  }

  console.log(`Resolved alert ${alertId}`);
  return true;
}

/**
 * Helper function to acknowledge an alert
 */
export async function acknowledgeAlert(alertId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('alerts')
    .update({
      status: 'acknowledged',
      acknowledged_by: userId,
      acknowledged_at: new Date().toISOString(),
    })
    .eq('id', alertId);

  if (error) {
    console.error('Failed to acknowledge alert:', error);
    throw error;
  }

  console.log(`Acknowledged alert ${alertId}`);
  return true;
}