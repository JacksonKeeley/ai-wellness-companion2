import Motivation from "@/components/Motivation";
import Affirmation from "@/components/Affirmation";
import BreathingExercise from "@/components/BreathingExercise";
import WellnessTip from "@/components/wellness-tip"; 
import SmartJournal from "@/components/SmartJournal";
import Analytics from "@/components/Analytics";
import StudyTimer from "@/components/StudyTimer";

export default function Home() {
  return (
    <main className="max-w-screen-xl mx-auto px-4 py-10">
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
            <Motivation />
            <Affirmation />
            <WellnessTip />
            <BreathingExercise />
            <Analytics />
            <StudyTimer />
          </div>
        </div>
      </div>
    </main>
  );
}
