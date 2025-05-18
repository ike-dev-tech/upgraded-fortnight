import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { api } from "@/lib/api";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangleIcon } from "lucide-react";

interface DeleteTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: number;
  taskTitle: string;
}

export function DeleteTaskDialog({ open, onOpenChange, taskId, taskTitle }: DeleteTaskDialogProps) {
  const { toast } = useToast();

  const deleteTask = useMutation({
    mutationFn: () => api.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "タスクが削除されました",
        variant: "default",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "エラー",
        description: "タスクの削除に失敗しました",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteTask.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
              <AlertTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle>タスクを削除</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            <p className="mb-2">本当に以下のタスクを削除しますか？</p>
            <p className="font-medium text-foreground">{taskTitle}</p>
            <p className="mt-2">この操作は取り消せません。</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteTask.isPending}>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteTask.isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {deleteTask.isPending ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">◌</span>
                削除中...
              </span>
            ) : "削除する"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
