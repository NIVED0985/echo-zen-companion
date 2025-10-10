import { supabase } from "@/integrations/supabase/client";

export const updateUserStreak = async (userId: string) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Get or create user stats
  let { data: stats, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !stats) {
    // Create new stats entry
    const { data: newStats } = await supabase
      .from("user_stats")
      .insert({
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        total_points: 10,
        last_activity_date: today,
      })
      .select()
      .single();
    
    stats = newStats;
  } else {
    const lastActivity = stats.last_activity_date;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = stats.current_streak;
    
    if (lastActivity === yesterdayStr) {
      // Continue streak
      newStreak = stats.current_streak + 1;
    } else if (lastActivity !== today) {
      // Reset streak if gap
      newStreak = 1;
    }

    const newLongest = Math.max(newStreak, stats.longest_streak);
    
    await supabase
      .from("user_stats")
      .update({
        current_streak: newStreak,
        longest_streak: newLongest,
        total_points: stats.total_points + 10,
        last_activity_date: today,
      })
      .eq("user_id", userId);
  }

  // Check and award badges
  await checkAndAwardBadges(userId);
};

const checkAndAwardBadges = async (userId: string) => {
  // Get user stats
  const { data: stats } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!stats) return;

  // Get all badges
  const { data: allBadges } = await supabase
    .from("badges")
    .select("*");

  if (!allBadges) return;

  // Get already earned badges
  const { data: earnedBadges } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId);

  const earnedBadgeIds = earnedBadges?.map(b => b.badge_id) || [];

  // Count user activities
  const { count: moodCount } = await supabase
    .from("mood_entries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const { count: journalCount } = await supabase
    .from("journal_entries")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const { count: tasksCompleted } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("completed", true);

  const { count: habitCompletions } = await supabase
    .from("habit_completions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Check each badge
  for (const badge of allBadges) {
    if (earnedBadgeIds.includes(badge.id)) continue;

    let shouldAward = false;

    switch (badge.requirement_type) {
      case "mood_entries":
        shouldAward = (moodCount || 0) >= badge.requirement_value;
        break;
      case "journal_entries":
        shouldAward = (journalCount || 0) >= badge.requirement_value;
        break;
      case "streak":
        shouldAward = stats.current_streak >= badge.requirement_value;
        break;
      case "tasks_completed":
        shouldAward = (tasksCompleted || 0) >= badge.requirement_value;
        break;
      case "habit_completions":
        shouldAward = (habitCompletions || 0) >= badge.requirement_value;
        break;
    }

    if (shouldAward) {
      await supabase.from("user_badges").insert({
        user_id: userId,
        badge_id: badge.id,
      });
    }
  }
};
