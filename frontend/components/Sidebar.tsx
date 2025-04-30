'use client';
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Motivation() {
  const [quote, setQuote] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:4000/motivation")
      .then(res => res.json())
      .then(data => setQuote(data.message))
      .catch(() => setQuote("Failed to load motivation."));
  }, []);

  return (
    <Card className="bg-white/60 backdrop-blur rounded-2xl shadow-md border border-[#D0C9E1] flex-1 min-w-[280px]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#575C75]">🌟 Motivation</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base text-slate-700">{quote}</p>
      </CardContent>
    </Card>
  );
}

export default function Affirmation() {
  const [affirmation, setAffirmation] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:4000/affirmation")
      .then(res => res.json())
      .then(data => setAffirmation(data.affirmation))
      .catch(() => setAffirmation("Failed to load affirmation."));
  }, []);

  return (
    <Card className="bg-white/60 backdrop-blur rounded-2xl shadow-md border border-[#D0C9E1] flex-1 min-w-[280px]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#575C75]">💬 Daily Affirmation</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base text-slate-700">{affirmation}</p>
      </CardContent>
    </Card>
  );
}

type BreathingData = {
  step1: string;
  step2: string;
  step3: string;
  repeat: string;
};

export default function BreathingExercise() {
  const [exercise, setExercise] = useState<BreathingData | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/breathing")
      .then(res => res.json())
      .then(data => setExercise(data.exercise))
      .catch(() => setExercise(null));
  }, []);

  return (
    <Card className="bg-white/60 backdrop-blur rounded-2xl shadow-md border border-[#D0C9E1]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-[#575C75]">🧘 Breathing Exercise</CardTitle>
      </CardHeader>
      <CardContent className="text-base text-slate-700">
        {exercise ? (
          <ol className="list-decimal list-inside space-y-1">
            <li>{exercise.step1}</li>
            <li>{exercise.step2}</li>
            <li>{exercise.step3}</li>
            <li>{exercise.repeat}</li>
          </ol>
        ) : (
          <p>Failed to load breathing exercise.</p>
        )}
      </CardContent>
    </Card>
  );
}

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