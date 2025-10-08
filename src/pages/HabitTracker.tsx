import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Target, Check, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const HabitTracker = () => {
  const [habits, setHabits] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: "", description: "", frequency: "daily" });
  const { toast } = useToast();

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: habitsData, error: habitsError } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (habitsError || !habitsData) return;

    const habitsWithCompletions = await Promise.all(
      habitsData.map(async (habit) => {
        const { data: completions } = await supabase
          .from('habit_completions')
          .select('*')
          .eq('habit_id', habit.id)
          .gte('completed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toDateString();
        });

        const completed = last7Days.map(day => 
          completions?.some(c => new Date(c.completed_at).toDateString() === day) || false
        );

        return { ...habit, completed, streak: completions?.length || 0 };
      })
    );

    setHabits(habitsWithCompletions);
  };

  const handleSaveHabit = async () => {
    if (!newHabit.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a habit name",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('habits').insert({
      user_id: user.id,
      name: newHabit.name,
      description: newHabit.description,
      frequency: newHabit.frequency,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create habit",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Habit created",
      });
      setNewHabit({ name: "", description: "", frequency: "daily" });
      setIsDialogOpen(false);
      loadHabits();
    }
  };

  const toggleDay = async (habitId: string, dayIndex: number, isCompleted: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - (6 - dayIndex));
    targetDate.setHours(12, 0, 0, 0);

    if (isCompleted) {
      const { data: completions } = await supabase
        .from('habit_completions')
        .select('id')
        .eq('habit_id', habitId)
        .eq('user_id', user.id)
        .gte('completed_at', new Date(targetDate.setHours(0, 0, 0, 0)).toISOString())
        .lt('completed_at', new Date(targetDate.setHours(23, 59, 59, 999)).toISOString());

      if (completions && completions.length > 0) {
        await supabase.from('habit_completions').delete().eq('id', completions[0].id);
      }
    } else {
      await supabase.from('habit_completions').insert({
        habit_id: habitId,
        user_id: user.id,
        completed_at: targetDate.toISOString(),
      });
    }

    loadHabits();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('habits').delete().eq('id', id);

    if (!error) {
      toast({
        title: "Deleted",
        description: "Habit removed",
      });
      loadHabits();
    }
  };

  const days = ["M", "T", "W", "T", "F", "S", "S"];

  const getStats = () => {
    const totalHabits = habits.length;
    const completedToday = habits.filter(h => h.completed[6]).length;
    const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
    return { totalHabits, completedToday, bestStreak };
  };

  const stats = getStats();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
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

          <div className="glass-effect rounded-3xl p-6 shadow-2xl mb-8 animate-slide-in">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition-all duration-300 hover:scale-[1.02] animate-glow"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Habit
            </Button>
          </div>

          <div className="space-y-6 mb-8">
            {habits.length === 0 ? (
              <div className="text-center py-12 glass-effect rounded-2xl">
                <p className="text-muted-foreground">No habits yet. Create your first one!</p>
              </div>
            ) : (
              habits.map((habit, index) => (
                <Card
                  key={habit.id}
                  className="glass-effect p-6 transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{habit.name}</h3>
                      {habit.description && (
                        <p className="text-sm text-muted-foreground">{habit.description}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        🔥 {habit.streak} completions
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(habit.id)}
                      className="hover:text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    {habit.completed.map((completed: boolean, dayIndex: number) => (
                      <button
                        key={dayIndex}
                        onClick={() => toggleDay(habit.id, dayIndex, completed)}
                        className={`flex-1 aspect-square rounded-xl transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                          completed
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-500 animate-glow'
                            : 'glass-effect'
                        }`}
                      >
                        {completed ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-sm text-muted-foreground">{days[dayIndex]}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Total Habits", value: stats.totalHabits.toString(), color: "from-indigo-500 to-purple-500" },
              { label: "Completed Today", value: stats.completedToday.toString(), color: "from-green-500 to-emerald-500" },
              { label: "Best Streak", value: `${stats.bestStreak}`, color: "from-yellow-500 to-orange-500" },
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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Habit name (e.g., Morning Meditation)"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveHabit} className="bg-gradient-to-r from-indigo-500 to-purple-500">
                  Create Habit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default HabitTracker;
