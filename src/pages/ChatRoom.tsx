import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Send } from "lucide-react";
import { useState } from "react";

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, user: "Alex", text: "Welcome to the community! 🌟", time: "2m ago" },
    { id: 2, user: "Sam", text: "Having a peaceful evening here", time: "5m ago" },
    { id: 3, user: "Jordan", text: "Remember to take deep breaths everyone 🌸", time: "8m ago" },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now(), user: "You", text: message, time: "Just now" }]);
    setMessage("");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center animate-glow">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Chai Room ☕
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with others on their wellness journey over virtual chai
            </p>
          </div>

          {/* Chat Container */}
          <div className="glass-effect rounded-3xl p-6 shadow-2xl animate-slide-in">
            {/* Active Users */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/50 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-breathe" />
              <p className="text-sm text-muted-foreground">12 members online</p>
            </div>

            {/* Messages */}
            <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className="glass-effect rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-primary">{msg.user}</p>
                    <p className="text-xs text-muted-foreground">{msg.time}</p>
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Input */}
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

          {/* Guidelines */}
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
