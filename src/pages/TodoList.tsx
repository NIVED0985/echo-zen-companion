import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TodoList = () => {
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tasks, setTasks] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTasks(data);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('tasks').insert({
      user_id: user.id,
      title: newTask,
      priority,
      completed: false,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    } else {
      setNewTask("");
      setPriority("medium");
      loadTasks();
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !completed })
      .eq('id', id);

    if (!error) {
      loadTasks();
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (!error) {
      toast({
        title: "Deleted",
        description: "Task removed",
      });
      loadTasks();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center animate-glow">
                <CheckSquare className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              To-Do List
            </h1>
            <p className="text-lg text-muted-foreground">
              Organize your tasks with mindful intention
            </p>
          </div>

          <div className="glass-effect rounded-3xl p-6 shadow-2xl mb-8 animate-slide-in">
            <div className="flex gap-2">
              <Input
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                className="transition-all duration-300 focus:scale-[1.01]"
              />
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={addTask}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 transition-all duration-300 hover:scale-110 animate-glow"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className="glass-effect rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id, task.completed)}
                  className="transition-all duration-300 hover:scale-110"
                />
                <span
                  className={`flex-1 transition-all duration-300 ${
                    task.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {task.title}
                </span>
                <span className={`text-xs font-semibold uppercase ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                  className="transition-all duration-300 hover:scale-110 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="glass-effect rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <p className="text-3xl font-bold text-primary animate-breathe">
                {tasks.filter(t => t.completed).length}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="glass-effect rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <p className="text-3xl font-bold text-secondary animate-breathe">
                {tasks.filter(t => !t.completed).length}
              </p>
              <p className="text-sm text-muted-foreground">Remaining</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TodoList;
