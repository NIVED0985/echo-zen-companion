import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Smile, Frown, Meh } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { updateUserStreak } from "@/lib/gamification";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, subDays } from "date-fns";

const MoodTracker = () => {
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  const moods = [
    { id: "happy", label: "Happy", icon: Smile, color: "from-green-500 to-emerald-500", value: 4 },
    { id: "calm", label: "Calm", icon: Heart, color: "from-blue-500 to-cyan-500", value: 3 },
    { id: "anxious", label: "Anxious", icon: Frown, color: "from-yellow-500 to-orange-500", value: 2 },
    { id: "sad", label: "Sad", icon: Meh, color: "from-purple-500 to-pink-500", value: 1 },
  ];

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("Error fetching mood history:", error);
      return;
    }

    if (data) {
      setMoodHistory(data);
      prepareChartData(data);
    }
  };

  const prepareChartData = (data: any[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return format(date, "yyyy-MM-dd");
    });

    const chartPoints = last7Days.map(date => {
      const dayMoods = data.filter(entry => 
        format(new Date(entry.created_at), "yyyy-MM-dd") === date
      );

      if (dayMoods.length === 0) return { date: format(new Date(date), "MMM dd"), value: null };

      const avgValue = dayMoods.reduce((sum, entry) => {
        const mood = moods.find(m => m.id === entry.mood);
        return sum + (mood?.value || 0);
      }, 0) / dayMoods.length;

      return {
        date: format(new Date(date), "MMM dd"),
        value: avgValue,
      };
    });

    setChartData(chartPoints);
  };

  const saveMood = async () => {
    if (!selectedMood) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Error",
        description: "Please login to save your mood",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("mood_entries").insert({
      user_id: session.user.id,
      mood: selectedMood,
      note: `Feeling ${selectedMood}`,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save mood",
        variant: "destructive",
      });
      return;
    }

    // Update streak and check badges
    await updateUserStreak(session.user.id);

    toast({
      title: "Mood Saved! 🎉",
      description: "Keep tracking your emotional journey and earn badges!",
    });

    setSelectedMood(null);
    fetchMoodHistory();
  };

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
                onClick={saveMood}
                className="w-full mt-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 transition-all duration-300 hover:scale-105 animate-glow"
              >
                Save Today's Mood
              </Button>
            )}
          </div>

          {/* Mood Chart */}
          {chartData.length > 0 && (
            <div className="glass-effect rounded-3xl p-8 shadow-2xl mb-8 animate-slide-in">
              <h2 className="text-2xl font-semibold mb-6">Your Mood Trend (Last 7 Days)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
                  <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4]} stroke="hsl(var(--foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: any) => {
                      const moodLabels = ["", "Sad", "Anxious", "Calm", "Happy"];
                      return [moodLabels[Math.round(value)], "Mood"];
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    name="Mood Level"
                    dot={{ fill: "hsl(var(--primary))", r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Mood History */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4 animate-slide-in">Your Mood Journey</h2>
            {moodHistory.slice(0, 10).map((entry, index) => {
              const moodInfo = moods.find(m => m.id === entry.mood);
              return (
                <Card
                  key={entry.id}
                  className="glass-effect p-6 transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${moodInfo?.color} flex items-center justify-center transition-transform duration-300 hover:scale-110`}>
                      {moodInfo && <moodInfo.icon className="w-6 h-6 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">
                        {format(new Date(entry.created_at), "MMMM dd, yyyy")}
                      </p>
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
        </div>
      </div>
    </Layout>
  );
};

export default MoodTracker;
