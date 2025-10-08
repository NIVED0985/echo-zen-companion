import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [username, setUsername] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
    loadProfile();
    
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single();

    if (data) {
      setUsername(data.display_name || user.email?.split('@')[0] || 'Anonymous');
    }
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50);

    if (!error && data) {
      setMessages(data);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('chat_messages').insert({
      user_id: user.id,
      username: username || user.email?.split('@')[0] || 'Anonymous',
      message: message,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } else {
      setMessage("");
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center animate-glow">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Community Chat
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with others on their wellness journey
            </p>
          </div>

          <div className="glass-effect rounded-3xl p-6 shadow-2xl animate-slide-in">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/50 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-breathe" />
              <p className="text-sm text-muted-foreground">Chat room active</p>
            </div>

            <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className="glass-effect rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-primary">{msg.username}</p>
                    <p className="text-xs text-muted-foreground">{formatTime(msg.created_at)}</p>
                  </div>
                  <p>{msg.message}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Input
                placeholder="Share something positive..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="transition-all duration-300 focus:scale-[1.01]"
              />
              <Button
                onClick={sendMessage}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 transition-all duration-300 hover:scale-110 animate-glow"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="mt-8 glass-effect rounded-2xl p-6 animate-fade-in">
            <h3 className="font-semibold mb-3">Community Guidelines</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-breathe" />
                Be kind and supportive
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-breathe" style={{ animationDelay: '0.1s' }} />
                Respect everyone's journey
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-breathe" style={{ animationDelay: '0.2s' }} />
                Share positivity and hope
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatRoom;
