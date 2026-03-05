import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDieselCounts() {
  return useQuery({
    queryKey: ["diesel-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("status, severity")
        .eq("category", "fuel_anomaly");

      if (error) throw error;

      const counts = {
        total: data?.length || 0,
        active: data?.filter(a => a.status === 'active').length || 0,
        critical: data?.filter(a => a.severity === 'critical').length || 0,
        high: data?.filter(a => a.severity === 'high').length || 0,
        medium: data?.filter(a => a.severity === 'medium').length || 0,
      };

      return counts;
    },
    refetchInterval: 30000,
  });
}