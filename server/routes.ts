import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, updateTaskSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Get all tasks
  app.get("/api/tasks", async (req: Request, res: Response) => {
    try {
      const tasks = await storage.getTasks();
      // Format dates as ISO strings
      const formattedTasks = tasks.map(task => ({
        ...task,
        created_at: task.created_at.toISOString(),
        completed_at: task.completed_at ? task.completed_at.toISOString() : null
      }));
      res.json(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "タスクの取得に失敗しました" });
    }
  });

  // Get a specific task
  app.get("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "無効なIDです" });
      }

      const task = await storage.getTaskById(id);
      if (!task) {
        return res.status(404).json({ message: "タスクが見つかりません" });
      }

      // Format dates as ISO strings
      const formattedTask = {
        ...task,
        created_at: task.created_at.toISOString(),
        completed_at: task.completed_at ? task.completed_at.toISOString() : null
      };

      res.json(formattedTask);
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ message: "タスクの取得に失敗しました" });
    }
  });

  // Create a new task
  app.post("/api/tasks", async (req: Request, res: Response) => {
    try {
      const validationResult = insertTaskSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const taskData = validationResult.data;
      const newTask = await storage.createTask(taskData);
      
      // Format dates as ISO strings
      const formattedTask = {
        ...newTask,
        created_at: newTask.created_at.toISOString(),
        completed_at: newTask.completed_at ? newTask.completed_at.toISOString() : null
      };
      
      res.status(201).json(formattedTask);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "タスクの作成に失敗しました" });
    }
  });

  // Update a task (toggle completion or edit details)
  app.patch("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "無効なIDです" });
      }

      // If we're updating completion status
      if ('completed' in req.body) {
        const validationResult = updateTaskSchema.safeParse(req.body);
        if (!validationResult.success) {
          const errorMessage = fromZodError(validationResult.error).message;
          return res.status(400).json({ message: errorMessage });
        }
      }
      
      const updatedTask = await storage.updateTask(id, req.body);
      if (!updatedTask) {
        return res.status(404).json({ message: "タスクが見つかりません" });
      }
      
      // Format dates as ISO strings
      const formattedTask = {
        ...updatedTask,
        created_at: updatedTask.created_at.toISOString(),
        completed_at: updatedTask.completed_at ? updatedTask.completed_at.toISOString() : null
      };
      
      res.json(formattedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "タスクの更新に失敗しました" });
    }
  });

  // Delete a task
  app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "無効なIDです" });
      }

      const exists = await storage.getTaskById(id);
      if (!exists) {
        return res.status(404).json({ message: "タスクが見つかりません" });
      }

      const success = await storage.deleteTask(id);
      if (!success) {
        return res.status(500).json({ message: "タスクの削除に失敗しました" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "タスクの削除に失敗しました" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
