import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2 } from "lucide-react";
import { toast } from "sonner";

interface Sound {
  name: string;
  url: string;
  description: string;
}

interface Theme {
  id: string;
  name: string;
  description: string;
  sounds: Sound[];
  gradient: string;
}

const Soundscapes = () => {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const themes: Theme[] = [
    {
      id: "focus",
      name: "Focus Mode",
      description: "Enhance concentration with ambient sounds",
      gradient: "from-purple-500/20 to-blue-500/20",
      sounds: [
        { name: "Rain", url: "https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3", description: "Gentle rainfall" },
        { name: "Coffee Shop", url: "https://assets.mixkit.co/active_storage/sfx/2460/2460-preview.mp3", description: "Ambient café chatter" },
        { name: "White Noise", url: "https://assets.mixkit.co/active_storage/sfx/1646/1646-preview.mp3", description: "Pure focus noise" },
      ],
    },
    {
      id: "calm",
      name: "Calm Night",
      description: "Peaceful sounds for relaxation",
      gradient: "from-indigo-500/20 to-purple-500/20",
      sounds: [
        { name: "Night Forest", url: "https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3", description: "Crickets and nature" },
        { name: "Ocean Waves", url: "https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3", description: "Gentle waves" },
        { name: "Fireplace", url: "https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3", description: "Crackling fire" },
      ],
    },
    {
      id: "ocean",
      name: "Ocean Breeze",
      description: "Coastal sounds and serenity",
      gradient: "from-cyan-500/20 to-blue-500/20",
      sounds: [
        { name: "Beach Waves", url: "https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3", description: "Rhythmic ocean sounds" },
        { name: "Seagulls", url: "https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3", description: "Distant birds" },
        { name: "Wind Chimes", url: "https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3", description: "Soft chimes" },
      ],
    },
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const toggleSound = (sound: Sound) => {
    if (playingSound === sound.name) {
      audioRef.current?.pause();
      setPlayingSound(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = sound.url;
        audioRef.current.loop = true;
        audioRef.current.volume = volume / 100;
        audioRef.current.play().catch(() => {
          toast.error("Failed to play sound. Please try again.");
        });
        setPlayingSound(sound.name);
      }
    }
  };

  const selectTheme = (themeId: string) => {
    setActiveTheme(themeId);
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingSound(null);
    }
    toast.success(`${themes.find(t => t.id === themeId)?.name} activated`);
  };

  return (
    <Layout>
      <div className="min-h-screen p-8 animate-fade-in">
        <audio ref={audioRef} />
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Soundscapes & Themes
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose a theme and play ambient sounds to enhance your experience
            </p>
          </div>

          {/* Volume Control */}
          <Card className="mb-8 glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Master Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">{volume}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Themes */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {themes.map((theme) => (
              <Card
                key={theme.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  activeTheme === theme.id
                    ? "ring-2 ring-primary shadow-lg shadow-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() => selectTheme(theme.id)}
              >
                <CardHeader className={`bg-gradient-to-br ${theme.gradient} rounded-t-lg`}>
                  <CardTitle>{theme.name}</CardTitle>
                  <CardDescription className="text-foreground/80">
                    {theme.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Sound Controls */}
          {activeTheme && (
            <div className="animate-slide-in">
              <h2 className="text-2xl font-semibold mb-4">Available Sounds</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes
                  .find((t) => t.id === activeTheme)
                  ?.sounds.map((sound) => (
                    <Card
                      key={sound.name}
                      className="hover:border-primary/50 transition-all duration-300"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{sound.name}</CardTitle>
                        <CardDescription>{sound.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => toggleSound(sound)}
                          variant={playingSound === sound.name ? "default" : "outline"}
                          className="w-full"
                        >
                          {playingSound === sound.name ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Play
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {!activeTheme && (
            <div className="text-center text-muted-foreground py-12">
              Select a theme above to see available sounds
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Soundscapes;
