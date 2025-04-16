'use client';
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Analytics() {
  const [analytics, setAnalytics] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/analytics")
      .then(res => res.json())
      .then(data => setAnalytics(data.usage))
      .catch(() => setAnalytics(null));
  }, []);

  return (
    <Card className="bg-white/60 backdrop-blur rounded-2xl shadow-md border border-[#D0C9E1]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-[#575C75]">📊 API Usage Analytics</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-700">
        {analytics ? (
          <ul className="list-disc list-inside">
            {Object.entries(analytics).map(([route, count]) => (
              <li key={route}>
                <strong>{route}:</strong> {count} request(s)
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