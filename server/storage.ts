import { tasks, type Task, type InsertTask, type UpdateTask, users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Task CRUD operations
  getTasks(): Promise<Task[]>;
  getTaskById(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private taskStore: Map<number, Task>;
  private userCurrentId: number;
  private taskCurrentId: number;

  constructor() {
    this.users = new Map();
    this.taskStore = new Map();
    this.userCurrentId = 1;
    this.taskCurrentId = 1;

    // Add some initial tasks for testing
    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);
    const fiveDaysAgo = new Date(now);
    fiveDaysAgo.setDate(now.getDate() - 5);
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);

    this.createTask({
      title: 'プロジェクト計画書の作成',
      description: '次回のミーティングまでに計画書の草案を作成する'
    });

    const apiTask = this.createTask({
      title: 'APIドキュメントの更新',
      description: '新しいエンドポイントの仕様をドキュメントに反映させる'
    });
    // Mark as completed
    this.updateTask(apiTask.id, { 
      completed: true, 
      completed_at: twoDaysAgo 
    });

    this.createTask({
      title: 'バグ修正 #1234',
      description: 'ログイン画面でのバリデーションエラーを修正する'
    });

    const designTask = this.createTask({
      title: 'デザインレビュー',
      description: 'UIデザインの最終確認と承認'
    });
    // Mark as completed
    this.updateTask(designTask.id, { 
      completed: true, 
      completed_at: threeDaysAgo 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Task CRUD operations
  async getTasks(): Promise<Task[]> {
    return Array.from(this.taskStore.values());
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    return this.taskStore.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskCurrentId++;
    const now = new Date();
    
    const task: Task = {
      id,
      title: insertTask.title,
      description: insertTask.description || '',
      completed: false,
      created_at: now,
      completed_at: null,
    };
    
    this.taskStore.set(id, task);
    return task;
  }

  async updateTask(id: number, taskUpdate: Partial<Task>): Promise<Task | undefined> {
    const existingTask = this.taskStore.get(id);
    
    if (!existingTask) {
      return undefined;
    }
    
    // Handle completed_at timestamp when task is toggled
    let completed_at = existingTask.completed_at;
    if ('completed' in taskUpdate) {
      if (taskUpdate.completed && !existingTask.completed) {
        completed_at = new Date();
      } else if (taskUpdate.completed === false) {
        completed_at = null;
      }
    }
    
    const updatedTask: Task = {
      ...existingTask,
      ...taskUpdate,
      completed_at,
    };
    
    this.taskStore.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.taskStore.delete(id);
  }
}

export const storage = new MemStorage();
