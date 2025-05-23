'use client';
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Card2Gen { //Common method to generating cards (Affirmation and Motivation)
    title: string; //Text on box
    fetchUrl: string; //URL that produces output
    fallbackMessage: string; //Error message if output not found
    responseField?: string; //Optional field to specify response field
}

export default function CardGen({ title, fetchUrl, fallbackMessage, responseField = "message" }: Card2Gen) {
  const [message, setMessage] = useState("Loading..."); 
  
  const fetchMessage = () => { //Get messages from Affirmation or Motivation
    setMessage("Loading...");
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => setMessage(data.message || data[responseField] || fallbackMessage)) // Response field gets message. This is a catch-all.
      .catch(() => setMessage(fallbackMessage));
  };

  useEffect(() => {
    fetchMessage();
  }, []);
  
  return (
    <Card className="bg-white/60 backdrop-blur rounded-2xl shadow-md border border-[#D0C9E1] flex-1 min-w-[280px]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-[#575C75]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base text-slate-700 mb-4">{message}</p>
        <button
          onClick={fetchMessage}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Refresh
        </button>
      </CardContent>
    </Card>
  );
}
