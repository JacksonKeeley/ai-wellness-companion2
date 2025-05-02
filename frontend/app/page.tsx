'use client';
import CardGen from "@/components/CardGen";
//import Motivation from "@/components/Motivation";
//import Affirmation from "@/components/Affirmation";
import BreathingExercise from "@/components/BreathingExercise";
import SmartJournal from "@/components/SmartJournal";
import Analytics from "@/components/Analytics";
import StudyTimer from "@/components/StudyTimer";
import StayFit from "@/components/StayFit";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <main className="relative max-w-screen-xl mx-auto px-4 py-10">
        <Button
          onClick={logout}
          className="absolute top-4 right-4 px-4 py-2"
        >
          Logout
        </Button>

        <h1 className="text-4xl font-semibold text-center mb-10 text-[#575C75]">
          AI Wellness Companion
        </h1>

        <div className="flex gap-8 items-start min-h-[80vh]">
          {/* Left Side: SmartJournal */}
          <div className="flex-1 min-w-[300px] max-w-[60%] h-full">
            <SmartJournal />
          </div>

          {/* Right Side: Fixed height */}
          <div className="flex flex-col gap-6 w-full max-w-[40%] h-full">
            <div className="flex flex-col gap-6 h-full">
              <CardGen
                title="🌟 Motivation"
                fetchUrl="http://localhost:4000/motivation"
                fallbackMessage="Failed to load motivation."
                responseField="motivation"
              />
              <CardGen
                title="💬 Affirmation"
                fetchUrl="http://localhost:4000/affirmation"
                fallbackMessage="Failed to load affirmation." 
                responseField="affirmation"
              />
              <BreathingExercise />
              <Analytics />
              <StudyTimer />
              <StayFit />
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
