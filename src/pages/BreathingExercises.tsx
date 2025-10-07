import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wind, Play, Pause } from "lucide-react";
import { useState, useEffect } from "react";

const BreathingExercises = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [count, setCount] = useState(4);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          setPhase((currentPhase) => {
            if (currentPhase === "inhale") return "hold";
            if (currentPhase === "hold") return "exhale";
            return "inhale";
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const exercises = [
    { name: "Box Breathing", duration: "4-4-4-4", description: "Equal breathing for calm focus" },
    { name: "4-7-8 Technique", duration: "4-7-8", description: "Deep relaxation method" },
    { name: "Coherent Breathing", duration: "5-5", description: "Balance nervous system" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center animate-glow">
                <Wind className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Breathing Exercises
            </h1>
            <p className="text-lg text-muted-foreground">
              Find your center with guided breathwork
            </p>
          </div>

          {/* Interactive Breathing */}
          <div className="glass-effect rounded-3xl p-12 shadow-2xl mb-8 text-center animate-slide-in">
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 transition-all duration-1000 ${
                  isActive
                    ? phase === "inhale"
                      ? "scale-100 opacity-80"
                      : phase === "hold"
                      ? "scale-100 opacity-80"
                      : "scale-75 opacity-50"
                    : "scale-75 opacity-50"
                } animate-glow`}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-6xl font-bold mb-2 animate-breathe">{count}</p>
                <p className="text-lg capitalize text-muted-foreground">{phase}</p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => setIsActive(!isActive)}
              className={`bg-gradient-to-r from-teal-500 to-cyan-500 hover:opacity-90 transition-all duration-300 hover:scale-110 ${
                isActive ? 'animate-glow' : ''
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </>
              )}
            </Button>

            <p className="mt-4 text-sm text-muted-foreground animate-fade-in">
              {isActive ? "Follow the circle and breathe deeply" : "Click start to begin your practice"}
            </p>
          </div>

          {/* Exercise Options */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4 animate-slide-in">Choose Your Technique</h2>
            {exercises.map((exercise, index) => (
              <Card
                key={exercise.name}
                className="glass-effect p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110 animate-breathe">
                    <Wind className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{exercise.name}</h3>
                    <p className="text-sm text-muted-foreground">{exercise.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-primary">{exercise.duration}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Benefits */}
          <div className="mt-8 glass-effect rounded-3xl p-8 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6">Benefits of Breathwork</h2>
            <div className="grid gap-4">
              {[
                "Reduces stress and anxiety",
                "Improves focus and clarity",
                "Lowers blood pressure",
                "Enhances emotional regulation",
                "Promotes better sleep",
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 glass-effect rounded-2xl transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                  style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                >
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-breathe" />
                  <p>{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BreathingExercises;
