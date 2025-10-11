import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, LogOut, Moon, Sun, Home } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "Come back soon for your moment of peace.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen gradient-calm">
      {/* Header */}
      <header className="glass-effect border-b border-border/50 sticky top-0 z-50 animate-slide-in">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={() => navigate("/home")}
          >
            <Sparkles className="w-6 h-6 text-primary animate-float" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Echo
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/home")}
              className="rounded-full transition-all duration-300 hover:scale-110"
            >
              <Home className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full transition-all duration-300 hover:scale-110 animate-breathe"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="gap-2 transition-all duration-300 hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="animate-fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20 animate-slide-up">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">© 2024 Echo - Your Mental Health Companion</p>
            <div className="flex items-center justify-center gap-4">
              <a href="#" className="hover:text-primary transition-all duration-300 hover:scale-110">Contact</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-all duration-300 hover:scale-110">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-all duration-300 hover:scale-110">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
