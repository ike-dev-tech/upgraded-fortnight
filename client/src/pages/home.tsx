import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TaskList } from "@/components/task-list";
import { TaskFilters } from "@/components/task-filters";
import TaskIcon from "../components/icons/task-icon";
import { api } from "@/lib/api";
import { useState } from "react";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function Home() {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  
  const { data: tasks, isLoading, refetch } = useQuery({
    queryKey: ["/api/tasks"],
    queryFn: api.getTasks,
  });

  // Handle filter change
  const handleFilterChange = (value: "all" | "active" | "completed") => {
    setFilter(value);
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks ? tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  }) : [];

  useEffect(() => {
    document.title = "Task Manager - タスク一覧";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm dark:bg-gray-800 dark:border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-primary flex items-center dark:text-blue-400">
            <TaskIcon className="w-6 h-6 mr-2" />
            Task Manager
          </h1>
          <Button onClick={() => setIsAddTaskDialogOpen(true)} size="sm" className="px-4">
            <PlusIcon className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">タスク追加</span>
            <span className="sm:hidden">追加</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <TaskFilters 
          currentFilter={filter} 
          onFilterChange={handleFilterChange} 
        />
        
        <TaskList 
          tasks={filteredTasks} 
          isLoading={isLoading}
          filter={filter}
          totalTasks={tasks?.length || 0}
          onAddTask={() => setIsAddTaskDialogOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-4 dark:bg-gray-800 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Task Manager &copy; {new Date().getFullYear()} - React/Express Application</p>
        </div>
      </footer>

      {/* Add Task Dialog */}
      <AddTaskDialog 
        open={isAddTaskDialogOpen}
        onOpenChange={setIsAddTaskDialogOpen}
        onTaskAdded={() => refetch()}
      />
    </div>
  );
}
