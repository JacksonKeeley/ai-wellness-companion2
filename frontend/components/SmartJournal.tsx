"use client";

import { useState, useEffect } from "react";
import JournalEntry from "@/components/JournalEntry";
import EmotionResults from "@/components/EmotionResults";
import JournalSummary from "@/components/JournalSummary";
import { getMoodSuggestion } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SmartJournal() {
  const [entries, setEntries] = useState<any[]>([]);
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("journalEntries");
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry.trim()) return;
    const newEntry = { entry, mood, timestamp: new Date().toISOString() };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem("journalEntries", JSON.stringify(updated));
    setEntry("");
    setMood("");
  };

  return (
    <Card className="bg-white/60 backdrop-blur rounded-2xl shadow-md border border-[#D0C9E1]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-[#575C75]">📓 SmartJournal</CardTitle>
      </CardHeader>
      <CardContent className="">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Textarea
            placeholder="Write your thoughts..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
          />
          <Input
            placeholder="Mood (optional)"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />
          <Button type="submit" className="w-fit self-start bg-gray-700 text-white rounded-md mt-3 mb-5 px-10">
            Add Entry
          </Button>
        </form>
        <EmotionResults mood={mood} />
        <JournalSummary entries={entries} />
        <div className="mt-4 space-y-2">
          {entries.map((e, i) => <JournalEntry key={i} {...e} />)}
        </div>
      </CardContent>
    </Card>
  );
}
