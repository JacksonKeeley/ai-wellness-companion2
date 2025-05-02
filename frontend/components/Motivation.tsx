'use client';
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Motivation() {
  const [quote, setQuote] = useState("Loading...");

  const fetchQuote = () => {
    setQuote("Loading...");
    fetch("http://localhost:4000/motivation")
      .then((res) => res.json())
      .then((data) => setQuote(data.message))
      .catch(() => setQuote("Failed to load motivation."));
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <Card className="bg-white/60 backdrop-blur rounded-2xl shadow-md border border-[#D0C9E1] flex-1 min-w-[280px]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#575C75]">🌟 Motivation</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base text-slate-700 mb-4">{quote}</p>
        <button
          onClick={fetchQuote}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Refresh
        </button>
      </CardContent>
    </Card>
  );
}
