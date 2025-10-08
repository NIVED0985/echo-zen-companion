import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Target, Check } from "lucide-react";
import { useState } from "react";

const HabitTracker = () => {
  const [habits, setHabits] = useState([
    { id: 1, name: "Morning Meditation", streak: 7, completed: [true, true, false, true, true, true, true] },
    { id: 2, name: "Journal Entry", streak: 5, completed: [true, false, true, true, true, true, false] },
    { id: 3, name: "Exercise", streak: 3, completed: [false, true, true, true, false, true, false] },
    { id: 4, name: "Gratitude Practice", streak: 10, completed: [true, true, true, true, true, true, true] },
  ]);

  const toggleDay = (habitId: number, dayIndex: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = [...habit.completed];
        newCompleted[dayIndex] = !newCompleted[dayIndex];
        return { ...habit, completed: newCompleted };
      }
      return habit;
    }));
  };

  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center animate-glow">
                <Target className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Habit Tracker
            </h1>
            <p className="text-lg text-muted-foreground">
              Build lasting positive routines, one day at a time
            </p>
          </div>

          {/* Add Habit */}
          <div className="glass-effect rounded-3xl p-6 shadow-2xl mb-8 animate-slide-in">
            <Button
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-all duration-300 hover:scale-[1.02] animate-glow"
            >
              + Add New Habit
            </Button>
          </div>

          {/* Habits List */}
          <div className="space-y-6">
            {habits.map((habit, index) => (
              <Card
                key={habit.id}
                className="glass-effect p-6 transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{habit.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      🔥 {habit.streak} day streak
                    </p>
                  </div>
                </div>

                {/* Week View */}
                <div className="flex gap-2">
                  {habit.completed.map((completed, dayIndex) => (
                    <button
                      key={dayIndex}
                      onClick={() => toggleDay(habit.id, dayIndex)}
                      className={`flex-1 aspect-square rounded-xl transition-all duration-300 hover:scale-110 ${
                        completed
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-500 animate-glow'
                          : 'glass-effect'
                      }`}
                    >
                      {completed ? (
                        <Check className="w-5 h-5 text-white mx-auto" />
                      ) : (
                        <span className="text-sm text-muted-foreground">{days[dayIndex]}</span>
                      )}
                    </button>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              { label: "Total Habits", value: "4", color: "from-indigo-500 to-purple-500" },
              { label: "Completed Today", value: "3", color: "from-green-500 to-emerald-500" },
              { label: "Best Streak", value: "10 days", color: "from-yellow-500 to-orange-500" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`glass-effect rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 animate-slide-up bg-gradient-to-br ${stat.color} bg-opacity-10`}
                style={{ animationDelay: `${(index + 4) * 0.1}s` }}
              >
                <p className="text-3xl font-bold mb-1 animate-breathe">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HabitTracker;
