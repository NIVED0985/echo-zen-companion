import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Smile, Frown, Meh } from "lucide-react";
import { useState } from "react";

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState([
    { date: "Today", mood: "happy", note: "Great workout!" },
    { date: "Yesterday", mood: "calm", note: "Peaceful meditation" },
    { date: "2 days ago", mood: "anxious", note: "Busy day at work" },
  ]);

  const moods = [
    { id: "happy", label: "Happy", icon: Smile, color: "from-green-500 to-emerald-500" },
    { id: "calm", label: "Calm", icon: Heart, color: "from-blue-500 to-cyan-500" },
    { id: "anxious", label: "Anxious", icon: Frown, color: "from-yellow-500 to-orange-500" },
    { id: "sad", label: "Sad", icon: Meh, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center animate-glow">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Mood Tracker
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your emotional journey day by day
            </p>
          </div>

          {/* Mood Selection */}
          <div className="glass-effect rounded-3xl p-8 shadow-2xl mb-8 animate-slide-in">
            <h2 className="text-xl font-semibold mb-6 text-center">How are you feeling today?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {moods.map((mood, index) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`glass-effect rounded-2xl p-6 transition-all duration-300 hover:scale-110 animate-slide-up ${
                    selectedMood === mood.id ? 'ring-2 ring-primary' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br ${mood.color} flex items-center justify-center animate-glow`}>
                    <mood.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-semibold">{mood.label}</p>
                </button>
              ))}
            </div>
            {selectedMood && (
              <Button
                className="w-full mt-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 transition-all duration-300 hover:scale-105 animate-glow"
              >
                Save Today's Mood
              </Button>
            )}
          </div>

          {/* Mood History */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4 animate-slide-in">Your Mood Journey</h2>
            {moodHistory.map((entry, index) => {
              const moodInfo = moods.find(m => m.id === entry.mood);
              return (
                <Card
                  key={index}
                  className="glass-effect p-6 transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${moodInfo?.color} flex items-center justify-center transition-transform duration-300 hover:scale-110`}>
                      {moodInfo && <moodInfo.icon className="w-6 h-6 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{entry.date}</p>
                      <p className="text-sm text-muted-foreground">{entry.note}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium capitalize text-primary">{entry.mood}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Insights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "This Week", value: "Mostly Calm", color: "text-blue-500" },
              { label: "Streak", value: "7 days", color: "text-green-500" },
              { label: "Common Mood", value: "Happy", color: "text-emerald-500" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="glass-effect rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${(index + 3) * 0.1}s` }}
              >
                <p className={`text-2xl font-bold mb-1 ${stat.color} animate-breathe`}>
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

export default MoodTracker;
