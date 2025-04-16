import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JournalSummary({ entries }: { entries: any[] }) {
  const count = entries.length;
  return (
    <Card className="bg-white/60 rounded-2xl shadow-md mt-2">
      <CardHeader><CardTitle className="text-xl font-semibold text-[#575C75] mb-0">Journal Insights</CardTitle></CardHeader>
      <CardContent className="pt-0">
        <p className="text-base text-slate-700">Total Entries: {count}</p>
      </CardContent>
    </Card>
  );
}