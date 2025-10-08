import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Phone, Heart, AlertCircle, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EmergencySOS = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "" });
  const { toast } = useToast();

  const hotlines = [
    { name: "National Suicide Prevention", number: "988", description: "24/7 Crisis support" },
    { name: "Crisis Text Line", number: "Text HOME to 741741", description: "Text-based support" },
    { name: "SAMHSA Helpline", number: "1-800-662-4357", description: "Mental health & substance abuse" },
  ];

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setContacts(data);
    }
  };

  const handleSaveContact = async () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in name and phone number",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('emergency_contacts').insert({
      user_id: user.id,
      name: newContact.name,
      phone: newContact.phone,
      relationship: newContact.relationship,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save contact",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Emergency contact added",
      });
      setNewContact({ name: "", phone: "", relationship: "" });
      setIsDialogOpen(false);
      loadContacts();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('emergency_contacts').delete().eq('id', id);

    if (!error) {
      toast({
        title: "Deleted",
        description: "Contact removed",
      });
      loadContacts();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
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
                onClick={() => window.location.href = 'tel:988'}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call 988 Now
              </Button>
            </div>
          </div>

          <div className="space-y-4 mb-8">
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
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold animate-slide-in">Your Emergency Contacts</h2>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-red-500 to-rose-500 hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
            {contacts.map((contact, index) => (
              <Card
                key={contact.id}
                className="glass-effect p-6 transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                style={{ animationDelay: `${(index + 3) * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{contact.name}</h3>
                    <p className="text-primary font-mono">{contact.phone}</p>
                    {contact.relationship && (
                      <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(contact.id)}
                    className="hover:text-destructive"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

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
                  style={{ animationDelay: `${(index + 6) * 0.1}s` }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0 animate-breathe" />
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Emergency Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                />
                <Input
                  placeholder="Phone number"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                />
                <Input
                  placeholder="Relationship (optional)"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveContact} className="bg-gradient-to-r from-red-500 to-rose-500">
                  Save Contact
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default EmergencySOS;
