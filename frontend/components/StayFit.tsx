'use client';
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Goal = {
    id: number;
    label: string;
    checked: boolean;
  };

  const defaultGoals: Goal[] = [
    { id: 1, label: '🚶 Walk 5,000 steps', checked: false },
    { id: 2, label: '💧 Drink 8 cups of water', checked: false },
    { id: 3, label: '⏰ Stand up every hour', checked: false },
    { id: 4, label: '🤸‍♂️ Stretch for 5 minutes', checked: false },
    { id: 5, label: '🛌 Get 7+ hours of sleep', checked: false },
  ];

  export default function FitnessGoals(){
    const [goals, setGoals] = useState(defaultGoals);

    const toggleGoal = (id: number) => {
        setGoals(prev =>
          prev.map(goal =>
            goal.id === id ? { ...goal, checked: !goal.checked } : goal
          )
        );
      };

      return (
        <Card className="bg-white/60 backdrop-blur rounded-2xl shadow-md border border-[#D0C9E1]">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-[#575C75]">🏃 Fitness Goals</CardTitle>
          </CardHeader>
          <CardContent className="text-base text-slate-700">
            <ul className="space-y-2">
              {goals.map(goal => (
                <li key={goal.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={goal.checked}
                    onChange={() => toggleGoal(goal.id)}
                    className="w-4 h-4 accent-[#575C75]"
                  />
                  <label>{goal.label}</label>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      );
    }