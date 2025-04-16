import { Card, CardContent } from "@/components/ui/card";

export default function EmotionResults({ mood }: { mood: string }) {
  if (!mood) return null;
  return (
    <Card className="mt-4 bg-white/60 backdrop-blur rounded-2xl shadow-md">
      <CardContent>
        <p><strong>Detected Mood:</strong> {mood}</p>
      </CardContent>
    </Card>
  );
}
