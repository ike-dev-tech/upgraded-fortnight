import { apiRequest } from "./queryClient";
import { TaskResponse, InsertTask } from "@shared/schema";

// API functions for tasks
export const api = {
  // Get all tasks
  getTasks: async (): Promise<TaskResponse[]> => {
    const response = await apiRequest("GET", "/api/tasks");
    return response.json();
  },
  
  // Get a specific task
  getTask: async (id: number): Promise<TaskResponse> => {
    const response = await apiRequest("GET", `/api/tasks/${id}`);
    return response.json();
  },
  
  // Create a new task
  createTask: async (task: InsertTask): Promise<TaskResponse> => {
    const response = await apiRequest("POST", "/api/tasks", task);
    return response.json();
  },
  
  // Toggle task completion
  toggleTaskCompletion: async (id: number, completed: boolean): Promise<TaskResponse> => {
    const response = await apiRequest("PATCH", `/api/tasks/${id}`, { completed });
    return response.json();
  },
  
  // Delete a task
  deleteTask: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/tasks/${id}`);
  }
};
