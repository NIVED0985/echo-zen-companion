import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Smile, Frown, Meh, Cloud } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const moods = [
    { id: "happy", label: "Happy", icon: Smile, color: "from-green-500 to-emerald-500" },
    { id: "calm", label: "Calm", icon: Heart, color: "from-blue-500 to-cyan-500" },
    { id: "anxious", label: "Anxious", icon: Cloud, color: "from-yellow-500 to-orange-500" },
    { id: "sad", label: "Sad", icon: Frown, color: "from-purple-500 to-pink-500" },
  ];

  useEffect(() => {
    loadMoodHistory();
  }, []);

  const loadMoodHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setMoodHistory(data);
    }
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setIsDialogOpen(true);
  };

  const handleSaveMood = async () => {
    if (!selectedMood) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('mood_entries').insert({
      user_id: user.id,
      mood: selectedMood,
      note: moodNote,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save mood entry",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Saved",
        description: "Your mood has been tracked",
      });
      setSelectedMood(null);
      setMoodNote("");
      setIsDialogOpen(false);
      loadMoodHistory();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString();
  };

  const getMoodStats = () => {
    if (moodHistory.length === 0) {
      return { thisWeek: "N/A", streak: 0, commonMood: "N/A" };
    }

    const moodCounts = moodHistory.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const entries = Object.entries(moodCounts);
    const mostCommon = entries.sort((a, b) => (b[1] as number) - (a[1] as number))[0];
    
    return {
      thisWeek: mostCommon ? moods.find(m => m.id === mostCommon[0])?.label || "N/A" : "N/A",
      streak: moodHistory.length,
      commonMood: mostCommon ? moods.find(m => m.id === mostCommon[0])?.label || "N/A" : "N/A"
    };
  };

  const stats = getMoodStats();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
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

          <div className="glass-effect rounded-3xl p-8 shadow-2xl mb-8 animate-slide-in">
            <h2 className="text-xl font-semibold mb-6 text-center">How are you feeling today?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {moods.map((mood, index) => (
                <button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood.id)}
                  className="glass-effect rounded-2xl p-6 transition-all duration-300 hover:scale-110 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br ${mood.color} flex items-center justify-center animate-glow`}>
                    <mood.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-semibold">{mood.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold mb-4 animate-slide-in">Your Mood Journey</h2>
            {moodHistory.length === 0 ? (
              <div className="text-center py-12 glass-effect rounded-2xl">
                <p className="text-muted-foreground">No mood entries yet. Start tracking today!</p>
              </div>
            ) : (
              moodHistory.map((entry, index) => {
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
                        <p className="font-semibold">{formatDate(entry.created_at)}</p>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground">{entry.note}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium capitalize text-primary">{entry.mood}</p>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "This Week", value: stats.thisWeek, color: "text-blue-500" },
              { label: "Total Entries", value: String(stats.streak), color: "text-green-500" },
              { label: "Common Mood", value: stats.commonMood, color: "text-emerald-500" },
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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How are you feeling?</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedMood && (
                  <div className="flex items-center gap-3">
                    {moods.find(m => m.id === selectedMood) && (() => {
                      const mood = moods.find(m => m.id === selectedMood)!;
                      return (
                        <>
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mood.color} flex items-center justify-center`}>
                            <mood.icon className="w-6 h-6 text-white" />
                          </div>
                          <p className="font-semibold text-lg">{mood.label}</p>
                        </>
                      );
                    })()}
                  </div>
                )}
                <Textarea
                  placeholder="Add a note about how you're feeling (optional)..."
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveMood} className="bg-gradient-to-r from-pink-500 to-rose-500">
                  Save Mood
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default MoodTracker;
