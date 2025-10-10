import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

interface BadgeType {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
}

interface UserBadge {
  badge_id: string;
  earned_at: string;
}

const BadgesList = () => {
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  useEffect(() => {
    const fetchBadges = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch all badges
      const { data: allBadges } = await supabase
        .from("badges")
        .select("*")
        .order("requirement_value", { ascending: true });

      // Fetch user's earned badges
      const { data: userBadgesData } = await supabase
        .from("user_badges")
        .select("badge_id, earned_at")
        .eq("user_id", session.user.id);

      if (allBadges) setBadges(allBadges);
      if (userBadgesData) {
        setEarnedBadges(userBadgesData.map((ub: UserBadge) => ub.badge_id));
      }
    };

    fetchBadges();
  }, []);

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4 animate-slide-in">Your Badges</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge, index) => {
          const isEarned = earnedBadges.includes(badge.id);
          return (
            <Card
              key={badge.id}
              className={`glass-effect p-4 text-center transition-all duration-300 hover:scale-105 animate-slide-up ${
                !isEarned ? "opacity-50 grayscale" : ""
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="text-4xl mb-2 animate-glow">{badge.icon}</div>
              <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
              <p className="text-xs text-muted-foreground mb-2">
                {badge.description}
              </p>
              {isEarned && (
                <Badge variant="default" className="text-xs animate-breathe">
                  Earned!
                </Badge>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BadgesList;
