import { useState } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { api } from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckIcon, RefreshCcwIcon, TrashIcon } from "lucide-react";
import { TaskResponse } from "@shared/schema";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface TaskCardProps {
  task: TaskResponse;
}

export function TaskCard({ task }: TaskCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    
    return format(new Date(dateString), "yyyy年MM月dd日", { locale: ja });
  };

  // Toggle task completion status
  const toggleCompletion = useMutation({
    mutationFn: () => api.toggleTaskCompletion(task.id, !task.completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: task.completed ? "タスクを未完了に戻しました" : "タスクを完了にしました",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "エラー",
        description: "タスクの更新に失敗しました",
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <div 
        className={cn(
          "bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transform transition duration-200 hover:shadow-md",
          task.completed ? "border-l-4 border-green-500" : ""
        )}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        onFocus={() => setShowActions(true)}
        onBlur={() => setShowActions(false)}
      >
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-start space-x-2">
              <Checkbox 
                checked={task.completed}
                onCheckedChange={() => toggleCompletion.mutate()}
                className={cn(
                  "mt-1 flex-shrink-0 h-5 w-5",
                  task.completed ? "bg-green-500 border-green-500" : ""
                )}
              />
              <div>
                <h3 
                  className={cn(
                    "font-medium leading-snug dark:text-white",
                    task.completed ? "line-through text-gray-400 dark:text-gray-500" : ""
                  )}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p 
                    className={cn(
                      "text-sm text-gray-500 mt-1 dark:text-gray-400",
                      task.completed ? "text-gray-400 dark:text-gray-600" : ""
                    )}
                  >
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            <Badge 
              variant={task.completed ? "outline" : "secondary"}
              className={cn(
                "text-xs font-medium",
                task.completed ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              )}
            >
              {task.completed ? "完了" : "未完了"}
            </Badge>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex justify-between items-center">
            <div>
              作成日: <span>{formatDate(task.created_at)}</span>
            </div>
            {task.completed && task.completed_at && (
              <div className="text-gray-500">
                完了日: <span>{formatDate(task.completed_at)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div 
          className={cn(
            "flex border-t border-gray-100 dark:border-gray-700 transition-opacity",
            showActions ? "opacity-100" : "opacity-0 sm:opacity-100"
          )}
        >
          <Button 
            variant="ghost"
            onClick={() => toggleCompletion.mutate()}
            className={cn(
              "flex-1 py-2 text-sm justify-center rounded-none",
              task.completed 
                ? "text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950" 
                : "text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
            )}
            disabled={toggleCompletion.isPending}
          >
            {toggleCompletion.isPending ? (
              <span className="animate-spin mr-1">◌</span>
            ) : task.completed ? (
              <RefreshCcwIcon className="h-4 w-4 mr-1" />
            ) : (
              <CheckIcon className="h-4 w-4 mr-1" />
            )}
            <span>{task.completed ? "未完了に戻す" : "完了にする"}</span>
          </Button>
          <Button 
            variant="ghost"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex-1 py-2 text-sm justify-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-none"
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            削除
          </Button>
        </div>
      </div>

      <DeleteTaskDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        taskId={task.id}
        taskTitle={task.title}
      />
    </>
  );
}
