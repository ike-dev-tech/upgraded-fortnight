import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define tasks table schema
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
  completed_at: timestamp("completed_at"),
});

// Define Zod schemas for validation
export const insertTaskSchema = createInsertSchema(tasks)
  .pick({
    title: true,
    description: true,
  })
  .extend({
    title: z.string().min(1, { message: "タイトルは必須です" }).max(100, { message: "タイトルは100文字以内にしてください" }),
    description: z.string().max(500, { message: "説明は500文字以内にしてください" }).optional(),
  });

export const updateTaskSchema = createInsertSchema(tasks)
  .pick({
    completed: true,
  })
  .extend({
    completed: z.boolean(),
  });

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// Task response type with formatted timestamps
export type TaskResponse = Omit<Task, 'created_at' | 'completed_at'> & {
  created_at: string;
  completed_at: string | null;
};
