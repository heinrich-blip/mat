import { useEffect, useRef } from 'react';
import { ensureAlert } from '@/lib/alertUtils';
import { useOverdueMaintenance } from './useOverdueMaintenance';

export function useMaintenanceAlerts(enabled: boolean = true) {
  const { data: overdueMaintenance } = useOverdueMaintenance();
  const alertedItems = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled || !overdueMaintenance?.length) return;

    const createMaintenanceAlerts = async () => {
      for (const item of overdueMaintenance) {
        const alertKey = `maintenance-${item.id}`;

        if (!alertedItems.current.has(alertKey)) {
          const daysOverdue = Math.ceil(
            (new Date().getTime() - new Date(item.due_date).getTime()) / (1000 * 60 * 60 * 24)
          );

          const severity =
            daysOverdue > 7 ? 'critical' :
              daysOverdue > 3 ? 'high' : 'medium';

          const vehicleInfo = item.vehicles
            ? `${item.vehicles.fleet_number || item.vehicles.registration_number}`
            : 'Unknown vehicle';

          await ensureAlert({
            sourceType: 'maintenance',
            sourceId: item.id,
            sourceLabel: `Maintenance: ${item.title}`,
            category: 'maintenance_due',
            severity,
            title: `Overdue Maintenance: ${item.title}`,
            message: `${vehicleInfo} - ${daysOverdue} ${daysOverdue === 1 ? 'day' : 'days'} overdue`,
            fleetNumber: item.vehicles?.fleet_number,
            metadata: {
              maintenance_id: item.id,
              title: item.title,
              due_date: item.due_date,
              days_overdue: daysOverdue,
              vehicle_id: item.vehicle_id,
              fleet_number: item.vehicles?.fleet_number,
              registration: item.vehicles?.registration_number,
              priority: item.priority,
              issue_type: 'overdue_maintenance',
            },
          });

          alertedItems.current.add(alertKey);
        }
      }
    };

    createMaintenanceAlerts();

    // Clean up old alerts from the Set periodically
    const cleanup = setInterval(() => {
      alertedItems.current.clear();
    }, 60 * 60 * 1000); // Clear every hour

    return () => clearInterval(cleanup);
  }, [enabled, overdueMaintenance]);
}