import Motivation from "@/components/Motivation";
import Affirmation from "@/components/Affirmation";
import BreathingExercise from "@/components/BreathingExercise";
import SmartJournal from "@/components/SmartJournal";
import Analytics from "@/components/Analytics";

export default function Home() {
  return (
    <main className="max-w-[110vh] mx-auto px-4 py-10 space-y-10">
      <h1 className="text-4xl font-semibold text-center mb-10 text-[#575C75]">
        AI Wellness Companion
      </h1>

      <div className="flex flex-wrap gap-6">
        <Motivation />
        <Affirmation />
      </div>

      <BreathingExercise />
      <SmartJournal />
      <Analytics />
    </main>
  );
}
