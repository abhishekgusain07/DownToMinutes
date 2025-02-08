import { z } from "zod";
import { ActionItemStatus } from "../types";

export const actionItemFormSchema = z.object({
    plan_id: z.string().optional(),
    date: z.date({
      required_error: 'Date is required',
    }),
    duration: z.number().min(1, 'Duration must be at least 1 minute').int(),
    description: z.string().min(1, 'Description is required'),
    status: z.nativeEnum(ActionItemStatus),
    task_id: z.string().refine((val) => val === 'standalone' || val.length > 0, {
        message: 'Task is required'
    }),
});

export const subgoalFormSchema = z.object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters long" })
      .max(100, { message: "Title must not exceed 100 characters" }),
    description: z
      .string()
      .max(500, { message: "Description must not exceed 500 characters" })
      .optional(),
    frequency: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY", "ONE_TIME"], {
      required_error: "Please select a frequency",
    }),
    due_date: z.date({
      required_error: "Due date is required",
    }),
    goal_id: z.string({
      required_error: "Goal ID is required",
    }),
  });
  

export type SubgoalFormValues = z.infer<typeof subgoalFormSchema>;


export const taskFormSchema = z.object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters long" })
      .max(100, { message: "Title must not exceed 100 characters" }),
    description: z
      .string()
      .max(500, { message: "Description must not exceed 500 characters" })
      .optional(),
    status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "BLOCKED"], {
      required_error: "Please select a status",
    }),
    estimated_hours: z
      .number()
      .min(0.1, { message: "Estimated hours must be greater than 0" })
      .max(168, { message: "Estimated hours cannot exceed one week (168 hours)" }),
    due_date: z.date({
      required_error: "Due date is required",
    }),
    notes: z
      .string()
      .max(1000, { message: "Notes must not exceed 1000 characters" })
      .optional(),
  });
  
export type TaskFormValues = z.infer<typeof taskFormSchema>;