import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Activity, AlertTriangle, TrendingUp, Zap } from "lucide-react";

interface Metrics {
  transactions: number;
  fraud_count: number;
  detection_rate: number | null;
  avg_latency_ms: number | null;
  avg_risk_score: number | null;
  anomaly_count: number;
  throughput_tps: number;
}

const LiveStats = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("get-metrics", {
        body: {},
      });

      if (error) throw error;
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const stats = [
    {
      title: "Total Transactions",
      value: metrics.transactions.toLocaleString(),
      icon: Activity,
      color: "text-primary",
    },
    {
      title: "Fraud Detected",
      value: metrics.fraud_count.toLocaleString(),
      icon: AlertTriangle,
      color: "text-destructive",
      subtitle: metrics.detection_rate ? `${metrics.detection_rate.toFixed(1)}% rate` : undefined,
    },
    {
      title: "Avg Risk Score",
      value: metrics.avg_risk_score ? `${(metrics.avg_risk_score * 100).toFixed(1)}%` : "N/A",
      icon: TrendingUp,
      color: "text-chart-2",
    },
    {
      title: "Avg Latency",
      value: metrics.avg_latency_ms ? `${metrics.avg_latency_ms.toFixed(1)}ms` : "N/A",
      icon: Zap,
      color: "text-chart-3",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default LiveStats;
