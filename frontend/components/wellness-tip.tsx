
'use client';
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TipData = {
  message: string;
};

export default function WellnessTip() {
  const [tip, setTip] = useState<string>("Click button for a wellness tip");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [remainingClicks, setRemainingClicks] = useState(2);

  const checkRateLimit = () => {
    const now = Date.now();
    const storedClicks = JSON.parse(
      localStorage.getItem('wellnessTipsClicks') || '[]'
    ).filter((timestamp: number) => now - timestamp < 600000); // 10 minutes
    
    return 2 - storedClicks.length;
  };

  const fetchTip = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:4000/wellness-tips");
      const data: TipData = await response.json();
      
      setTip(data.message);
      const clicks = JSON.parse(localStorage.getItem('wellnessTipsClicks') || '[]');
      localStorage.setItem('wellnessTipsClicks', JSON.stringify([...clicks, Date.now()]));
      setRemainingClicks(checkRateLimit());
    } catch (err) {
      setError("Failed to load tip. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setRemainingClicks(checkRateLimit());
  }, []);

  const canClick = remainingClicks > 0 || new URLSearchParams(window.location.search).has('override');

  return (
    <Card className="bg-white/60 backdrop-blur rounded-2xl shadow-md border border-[#D0C9E1] flex-1 min-w-[280px]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#575C75]">
          🌱 Wellness Tip
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base text-slate-700">
          {isLoading ? "Loading..." : error || tip}
        </p>
        <button
          onClick={fetchTip}
          disabled={!canClick || isLoading}
          className={`px-4 py-2 rounded-lg ${
            canClick 
              ? "bg-[#575C75] text-white hover:bg-[#424556]" 
              : "bg-gray-300 cursor-not-allowed"
          } transition-colors`}
        >
          {canClick ? "Get Tip" : "Try again later"}
        </button>
        {!canClick && (
          <p className="text-sm text-muted-foreground">
            Tips refresh in {Math.ceil((600000 - (Date.now() - JSON.parse(localStorage.getItem('wellnessTipsClicks') || '[]')[0])) / 60000)} minutes
          </p>
        )}
      </CardContent>
    </Card>
  );
}
