import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Mic,
  CheckSquare,
  Users,
  Phone,
  Heart,
  Target,
  Wind,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/home");
      }
      setLoading(false);
    };
    checkUser();
  }, [navigate]);

  const features = [
    {
      icon: MessageCircle,
      title: "AI Companion",
      description: "Chat with an empathetic AI that truly understands you",
    },
    {
      icon: Mic,
      title: "Voice Journal",
      description: "Record your thoughts effortlessly with text-to-speech",
    },
    {
      icon: CheckSquare,
      title: "Smart To-Do Lists",
      description: "Organize your life with mindful task management",
    },
    {
      icon: Users,
      title: "Community Chat",
      description: "Connect with others on their wellness journey",
    },
    {
      icon: Phone,
      title: "24/7 Emergency SOS",
      description: "Instant access to crisis support when you need it most",
    },
    {
      icon: Heart,
      title: "Mood Tracking",
      description: "Monitor and understand your emotional patterns",
    },
    {
      icon: Target,
      title: "Habit Building",
      description: "Develop positive routines that stick",
    },
    {
      icon: Wind,
      title: "Guided Breathing",
      description: "Calming exercises to center your mind",
    },
  ];

  const benefits = [
    "Find peace in moments of overwhelm",
    "Build lasting mental wellness habits",
    "Connect with a supportive community",
    "Access help anytime, anywhere",
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
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-slide-up">
          <div className="inline-flex items-center gap-3 mb-8">
            <Sparkles className="w-12 h-12 text-primary animate-float" />
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Echo
            </h1>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-slide-in">
            Your Personal Mental Health{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Sanctuary
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            A peaceful space designed to support your mental wellness journey with AI-powered tools,
            mindful practices, and a caring community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 hover:scale-105 text-lg px-8 animate-glow"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="text-lg px-8 transition-all duration-300 hover:scale-105"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 animate-slide-in">
            Why Choose Echo?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={benefit}
                className="glass-effect rounded-2xl p-6 flex items-center gap-4 animate-slide-up transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-slide-in">
          <h3 className="text-3xl font-bold mb-4">Powerful Tools for Your Wellness</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to support your mental health in one beautiful, easy-to-use app.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-effect rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center glass-effect rounded-3xl p-12 animate-fade-in">
          <h3 className="text-4xl font-bold mb-4">
            Ready to Find Your{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Inner Peace?
            </span>
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands on their journey to better mental health. Your sanctuary awaits.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-all duration-300 hover:scale-105 text-lg px-8 animate-glow"
          >
            Get Started Free
            <Sparkles className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">© 2024 Echo - Your Mental Health Companion</p>
            <div className="flex items-center justify-center gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                Contact
              </a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
