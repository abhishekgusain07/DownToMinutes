import { z } from "zod";

export type userCreateProps = z.infer<typeof userCreateSchema>;

const userCreateSchema = z.object({
  email: z.string().email({ message: "Invalid email" }).describe("user email"),
  first_name: z
    .string()
    .regex(/^[a-zA-Z]+$/, { message: "First name must only contain letters" })
    .min(3, { message: "First name is required" })
    .describe("user first name"),
  last_name: z
    .string()
    .regex(/^[a-zA-Z]+$/, { message: "Last name must only contain letters" })
    .min(3, { message: "Last name is required" })
    .describe("user last name"),
  profile_image_url: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .describe("user profile image URL"),
  user_id: z.string().describe("user ID"),
});

export type userUpdateProps = z.infer<typeof userUpdateSchema>;

const userUpdateSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email" })
    .nonempty({ message: "Email is required" })
    .describe("user email"),
  first_name: z
    .string()
    .regex(/^[a-zA-Z]+$/, { message: "First name must only contain letters" })
    .describe("user first name"),
  last_name: z
    .string()
    .regex(/^[a-zA-Z]+$/, { message: "Last name must only contain letters" })
    .describe("user last name"),
  profile_image_url: z
    .string()
    .url({ message: "Invalid URL" })
    .optional()
    .describe("user profile image URL"),
  user_id: z.string().describe("user ID"),
});

export enum Priority { 
  LOW,
  MEDIUM,
  HIGH
}

export enum Frequency {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  YEARLY = "YEARLY"
}

export interface Goal {
  id: number;
  title: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  priority: Priority
  active: boolean;
  start_date: Date;
  end_date: Date;
  completed: boolean;
  user_id: number;
  subgoals?: Subgoal[];
}

export interface Subgoal {
  id: number;
  title: string;
  description?: string;
  frequency: Frequency;
  due_date: Date;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
  goal_id: number;
  user_id: number;
}

export type User = {
  id: number
  created_time: Date
  email: string
  first_name: string | null
  last_name: string | null
  gender: string | null
  profile_image_url: string | null
  user_id: string
  subscription: string | null
}

export interface DayEntry {
  id: string;
  date: string;
  mood?: string;
  summary?: string;
  energy_level?: number;
  created_at: string;
  updated_at: string;
  total_focus_time?: number;
  distractions: string[];
  highlights: string[];
  entries: Entry[];
}

export enum ActivityCategory {
  WORK = "WORK",
  STUDY = "STUDY",
  EXERCISE = "EXERCISE",
  LEISURE = "LEISURE",
  SOCIAL = "SOCIAL",
  SELF_CARE = "SELF_CARE",
  OTHER = "OTHER"
}

export interface Entry {
  id: string;
  start_time: string;
  end_time: string;
  title: string;
  description?: string;
  category: ActivityCategory;
  focus_score?: number;
  energy_level?: number;
  interruptions?: number;
  location?: string;
  created_at: string;
  updated_at: string;
  day_id: string;
  activity_id?: string;
}

export interface FilteredUsers {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  profile_image_url: string | null;
  user_id: string;
}