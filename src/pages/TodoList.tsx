import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const TodoList = () => {
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([
    { id: 1, text: "Morning meditation", completed: true },
    { id: 2, text: "Journal entry", completed: false },
    { id: 3, text: "Evening walk", completed: false },
  ]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
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

          {/* Add Task */}
          <div className="glass-effect rounded-3xl p-6 shadow-2xl mb-8 animate-slide-in">
            <div className="flex gap-2">
              <Input
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                className="transition-all duration-300 focus:scale-[1.01]"
              />
              <Button
                onClick={addTask}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 transition-all duration-300 hover:scale-110 animate-glow"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className="glass-effect rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="transition-all duration-300 hover:scale-110"
                />
                <span
                  className={`flex-1 transition-all duration-300 ${
                    task.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {task.text}
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

          {/* Stats */}
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
