'use client';
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type JournalEntry = {
  id: string;
  entry: string;
  mood?: string;
  timestamp: string;
};

type Emotion = {
  label: string;
  score: number;
};

export default function SmartJournal() {
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [emotionResult, setEmotionResult] = useState<Emotion[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("journalEntries");
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  const saveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry.trim()) return;
    const newEntry = {
      id: uuidv4(),
      entry,
      mood,
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem("journalEntries", JSON.stringify(updated));
    setEntry("");
    setMood("");
    analyzeEmotion(newEntry.entry);
  };

  const analyzeEmotion = async (text: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/emotion-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const json = await res.json();
      setEmotionResult(json.analysis[0] || []);
    } catch {
      setEmotionResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur rounded-2xl shadow-md border border-[#D0C9E1]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-[#575C75]">📓 SmartJournal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={saveEntry} className="space-y-4">
          <Textarea
            placeholder="Write your thoughts..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="text-base"
          />
          <Input
            placeholder="Mood (optional)"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="text-base"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Add Entry"}
          </Button>
        </form>


        {emotionResult && (
          <div className="mt-6">
            <div className="rounded-xl p-4 shadow-inner bg-white/70 backdrop-blur border border-[#D0C9E1]">
              <h3 className="text-lg font-semibold text-[#575C75] mb-2">AI Emotion Analysis</h3>
              <div className="space-y-2">
                {emotionResult.map((e) => {
                  const colorMap: Record<string, string> = {
                    joy: 'bg-lime-100 text-lime-800',
                    sadness: 'bg-blue-100 text-blue-800',
                    anger: 'bg-red-100 text-red-800',
                    fear: 'bg-violet-100 text-violet-800',
                    love: 'bg-pink-100 text-pink-800',
                    surprise: 'bg-yellow-100 text-yellow-800',
                    neutral: 'bg-gray-100 text-gray-800',
                  };
                  const fillMap: Record<string, string> = {
                    joy: 'bg-lime-400',
                    sadness: 'bg-blue-400',
                    anger: 'bg-red-400',
                    fear: 'bg-violet-400',
                    love: 'bg-pink-400',
                    surprise: 'bg-yellow-300',
                    neutral: 'bg-gray-400',
                  };
                  const colorClass = colorMap[e.label.toLowerCase()] || 'bg-slate-100 text-slate-800';
                  const fillClass = fillMap[e.label.toLowerCase()] || 'bg-slate-400';
                  return (
                    <div key={e.label} className={`rounded-lg p-3 ${colorClass}`}>
                      <div className="flex justify-between mb-1 font-medium">
                        <span>{e.label.toUpperCase()}</span>
                        <span>{(e.score * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-3 shadow-inner overflow-hidden">
                        <div className={` ${fillClass} h-3 transition-all duration-300 ease-out`} style={{ width: `${(e.score * 100).toFixed(1)}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}


        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Previous Entries</h3>
          <ul className="space-y-2">
            {entries.map((e) => (
              <li key={e.id} className="p-2 rounded-md bg-white shadow-sm">
                <p className="text-sm text-muted-foreground mb-1">
                  {e.mood && <span><strong>Mood:</strong> {e.mood} — </span>}
                  {new Date(e.timestamp).toLocaleString()}
                </p>
                <p className="whitespace-pre-wrap text-slate-800">{e.entry}</p>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}