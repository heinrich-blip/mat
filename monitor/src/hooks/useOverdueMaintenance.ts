import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getVehicleLatestKm } from '@/lib/maintenanceKmTracking';

export interface OverdueMaintenanceItem {
  id: string;
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical';
  due_date: string;
  interval_km: number | null;
  last_odometer: number | null;
  current_odometer: number | null;
  vehicle_id: string | null;
  assigned_to: string | null;
  service_type: string | null;
  vehicles?: {
    fleet_number: string | null;
    registration_number: string;
    make: string;
    model: string;
  } | null;
}

// Define the raw schedule type from the database
interface RawMaintenanceSchedule {
  id: string;
  vehicle_id: string | null;
  service_type: string | null;
  next_due_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  title: string | null;
  description: string | null;
  priority: string | null;
  assigned_to: string | null;
  odometer_interval_km: number | null;
  last_odometer_reading: number | null;
}

interface VehicleInfo {
  id: string;
  fleet_number: string | null;
  registration_number: string;
  make: string;
  model: string;
}

export function useOverdueMaintenance() {
  return useQuery({
    queryKey: ['overdue-maintenance'],
    queryFn: async () => {
      const today = new Date().toISOString();

      // SIMPLE QUERY - NO JOIN
      const { data: schedules, error } = await supabase
        .from('maintenance_schedules')
        .select('*')
        .eq('is_active', true)
        .lt('next_due_date', today)
        .order('priority', { ascending: false });

      if (error) {
        console.error('Error fetching overdue maintenance:', error);
        throw error;
      }

      if (!schedules || schedules.length === 0) {
        return [];
      }

      // Cast to our type
      const typedSchedules = schedules as RawMaintenanceSchedule[];

      // Get unique vehicle IDs
      const vehicleIds = typedSchedules
        .map(s => s.vehicle_id)
        .filter((id): id is string => id !== null);

      // Fetch vehicle data separately
      let vehiclesMap: Record<string, VehicleInfo> = {};

      if (vehicleIds.length > 0) {
        const { data: vehicles, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('id, fleet_number, registration_number, make, model')
          .in('id', vehicleIds);

        if (vehiclesError) {
          console.error('Error fetching vehicles:', vehiclesError);
        } else if (vehicles) {
          vehiclesMap = vehicles.reduce((acc, v) => {
            acc[v.id] = v;
            return acc;
          }, {} as Record<string, VehicleInfo>);
        }
      }

      // Fetch latest odometer readings
      const odometerMap = await getVehicleLatestKm(vehicleIds);

      // Sort schedules by priority
      const sortedSchedules = [...typedSchedules].sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const aPriority = a.priority ? priorityOrder[a.priority as keyof typeof priorityOrder] || 0 : 0;
        const bPriority = b.priority ? priorityOrder[b.priority as keyof typeof priorityOrder] || 0 : 0;

        if (bPriority !== aPriority) {
          return bPriority - aPriority;
        }

        return new Date(a.next_due_date).getTime() - new Date(b.next_due_date).getTime();
      });

      // Combine data
      const overdueMaintenance: OverdueMaintenanceItem[] = sortedSchedules.map(schedule => {
        const vehicle = schedule.vehicle_id ? vehiclesMap[schedule.vehicle_id] : null;

        return {
          id: schedule.id,
          title: schedule.service_type || schedule.title || 'Maintenance',
          description: schedule.description ?? null,
          priority: (schedule.priority as 'low' | 'medium' | 'high' | 'critical') || 'medium',
          due_date: schedule.next_due_date,
          interval_km: schedule.odometer_interval_km,
          last_odometer: schedule.last_odometer_reading,
          current_odometer: schedule.vehicle_id ? odometerMap[schedule.vehicle_id] || null : null,
          vehicle_id: schedule.vehicle_id,
          assigned_to: schedule.assigned_to ?? null,
          service_type: schedule.service_type ?? null,
          vehicles: vehicle ? {
            fleet_number: vehicle.fleet_number,
            registration_number: vehicle.registration_number,
            make: vehicle.make,
            model: vehicle.model,
          } : null,
        };
      });

      return overdueMaintenance;
    },
    refetchInterval: 5 * 60 * 1000,
  });
}