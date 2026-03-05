import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useFaultCounts() {
  return useQuery({
    queryKey: ["fault-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_faults")
        .select("severity, status")
        .in("status", ["identified", "acknowledged"]);

      if (error) throw error;

      const counts = {
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        identified: 0,
        acknowledged: 0,
      };

      data?.forEach((fault) => {
        counts.total++;

        if (fault.severity === "critical") counts.critical++;
        else if (fault.severity === "high") counts.high++;
        else if (fault.severity === "medium") counts.medium++;
        else if (fault.severity === "low") counts.low++;

        if (fault.status === "identified") counts.identified++;
        else if (fault.status === "acknowledged") counts.acknowledged++;
      });

      return counts;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}