import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Sparkles } from "lucide-react";
import { useState } from "react";

const AICompanion = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: "assistant", content: "Hello! I'm here to listen and support you. How are you feeling today?" }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages([...messages, { role: "user", content: message }]);
    setMessage("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Thank you for sharing. I'm here to support you through this journey. Would you like to tell me more?" 
      }]);
    }, 1000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-glow">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI Companion
            </h1>
            <p className="text-lg text-muted-foreground">
              Your empathetic friend, always here to listen
            </p>
          </div>

          {/* Chat Container */}
          <div className="glass-effect rounded-3xl p-6 shadow-2xl animate-slide-in">
            <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-primary to-secondary text-white'
                        : 'glass-effect'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <Sparkles className="w-4 h-4 inline mr-2 animate-float" />
                    )}
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Textarea
                placeholder="Share your thoughts..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                className="resize-none transition-all duration-300 focus:scale-[1.01]"
              />
              <Button
                onClick={handleSend}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all duration-300 hover:scale-110 animate-glow"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {['Empathetic Listening', '24/7 Available', 'Private & Secure'].map((feature, index) => (
              <div
                key={feature}
                className="glass-effect rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 animate-slide-up"
                style={{ animationDelay: `${(index + 3) * 0.1}s` }}
              >
                <Sparkles className="w-8 h-8 mx-auto mb-3 text-primary animate-breathe" />
                <h3 className="font-semibold">{feature}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AICompanion;
