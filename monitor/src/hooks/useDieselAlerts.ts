import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  createLowEfficiencyAlert,
  createProbeDiscrepancyAlert,
  createMissingDebriefAlert,
  createHighConsumptionAlert,
  DieselRecordData,
} from '@/lib/dieselAlerts';

interface DieselRecord extends DieselRecordData {
  id: string;
  created_at?: string;
}

export function useDieselAlerts(enabled: boolean = true) {
  const processedRecords = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;

    const checkDieselRecords = async () => {
      const { data: records, error } = await supabase
        .from('diesel_records') // Fixed: using correct table name
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching diesel records:', error);
        return;
      }

      const today = new Date();

      for (const record of (records as DieselRecord[] || [])) {
        // Skip if already processed
        if (processedRecords.current.has(record.id)) continue;

        // Check for missing debrief
        if (!record.debrief_signed && record.date) {
          const recordDate = new Date(record.date);
          const daysOld = Math.ceil((today.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));

          if (daysOld >= 1) { // Alert after 1 day
            await createMissingDebriefAlert(record, daysOld);
          }
        }

        // Check for low efficiency
        if (record.km_per_litre && record.km_per_litre < 2.0) {
          await createLowEfficiencyAlert(record, record.km_per_litre);
        }

        // Check for probe discrepancy
        if (record.probe_discrepancy && record.probe_discrepancy > 5.0) {
          await createProbeDiscrepancyAlert(record, record.probe_discrepancy);
        }

        // Check for high consumption
        if (record.litres_filled && record.distance_travelled && record.distance_travelled > 0) {
          const consumptionPer100km = (record.litres_filled / record.distance_travelled) * 100;
          if (consumptionPer100km > 35) { // >35L/100km is high
            await createHighConsumptionAlert(record, record.litres_filled, record.distance_travelled);
          }
        }

        processedRecords.current.add(record.id);
      }
    };

    // Initial check
    checkDieselRecords();

    // Set up realtime subscription for new diesel records
    const subscription = supabase
      .channel('diesel-records-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'diesel_records', // Fixed: using correct table name
        },
        async (payload) => {
          const newRecord = payload.new as DieselRecord;
          if (!processedRecords.current.has(newRecord.id)) {
            processedRecords.current.add(newRecord.id);

            // Check the new record for issues
            if (!newRecord.debrief_signed && newRecord.date) {
              const recordDate = new Date(newRecord.date);
              const daysOld = Math.ceil((new Date().getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
              if (daysOld >= 1) {
                await createMissingDebriefAlert(newRecord, daysOld);
              }
            }

            if (newRecord.km_per_litre && newRecord.km_per_litre < 2.0) {
              await createLowEfficiencyAlert(newRecord, newRecord.km_per_litre);
            }

            if (newRecord.probe_discrepancy && newRecord.probe_discrepancy > 5.0) {
              await createProbeDiscrepancyAlert(newRecord, newRecord.probe_discrepancy);
            }

            if (newRecord.litres_filled && newRecord.distance_travelled && newRecord.distance_travelled > 0) {
              const consumptionPer100km = (newRecord.litres_filled / newRecord.distance_travelled) * 100;
              if (consumptionPer100km > 35) {
                await createHighConsumptionAlert(newRecord, newRecord.litres_filled, newRecord.distance_travelled);
              }
            }
          }
        }
      )
      .subscribe();

    // Run check every hour to catch new records and updated debriefs
    const interval = setInterval(checkDieselRecords, 60 * 60 * 1000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [enabled]);
}