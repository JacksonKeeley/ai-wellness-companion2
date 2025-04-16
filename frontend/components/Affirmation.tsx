'use client';
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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