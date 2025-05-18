import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InsertTask, insertTaskSchema } from "@shared/schema";
import { PlusCircleIcon } from "lucide-react";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskAdded?: () => void;
}

export function AddTaskDialog({ open, onOpenChange, onTaskAdded }: AddTaskDialogProps) {
  const { toast } = useToast();
  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const createTask = useMutation({
    mutationFn: api.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "タスクが追加されました",
        variant: "default",
      });
      form.reset();
      onOpenChange(false);
      if (onTaskAdded) onTaskAdded();
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: "タスクの追加に失敗しました",
        variant: "destructive",
      });
      console.error("Error adding task:", error);
    },
  });

  const onSubmit = (data: InsertTask) => {
    createTask.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
              <PlusCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle>新しいタスクを追加</DialogTitle>
          </div>
          <DialogDescription>
            タスクの詳細を入力してください
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タイトル <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="タスクのタイトルを入力" 
                      {...field} 
                      disabled={createTask.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="タスクの詳細を入力（任意）" 
                      rows={3}
                      {...field} 
                      disabled={createTask.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createTask.isPending}
              >
                キャンセル
              </Button>
              <Button 
                type="submit" 
                disabled={createTask.isPending}
              >
                {createTask.isPending ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">◌</span>
                    追加中...
                  </span>
                ) : "追加する"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
