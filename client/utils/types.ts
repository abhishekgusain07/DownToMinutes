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

export enum FriendshipStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED"
}

export type FriendRequest = {
  id: string
  created_at : Date
  status: FriendshipStatus
  sender_id: number
  receiver_id: number
  sender: User
  receiver: User
}

export interface FriendRequestWithUser {
  id: string
  created_at: Date
  sender_id: number
  receiver_id: number
  senderData: User | null
  receiverData ?: User | null
}

export type Friendship = {
  id: string
  created_at: Date
  user1_id: number
  user2_id: number
  user1: User
  user2: User
  accountability_settings?: AccountabilitySettings
}

export type AccountabilitySettings = {
  id: string
  created_at: Date
  updated_at: Date
  friendship_id: string
  friendship: Friendship
  share_enabled: boolean
  frequency: "DAILY" | "WEEKLY"
  reminder_time?: Date
}

export type AccountabilityReport = {
  id: string
  created_at: Date
  report_date: Date
  sender_id: number
  receiver_id: number
  sender: User
  receiver: User
  activities_completed: number
  goals_progressed: number
  main_achievements: string
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
  goals?: Goal[]
  subgoals?: Subgoal[]
  days?: Day[]
  activities?: Activity[]
  tags?: Tag[]
  sent_friend_requests?: FriendRequest[]
  received_friend_requests?: FriendRequest[]
  friendships_as_user1?: Friendship[]
  friendships_as_user2?: Friendship[]
  sent_reports?: AccountabilityReport[]
  received_reports?: AccountabilityReport[]
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

export enum Mood {
  VERY_PRODUCTIVE = "VERY_PRODUCTIVE",
  PRODUCTIVE = "PRODUCTIVE",
  NEUTRAL = "NEUTRAL",
  UNPRODUCTIVE = "UNPRODUCTIVE",
  VERY_UNPRODUCTIVE = "VERY_UNPRODUCTIVE"
}

export type Day = {
  id: string
  date: Date
  mood?: Mood
  summary?: string
  energy_level?: number
  created_at: Date
  updated_at: Date
  user_id: number
  entries: Entry[]
  total_focus_time?: number
  distractions: string[]
  highlights: string[]
}

export type Activity = {
  id: string
  title: string
  description?: string
  category: ActivityCategory
  duration: number
  created_at: Date
  updated_at: Date
  user_id: number
  tags: Tag[]
  entries: Entry[]
}

export type Tag = {
  id: string
  name: string
  color?: string
  created_at: Date
  user_id: number
  activities: Activity[]
}