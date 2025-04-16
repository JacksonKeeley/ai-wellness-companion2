'use client';
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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