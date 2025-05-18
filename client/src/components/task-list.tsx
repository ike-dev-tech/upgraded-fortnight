import { TaskCard } from "./task-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlusIcon, InboxIcon } from "lucide-react";
import { TaskResponse } from "@shared/schema";

interface TaskListProps {
  tasks: TaskResponse[];
  isLoading: boolean;
  filter: "all" | "active" | "completed";
  totalTasks: number;
  onAddTask: () => void;
}

export function TaskList({ tasks, isLoading, filter, totalTasks, onAddTask }: TaskListProps) {
  // Show loading state
  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">タスク一覧</h2>
          <div className="text-sm text-gray-500">読み込み中...</div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <TaskSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state message based on filter
  const getEmptyStateMessage = () => {
    switch (filter) {
      case "all":
        return "タスクを追加してみましょう！";
      case "active":
        return "完了していないタスクはありません。";
      case "completed":
        return "完了したタスクはありません。";
      default:
        return "タスクがありません";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold dark:text-white">タスク一覧</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span>{tasks.length}</span> 件表示 / 全 <span>{totalTasks}</span> 件
        </p>
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-400 mb-3">
            <InboxIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">タスクがありません</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{getEmptyStateMessage()}</p>
          <Button onClick={onAddTask} className="px-4">
            <PlusIcon className="h-4 w-4 mr-1" />
            新しいタスクを追加
          </Button>
        </div>
      )}

      {/* Task Grid */}
      {tasks.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

function TaskSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-start space-x-2 w-full">
            <Skeleton className="h-5 w-5 rounded-full mt-1" />
            <div className="w-full">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/2 mt-4" />
      </div>
      <div className="border-t border-gray-100 dark:border-gray-700">
        <div className="flex">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      </div>
    </div>
  );
}
