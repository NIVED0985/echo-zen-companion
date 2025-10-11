import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import StreakBadge from "@/components/StreakBadge";
import BadgesList from "@/components/BadgesList";
import {
  MessageCircle,
  Mic,
  CheckSquare,
  Users,
  Phone,
  Heart,
  Target,
  Wind,
  LogOut,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
      setLoading(false);
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "Come back soon for your moment of peace.",
    });
    navigate("/");
  };

  const features = [
    {
      icon: MessageCircle,
      title: "AI Companion",
      description: "Chat with your empathetic AI friend",
      gradient: "from-purple-500 to-pink-500",
      path: "/ai-companion",
    },
    {
      icon: Mic,
      title: "Voice Journal",
      description: "Record your daily thoughts and feelings",
      gradient: "from-blue-500 to-cyan-500",
      path: "/voice-journal",
    },
    {
      icon: CheckSquare,
      title: "To-Do List",
      description: "Organize your tasks mindfully",
      gradient: "from-green-500 to-emerald-500",
      path: "/todo-list",
    },
    {
      icon: Users,
      title: "Chai Room",
      description: "Connect with supportive community",
      gradient: "from-yellow-500 to-orange-500",
      path: "/chai-room",
    },
    {
      icon: Phone,
      title: "Emergency SOS",
      description: "Quick access to crisis support",
      gradient: "from-red-500 to-rose-500",
      path: "/emergency-sos",
    },
    {
      icon: Heart,
      title: "Mood Tracker",
      description: "Monitor your emotional well-being",
      gradient: "from-pink-500 to-rose-500",
      path: "/mood-tracker",
    },
    {
      icon: Target,
      title: "Habit Tracker",
      description: "Build positive daily routines",
      gradient: "from-indigo-500 to-purple-500",
      path: "/habit-tracker",
    },
    {
      icon: Wind,
      title: "Breathing Exercises",
      description: "Calm your mind with guided breathwork",
      gradient: "from-teal-500 to-cyan-500",
      path: "/breathing-exercises",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen gradient-calm flex items-center justify-center">
        <div className="animate-breathe">
          <Sparkles className="w-12 h-12 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-calm">
      {/* Header */}
      <header className="glass-effect border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary animate-float" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Echo
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full transition-all duration-300 hover:scale-110"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="gap-2 transition-all duration-300 hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to Your{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Sanctuary
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a moment to breathe. Choose a path that speaks to you today.
          </p>
        </div>

        {/* Gamification Section */}
        <StreakBadge />
        <BadgesList />

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              onClick={() => navigate(feature.path)}
              className="glass-effect rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer animate-slide-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 animate-glow`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Emergency SOS - Highlighted */}
        <div className="mt-12 max-w-3xl mx-auto animate-fade-in">
          <div className="glass-effect rounded-3xl p-8 border-2 border-destructive/30 bg-destructive/5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center animate-glow">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Need Immediate Help?</h3>
                <p className="text-muted-foreground">24/7 crisis support is always available</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="destructive" size="lg" className="w-full">
                Emergency Hotline
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                Crisis Text Line
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">© 2024 Echo - Your Mental Health Companion</p>
            <div className="flex items-center justify-center gap-4">
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
