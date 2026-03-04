import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { useAlertTrend } from "@/hooks/useAnalytics";
import type { AlertFilters } from "@/types";

interface AlertTrendChartProps {
  filters: AlertFilters;
}

const SERIES = [
  { key: "critical", color: "#ef4444", label: "Critical" },
  { key: "high",     color: "#f97316", label: "High" },
  { key: "medium",   color: "#f59e0b", label: "Medium" },
  { key: "low",      color: "#3b82f6", label: "Low" },
] as const;

export default function AlertTrendChart({ filters }: AlertTrendChartProps) {
  const { data, isLoading } = useAlertTrend(filters);

  if (isLoading) {
    return <div className="h-64 bg-muted animate-pulse rounded-lg" />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
        No data for selected period
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <defs>
          {SERIES.map(({ key, color }) => (
            <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 22%)" />
        <XAxis
          dataKey="period"
          tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(222 47% 14%)",
            border: "1px solid hsl(222 47% 22%)",
            borderRadius: "8px",
            color: "hsl(213 31% 91%)",
            fontSize: 12,
          }}
          labelStyle={{ fontWeight: 600, marginBottom: 4 }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          formatter={(value) => (
            <span style={{ color: "hsl(215 20% 65%)" }}>{value}</span>
          )}
        />
        {SERIES.map(({ key, color, label }) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            name={label}
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${key})`}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
