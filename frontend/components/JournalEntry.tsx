import { Card, CardContent } from "@/components/ui/card";

export default function JournalEntry({ entry, mood, timestamp }: any) {
  return (
    <Card className="bg-white/60 rounded-2xl shadow-md">
      <CardContent className="p-0 pl-6">
        <p className="text-sm text-muted-foreground">
          {mood && <strong>Mood:</strong>} {mood} — {new Date(timestamp).toLocaleString()}
        </p>
        <p>{entry}</p>
      </CardContent>
    </Card>
  );
}