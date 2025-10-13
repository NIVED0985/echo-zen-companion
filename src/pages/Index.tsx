import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
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
import bgOcean from "@/assets/bg-ocean.jpg";
import bgGradient from "@/assets/bg-gradient.jpg";
import bgZen from "@/assets/bg-zen.jpg";
import bgAurora from "@/assets/bg-aurora.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const backgrounds = [bgOcean, bgGradient, bgZen, bgAurora];
  
  const plugin = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false })
  );

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Carousel */}
      <div className="fixed inset-0 z-0">
        <Carousel
          opts={{ loop: true }}
          plugins={[plugin.current]}
          className="w-full h-full"
        >
          <CarouselContent className="h-screen">
            {backgrounds.map((bg, index) => (
              <CarouselItem key={index} className="h-screen">
                <div 
                  className="h-full w-full bg-cover bg-center transition-all duration-1000"
                  style={{ backgroundImage: `url(${bg})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90 backdrop-blur-[2px]" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 min-h-screen flex items-center justify-center">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-8 animate-slide-up">
              <Sparkles className="w-12 h-12 text-primary animate-float drop-shadow-glow" />
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-glow drop-shadow-lg">
                Echo
              </h1>
            </div>

            <h2 className="text-3xl md:text-6xl font-bold mb-6 animate-slide-in drop-shadow-md" style={{ animationDelay: "0.1s" }}>
              Your Personal Mental Health{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-glow">
                Sanctuary
              </span>
            </h2>

            <p className="text-lg md:text-2xl text-foreground/90 mb-12 max-w-3xl mx-auto animate-fade-in leading-relaxed drop-shadow" style={{ animationDelay: "0.2s" }}>
              A peaceful space designed to support your mental wellness journey with AI-powered tools,
              mindful practices, and a caring community.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Button
                size="lg"
                onClick={() => navigate("/signup")}
                className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-all duration-500 hover:scale-110 hover:shadow-2xl text-lg px-10 py-6 animate-glow text-white font-semibold"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-6 h-6 animate-float" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/login")}
                className="text-lg px-10 py-6 transition-all duration-500 hover:scale-110 hover:shadow-xl glass-effect border-2 font-semibold backdrop-blur-md"
              >
                Sign In
              </Button>
            </div>

            {/* Scroll Indicator */}
            <div className="mt-20 animate-bounce">
              <div className="w-6 h-10 border-2 border-primary/50 rounded-full mx-auto flex items-start justify-center p-2">
                <div className="w-1.5 h-3 bg-primary rounded-full animate-float" />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 py-24 backdrop-blur-sm bg-background/30">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 animate-slide-in bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Why Choose Echo?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit}
                  className="glass-effect rounded-3xl p-8 flex items-center gap-6 animate-slide-up transition-all duration-500 hover:scale-105 hover:shadow-2xl group backdrop-blur-lg border border-primary/20"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-500 animate-glow shadow-lg">
                    <Heart className="w-8 h-8 text-white animate-breathe" />
                  </div>
                  <p className="text-xl font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-24 backdrop-blur-sm bg-background/40">
          <div className="text-center mb-20 animate-slide-in">
            <h3 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Powerful Tools for Your Wellness
            </h3>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Everything you need to support your mental health in one beautiful, easy-to-use app.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-effect rounded-3xl p-8 hover:scale-110 transition-all duration-500 animate-slide-up group backdrop-blur-lg border border-primary/10 hover:border-primary/30 hover:shadow-2xl cursor-pointer"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg animate-float">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">{feature.title}</h4>
                <p className="text-base text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-32">
          <div className="max-w-5xl mx-auto text-center glass-effect rounded-[3rem] p-16 animate-fade-in backdrop-blur-xl border-2 border-primary/20 shadow-2xl">
            <div className="mb-8 inline-block">
              <Sparkles className="w-20 h-20 text-primary animate-float drop-shadow-glow mx-auto" />
            </div>
            <h3 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Ready to Find Your{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-glow">
                Inner Peace?
              </span>
            </h3>
            <p className="text-xl md:text-2xl text-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands on their journey to better mental health. Your sanctuary awaits.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-all duration-500 hover:scale-110 text-xl px-12 py-7 animate-glow text-white font-bold shadow-2xl hover:shadow-primary/50"
            >
              Get Started Free
              <Sparkles className="ml-3 w-6 h-6 animate-float" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/20 mt-20 backdrop-blur-lg bg-background/50">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-primary animate-float" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Echo
                </h2>
              </div>
              <p className="text-base text-muted-foreground mb-6">© 2024 Echo - Your Mental Health Companion</p>
              <div className="flex items-center justify-center gap-8 text-sm">
                <a href="#" className="hover:text-primary transition-all duration-300 hover:scale-110 font-medium">
                  Contact
                </a>
                <span className="text-muted-foreground">•</span>
                <a href="#" className="hover:text-primary transition-all duration-300 hover:scale-110 font-medium">
                  Privacy
                </a>
                <span className="text-muted-foreground">•</span>
                <a href="#" className="hover:text-primary transition-all duration-300 hover:scale-110 font-medium">
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
