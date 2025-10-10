import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Trophy } from "lucide-react";
import { Card } from "./ui/card";

const StreakBadge = () => {
  const [stats, setStats] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (data) {
        setStats({
          currentStreak: data.current_streak || 0,
          longestStreak: data.longest_streak || 0,
          totalPoints: data.total_points || 0,
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="glass-effect p-6 text-center transition-all duration-300 hover:scale-105 animate-slide-up">
        <div className="flex items-center justify-center mb-2">
          <Flame className="w-8 h-8 text-orange-500 animate-glow" />
        </div>
        <p className="text-3xl font-bold text-orange-500 animate-breathe">
          {stats.currentStreak}
        </p>
        <p className="text-sm text-muted-foreground">Current Streak</p>
      </Card>

      <Card className="glass-effect p-6 text-center transition-all duration-300 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-center mb-2">
          <Trophy className="w-8 h-8 text-yellow-500 animate-glow" />
        </div>
        <p className="text-3xl font-bold text-yellow-500 animate-breathe">
          {stats.longestStreak}
        </p>
        <p className="text-sm text-muted-foreground">Longest Streak</p>
      </Card>

      <Card className="glass-effect p-6 text-center transition-all duration-300 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-center mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold animate-glow">
            {stats.totalPoints}
          </div>
        </div>
        <p className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent animate-breathe">
          {stats.totalPoints}
        </p>
        <p className="text-sm text-muted-foreground">Total Points</p>
      </Card>
    </div>
  );
};

export default StreakBadge;
