import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, MessageSquare, Heart, AlertCircle } from "lucide-react";

const EmergencySOS = () => {
  const hotlines = [
    { name: "National Suicide Prevention", number: "988", description: "24/7 Crisis support" },
    { name: "Crisis Text Line", number: "Text HOME to 741741", description: "Text-based support" },
    { name: "SAMHSA Helpline", number: "1-800-662-4357", description: "Mental health & substance abuse" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center animate-glow">
                <Phone className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">
              Emergency SOS
            </h1>
            <p className="text-lg text-muted-foreground">
              Help is always available. You're not alone.
            </p>
          </div>

          {/* Quick Action */}
          <div className="glass-effect rounded-3xl p-8 shadow-2xl mb-8 border-2 border-destructive/30 bg-destructive/5 animate-slide-in">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive animate-breathe" />
              <h2 className="text-2xl font-bold mb-2">Need Immediate Help?</h2>
              <p className="text-muted-foreground mb-6">
                If you're in crisis, reach out now. These services are free, confidential, and available 24/7.
              </p>
              <Button
                size="lg"
                variant="destructive"
                className="text-lg px-8 transition-all duration-300 hover:scale-110 animate-glow"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call 988 Now
              </Button>
            </div>
          </div>

          {/* Hotlines */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4 animate-slide-in">Crisis Hotlines</h2>
            {hotlines.map((hotline, index) => (
              <Card
                key={hotline.name}
                className="glass-effect p-6 transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{hotline.name}</h3>
                    <p className="text-2xl font-bold text-primary mb-1">{hotline.number}</p>
                    <p className="text-sm text-muted-foreground">{hotline.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="transition-all duration-300 hover:scale-110"
                  >
                    Call Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Self-Care Tips */}
          <div className="mt-8 glass-effect rounded-3xl p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-primary animate-float" />
              <h2 className="text-2xl font-semibold">Immediate Self-Care Steps</h2>
            </div>
            <div className="grid gap-4">
              {[
                "Take slow, deep breaths - breathe in for 4, hold for 4, out for 4",
                "Remove yourself from stressful situations if possible",
                "Reach out to a trusted friend or family member",
                "Engage in a calming activity like listening to music",
                "Remember: This feeling will pass. You've survived difficult times before",
              ].map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 glass-effect rounded-2xl transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                  style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 animate-breathe" />
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmergencySOS;
