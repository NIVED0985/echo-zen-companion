import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Square, Trash, Play, Pause, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { updateUserStreak } from "@/lib/gamification";
import { format } from "date-fns";

const VoiceJournal = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [transcribingId, setTranscribingId] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchEntries();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const fetchEntries = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching entries:", error);
      return;
    }

    if (data) setEntries(data);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await saveRecording(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const saveRecording = async (audioBlob: Blob) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Error",
        description: "Please login to save recordings",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      
      const duration = formatTime(recordingTime);
      const { error } = await supabase.from("journal_entries").insert({
        user_id: session.user.id,
        title: `Voice Entry - ${format(new Date(), "MMM dd, yyyy")}`,
        content: `Voice recording (${duration})`,
        audio_url: base64Audio,
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save recording",
          variant: "destructive",
        });
        return;
      }

      await updateUserStreak(session.user.id);

      toast({
        title: "Recording Saved! 🎉",
        description: "Your voice journal entry has been saved. Keep it up!",
      });

      fetchEntries();
    };
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete entry",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Entry Deleted",
      description: "Your journal entry has been removed",
    });

    fetchEntries();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = (entry: any) => {
    if (!entry.audio_url) {
      toast({
        title: "No Audio",
        description: "This entry doesn't have an audio recording",
        variant: "destructive",
      });
      return;
    }

    if (playingId === entry.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(entry.audio_url);
      audioRef.current.onended = () => setPlayingId(null);
      audioRef.current.play();
      setPlayingId(entry.id);
    }
  };

  const transcribeAudio = async (entry: any) => {
    if (!entry.audio_url) {
      toast({
        title: "No Audio",
        description: "This entry doesn't have an audio recording",
        variant: "destructive",
      });
      return;
    }

    setTranscribingId(entry.id);

    try {
      // Extract base64 audio from data URL
      const base64Audio = entry.audio_url.split(',')[1];

      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { audio: base64Audio }
      });

      if (error) throw error;

      // Update the entry with transcribed text
      const { error: updateError } = await supabase
        .from('journal_entries')
        .update({ content: data.text })
        .eq('id', entry.id);

      if (updateError) throw updateError;

      toast({
        title: "Transcription Complete! 📝",
        description: "Your audio has been converted to text",
      });

      fetchEntries();
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Transcription Failed",
        description: "Could not transcribe audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTranscribingId(null);
    }
  };

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
              Express yourself freely with voice journaling
            </p>
          </div>

          {/* Recording Section */}
          <div className="glass-effect rounded-3xl p-8 shadow-2xl mb-8 animate-slide-in">
            <div className="text-center">
              <Button
                size="lg"
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-24 h-24 rounded-full transition-all duration-500 ${
                  isRecording
                    ? 'bg-destructive hover:bg-destructive/90 animate-breathe'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500 hover:opacity-90 animate-glow'
                }`}
              >
                {isRecording ? <Square className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
              </Button>
              <p className="mt-4 text-muted-foreground animate-fade-in">
                {isRecording ? `Recording... ${formatTime(recordingTime)}` : "Tap to start recording"}
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
            {entries.length === 0 ? (
              <Card className="glass-effect p-8 text-center">
                <p className="text-muted-foreground">No entries yet. Start recording your first entry!</p>
              </Card>
            ) : (
              entries.map((entry, index) => (
                <Card
                  key={entry.id}
                  className="glass-effect p-6 transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold">{entry.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(entry.created_at), "MMM dd, yyyy 'at' HH:mm")}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">{entry.content}</p>
                    </div>
                    <div className="flex gap-2">
                      {entry.audio_url && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePlay(entry)}
                            className="rounded-full transition-all duration-300 hover:scale-110 hover:text-primary"
                          >
                            {playingId === entry.id ? (
                              <Pause className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => transcribeAudio(entry)}
                            disabled={transcribingId === entry.id}
                            className="rounded-full transition-all duration-300 hover:scale-110 hover:text-primary"
                          >
                            <FileText className="w-5 h-5" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteEntry(entry.id)}
                        className="rounded-full transition-all duration-300 hover:scale-110 hover:text-destructive"
                      >
                        <Trash className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VoiceJournal;
