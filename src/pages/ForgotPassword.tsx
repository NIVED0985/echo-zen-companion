import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setEmailSent(true);
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-breathe flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="glass-effect rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary animate-float" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Echo
              </h1>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
            <p className="text-muted-foreground">
              {emailSent ? "Check your email for the reset link" : "We'll send you a reset link"}
            </p>
          </div>

          {!emailSent ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2 animate-slide-in" style={{ animationDelay: "0.1s" }}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-all duration-300 focus:scale-[1.02]"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-all duration-300 hover:scale-[1.02] animate-glow"
                style={{ animationDelay: "0.2s" }}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-primary hover:underline transition-all animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </form>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center p-6 bg-primary/10 rounded-2xl">
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to <strong>{email}</strong>. Please check your inbox
                  and follow the instructions.
                </p>
              </div>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-primary hover:underline transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
