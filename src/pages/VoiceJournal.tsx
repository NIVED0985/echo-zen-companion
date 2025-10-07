import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Square, Play, Pause } from "lucide-react";
import { useState } from "react";

const VoiceJournal = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [entries, setEntries] = useState([
    { id: 1, date: "Today", duration: "2:34", text: "Feeling grateful for the small moments..." },
    { id: 2, date: "Yesterday", duration: "3:12", text: "Had a challenging day but learned a lot..." },
  ]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center animate-glow">
                <Mic className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Voice Journal
            </h1>
            <p className="text-lg text-muted-foreground">
              Express yourself freely with voice-to-text journaling
            </p>
          </div>

          {/* Recording Section */}
          <div className="glass-effect rounded-3xl p-8 shadow-2xl mb-8 animate-slide-in">
            <div className="text-center">
              <Button
                size="lg"
                onClick={() => setIsRecording(!isRecording)}
                className={`w-24 h-24 rounded-full transition-all duration-500 ${
                  isRecording
                    ? 'bg-destructive hover:bg-destructive/90 animate-breathe'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500 hover:opacity-90 animate-glow'
                }`}
              >
                {isRecording ? <Square className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
              </Button>
              <p className="mt-4 text-muted-foreground animate-fade-in">
                {isRecording ? "Recording... Tap to stop" : "Tap to start recording"}
              </p>
              {isRecording && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-primary rounded-full animate-breathe"
                      style={{
                        height: `${Math.random() * 40 + 20}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Previous Entries */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4 animate-slide-in">Your Entries</h2>
            {entries.map((entry, index) => (
              <Card
                key={entry.id}
                className="glass-effect p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{entry.date}</p>
                    <p className="text-sm text-muted-foreground">{entry.duration}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full transition-all duration-300 hover:scale-110"
                  >
                    <Play className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-muted-foreground">{entry.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VoiceJournal;
