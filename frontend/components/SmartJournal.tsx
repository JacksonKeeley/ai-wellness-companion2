'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';

type JournalEntry = {
  id: number;
  entry: string;
  mood: string | null;
  timestamp: string;
  user_id: number;
  emotions?: Emotion[];
};

type Emotion = {
  label: string;
  score: number;
};

export default function SmartJournal() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [emotionResult, setEmotionResult] = useState<Emotion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/journal_entries`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const payload = await res.json();
        console.log('🎯 raw journal entries:', payload);
        const list = payload.entries;
        if (!Array.isArray(list)) throw new Error('entries is not an array');
        setEntries(
          list.map((e: any) => ({
            id: e.id,
            entry: e.entry,
            mood: e.mood,
            timestamp: e.timestamp,
            user_id: e.user_id,
            emotions: e.emotions || [],
          }))
        );
      } catch (err) {
        console.error('Failed to load entries:', err);
        setEntries([]);
      }
    }
    load();
  }, [API_URL]);  

  // Inside your component...
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const selectEntry = async (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setEmotionResult(entry.emotions || []);
  };

  const saveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/journal_entries`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  
        },
        body: JSON.stringify({ text: entry, mood }),
      });
      const rec = await res.json();
      const newEntry: JournalEntry = {
        id: rec.id,
        entry: rec.text,
        mood: rec.mood,
        timestamp: rec.created_at,
        user_id: rec.user_id,
        emotions: rec.emotions || []
      };

      // Add the new entry and set as selected
      setEntries([newEntry, ...entries]);
      setSelectedEntry(newEntry);

      // Analyze and update emotions immediately after adding
      await analyzeEmotion(newEntry.id, newEntry.entry);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeEmotion = async (entryId: number, text: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/emotion-analysis`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ entryId, text }),
      });
      const { analysis } = await res.json();

      const flat: Emotion[] = Array.isArray(analysis[0])
        ? (analysis as any[]).flat()
        : (analysis as any[]);

      setEmotionResult(flat);

      // Update emotions in entries list
      setEntries(prevEntries =>
        prevEntries.map(entry =>
          entry.id === entryId ? { ...entry, emotions: flat } : entry
        )
      );
    } catch (err) {
      console.error("Emotion analysis error:", err);
      setEmotionResult(null);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Card className="bg-white/60 backdrop-blur rounded-2xl shadow-md border border-[#D0C9E1]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-[#575C75]">
          📓 SmartJournal
        </CardTitle>
      </CardHeader>
      <CardContent className="text-base text-slate-700">
        {/* entry form */}
        <form onSubmit={saveEntry} className="space-y-4">
          <Textarea
            placeholder="Write your thoughts..."
            value={entry}
            onChange={e => setEntry(e.target.value)}
            className="shadow-sm border"
          />
          <Input
            placeholder="Mood (optional)"
            value={mood}
            onChange={e => setMood(e.target.value)}
            className="shadow-sm border"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Add Entry"}
          </Button>
        </form>

        {/* emotion panel */}
        {emotionResult && (
          <div className="mt-6">
            <div className="rounded-xl p-4 shadow-inner bg-white/70 backdrop-blur border border-[#D0C9E1]">
              <h3 className="text-lg font-semibold text-[#575C75] mb-2">
                AI Emotion Analysis
              </h3>
              <div className="space-y-2">
                {emotionResult.slice(0, 5).map((e) => {
                  const colorMap: Record<string, string> = {
                    gratitude: "bg-amber-100 text-amber-800",
                    embarrassment: "bg-rose-100 text-rose-800",
                    excitement: "bg-fuchsia-100 text-fuchsia-800",
                    anger: "bg-red-100 text-red-800",
                    nervousness: "bg-yellow-100 text-yellow-800",
                    grief: "bg-slate-100 text-slate-800",
                    caring: "bg-pink-100 text-pink-800",
                    realization: "bg-indigo-100 text-indigo-800",
                    pride: "bg-purple-100 text-purple-800",
                    confusion: "bg-cyan-100 text-cyan-800",
                    amusement: "bg-orange-100 text-orange-800",
                    joy: "bg-lime-100 text-lime-800",
                    surprise: "bg-yellow-100 text-yellow-800",
                    disgust: "bg-green-100 text-green-800",
                    admiration: "bg-teal-100 text-teal-800",
                    sadness: "bg-blue-100 text-blue-800",
                    remorse: "bg-zinc-100 text-zinc-800",
                    relief: "bg-emerald-100 text-emerald-800",
                    approval: "bg-sky-100 text-sky-800",
                    fear: "bg-violet-100 text-violet-800",
                    curiosity: "bg-cyan-100 text-cyan-800",
                    disappointment: "bg-indigo-100 text-indigo-800",
                    neutral: "bg-gray-100 text-gray-800",
                    disapproval: "bg-red-100 text-red-800",
                    love: "bg-pink-100 text-pink-800",
                    annoyance: "bg-orange-100 text-orange-800",
                    desire: "bg-rose-100 text-rose-800",
                    optimism: "bg-amber-100 text-amber-800",
                  };

                  const fillMap: Record<string, string> = {
                    gratitude: "bg-amber-400",
                    embarrassment: "bg-rose-400",
                    excitement: "bg-fuchsia-400",
                    anger: "bg-red-400",
                    nervousness: "bg-yellow-400",
                    grief: "bg-slate-400",
                    caring: "bg-pink-400",
                    realization: "bg-indigo-400",
                    pride: "bg-purple-400",
                    confusion: "bg-cyan-400",
                    amusement: "bg-orange-400",
                    joy: "bg-lime-400",
                    surprise: "bg-yellow-300",
                    disgust: "bg-green-400",
                    admiration: "bg-teal-400",
                    sadness: "bg-blue-400",
                    remorse: "bg-zinc-400",
                    relief: "bg-emerald-400",
                    approval: "bg-sky-400",
                    fear: "bg-violet-400",
                    curiosity: "bg-cyan-400",
                    disappointment: "bg-indigo-400",
                    neutral: "bg-gray-400",
                    disapproval: "bg-red-400",
                    love: "bg-pink-400",
                    annoyance: "bg-orange-400",
                    desire: "bg-rose-400",
                    optimism: "bg-amber-400",
                  };
                  const lc = e.label.toLowerCase();
                  return (
                    <div key={lc} className={`rounded-lg p-3 ${colorMap[lc] || "bg-slate-100 text-slate-800"}`}>
                      <div className="flex justify-between mb-1 font-medium">
                        <span>{e.label.toUpperCase()}</span>
                        <span>{(e.score * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-3 shadow-inner overflow-hidden">
                        <div
                          className={`${fillMap[lc] || "bg-slate-400"} h-3 transition-all duration-300 ease-out`}
                          style={{ width: `${(e.score * 100).toFixed(1)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* entries list */}
        {entries.length != 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Previous Entries</h3>
            <ul className="space-y-2">
              {entries
                .filter((e) => e.user_id === user?.userId)
                .map((e) => (
                  <li
                    key={e.id}
                    className={`p-2 rounded-md cursor-pointer ${
                      selectedEntry?.id === e.id ? 'bg-slate-200' : 'bg-white'
                    } shadow-sm`}
                    onClick={() => selectEntry(e)}
                  >
                    <p className="text-sm text-muted-foreground mb-1">
                      {e.mood && (
                        <>
                          <strong>Mood:</strong> {e.mood} —{' '}
                        </>
                      )}
                      {new Date(e.timestamp).toLocaleString()}
                    </p>
                    <p className="whitespace-pre-wrap text-slate-800">{e.entry}</p>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}