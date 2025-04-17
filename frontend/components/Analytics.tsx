'use client';
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AnalyticsItem = { route: string; count: number };

export default function Analytics() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [analytics, setAnalytics] = useState<AnalyticsItem[] | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/analytics`)
      .then(res => res.json())
      .then(data => setAnalytics(data.usage))    // usage is now AnalyticsItem[]
      .catch(() => setAnalytics(null));
  }, [API_URL]);

  return (
    <Card className="bg-white/60 backdrop-blur rounded-2xl shadow-md border border-[#D0C9E1]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-[#575C75]">
          📊 API Usage Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-700">
        {analytics ? (
          <ul className="list-disc list-inside">
            {analytics.map(({ route, count }) => (
              <li key={route}>
                <strong>{route}:</strong> {count} request{count !== 1 && 's'}
              </li>
            ))}
          </ul>
        ) : (
          <p>Failed to load analytics.</p>
        )}
      </CardContent>
    </Card>
  );
}
