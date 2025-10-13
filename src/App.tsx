import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import AICompanion from "./pages/AICompanion";
import VoiceJournal from "./pages/VoiceJournal";
import TodoList from "./pages/TodoList";
import ChatRoom from "./pages/ChatRoom";
import EmergencySOS from "./pages/EmergencySOS";
import MoodTracker from "./pages/MoodTracker";
import HabitTracker from "./pages/HabitTracker";
import BreathingExercises from "./pages/BreathingExercises";
import Soundscapes from "./pages/Soundscapes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/ai-companion" element={<AICompanion />} />
          <Route path="/voice-journal" element={<VoiceJournal />} />
          <Route path="/todo-list" element={<TodoList />} />
          <Route path="/chai-room" element={<ChatRoom />} />
          <Route path="/chat-room" element={<ChatRoom />} /> {/* Keep old route for compatibility */}
          <Route path="/emergency-sos" element={<EmergencySOS />} />
          <Route path="/mood-tracker" element={<MoodTracker />} />
          <Route path="/habit-tracker" element={<HabitTracker />} />
          <Route path="/breathing-exercises" element={<BreathingExercises />} />
          <Route path="/soundscapes" element={<Soundscapes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
