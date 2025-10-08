import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Square, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const VoiceJournal = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: "", content: "" });
  const { toast } = useToast();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEntries(data);
    }
  };

  const handleSaveEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both title and content",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('journal_entries').insert({
      user_id: user.id,
      title: newEntry.title,
      content: newEntry.content,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save entry",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Journal entry saved",
      });
      setNewEntry({ title: "", content: "" });
      setIsDialogOpen(false);
      loadEntries();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('journal_entries').delete().eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete entry",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Entry removed",
      });
      loadEntries();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
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
              Express yourself freely with journaling
            </p>
          </div>

          <div className="glass-effect rounded-3xl p-8 shadow-2xl mb-8 animate-slide-in">
            <div className="text-center">
              <Button
                size="lg"
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-br from-blue-500 to-cyan-500 hover:opacity-90 animate-glow"
              >
                <Plus className="w-6 h-6 mr-2" />
                New Journal Entry
              </Button>
              <p className="mt-4 text-muted-foreground animate-fade-in">
                Create a new journal entry to track your thoughts
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4 animate-slide-in">Your Entries</h2>
            {entries.length === 0 ? (
              <div className="text-center py-12 glass-effect rounded-2xl">
                <p className="text-muted-foreground">No entries yet. Create your first one!</p>
              </div>
            ) : (
              entries.map((entry, index) => (
                <Card
                  key={entry.id}
                  className="glass-effect p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{entry.title}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(entry.created_at)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(entry.id)}
                      className="transition-all duration-300 hover:scale-110 hover:text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground line-clamp-2">{entry.content}</p>
                </Card>
              ))
            )}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Journal Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Entry title..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                />
                <Textarea
                  placeholder="Write your thoughts..."
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  className="min-h-[200px]"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveEntry} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  Save Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default VoiceJournal;
