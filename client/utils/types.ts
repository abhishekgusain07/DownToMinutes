import { NumberDomain } from "recharts/types/util/types";
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
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  BLOCKED = 'BLOCKED'
}

export enum ProgressType {
  TASK_BASED = 'TASK_BASED',
  TIME_BASED = 'TIME_BASED'
}

export enum Frequency {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  ONE_TIME = 'ONE_TIME'

}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  estimated_hours: number;
  actual_hours: number;
  due_date: Date;
  created_at: Date;
  updated_at: Date;
  notes?: string;
  subgoal_id: string;
}

export interface Subgoal {
  id: string;
  title: string;
  description?: string;
  frequency: Frequency;
  due_date: Date;
  created_at: Date;
  updated_at: Date;
  active: boolean;
  completed: boolean;
  goal_id: string;
  user_id: string;
  tasks ?: Task[];
  
  // Computed fields
  progress: number;        // Calculated from tasks completion (0-100)
  total_estimated_hours: number;  // Sum of all tasks' estimated hours
  total_actual_hours: number;     // Sum of all tasks' actual hours
  completion_rate?: number;       // actual_hours / estimated_hours
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
  priority: Priority;
  active: boolean;
  start_date: Date;
  end_date: Date;
  completed: boolean;
  user_id: string;
  progress_type: ProgressType;
  subgoals ?: Subgoal[];
  
  // Computed fields
  overall_progress: number;       // Average progress of all subgoals (0-100)
  total_estimated_hours: number;  // Sum of all subgoals' estimated hours
  total_actual_hours: number;     // Sum of all subgoals' actual hours
  completion_rate?: number;       // actual_hours / estimated_hours
}

// Input types for creating/updating
export interface CreateTaskInput {
  title: string;
  description?: string;
  estimated_hours: number;
  due_date: Date;
  notes?: string;
  subgoal_id: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
  status?: TaskStatus;
  actual_hours?: number;
}

export interface CreateSubgoalInput {
  title: string;
  description?: string;
  frequency: Frequency;
  due_date: Date;
  goal_id: string;
  tasks?: CreateTaskInput[];
}

export interface UpdateSubgoalInput extends Partial<CreateSubgoalInput> {
  id: string;
  active?: boolean;
  completed?: boolean;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  priority: Priority;
  start_date: Date;
  end_date: Date;
  progress_type: ProgressType;
  subgoals?: CreateSubgoalInput[];
}

export interface UpdateGoalInput extends Partial<CreateGoalInput> {
  id: string;
  active?: boolean;
  completed?: boolean;
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
  sender_id: string
  receiver_id: string
  sender: User
  receiver: User
}

export interface FriendRequestWithUser {
  id: string
  created_at: Date
  sender_id: string
  receiver_id: string
  senderData: User | null
  receiverData ?: User | null
}

export type Friendship = {
  id: string
  created_at: Date
  isDeleted: boolean
  deletedAt: Date | null
  user1_id: string
  user2_id: string
  user1: User
  user2: User
  accountability_settings?: AccountabilitySettings[]
  notifications?: Notification[]
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
  isArchived: boolean
  archivedAt: Date | null
  sender_id: string
  receiver_id: string
  sender: User
  receiver: User
  activities_completed: number
  goals_progressed: number
  main_achievements: string
}

export type User = {
  id: string
  created_time: Date
  email: string
  first_name: string | null
  last_name: string | null
  gender: string | null
  profile_image_url: string | null
  user_id: string
  subscription: string | null
  isDeleted: boolean
  deletedAt: Date | null
  goals?: Goal[]
  subgoals?: Subgoal[]
  days?: Day[]
  activities?: Activity[]
  tags?: Tag[]
  daily_hour_limit ?: number
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
  id: string;
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
  user_id: string
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
  isArchived: boolean
  archivedAt: Date | null
  user_id: string
  tags: Tag[]
  entries: Entry[]
}

export type Tag = {
  id: string
  name: string
  color?: string
  created_at: Date
  user_id: string
  activities: Activity[]
}

export interface FriendInfo {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  user_id: string;
  profile_image_url: string | null;
}

export enum NotificationType {
  FRIEND_REQUEST_RECEIVED = "FRIEND_REQUEST_RECEIVED",
  FRIEND_REQUEST_ACCEPTED = "FRIEND_REQUEST_ACCEPTED",
  DAILY_SUMMARY = "DAILY_SUMMARY",
  GOAL_COMPLETED = "GOAL_COMPLETED",
  SUBGOAL_COMPLETED = "SUBGOAL_COMPLETED",
  STREAK_MILESTONE = "STREAK_MILESTONE",
  ACCOUNTABILITY_REPORT_RECEIVED = "ACCOUNTABILITY_REPORT_RECEIVED",
  ACCOUNTABILITY_REMINDER = "ACCOUNTABILITY_REMINDER"
}

export interface Notification {
  id: string;
  createdAt: Date;
  isArchived: boolean
  archivedAt: Date | null
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  
  // Recipient user
  userId: string;
  user?: User;
  
  // Optional relations based on notification type
  goalId?: string;
  goal?: Goal;
  
  subgoalId?: string;
  subgoal?: Subgoal;
  
  dayId?: string;
  day?: Day;
  
  friendshipId?: string;
  friendship?: Friendship;
  
  reportId?: string;
  report?: AccountabilityReport;
}

export type SubgoalSuggestion = {
  title: string;
  description?: string;
  frequency: Frequency;
  due_date?: Date;
};

export enum PlanStatus {
  NOT_STARTED = "NOT_STARTED",
  STARTED = "STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  NOT_DONE = "NOT_DONE"
}

export interface Plan {
  id: string;
  task: string;
  description?: string;
  from_time: string;
  to_time: string;
  status: PlanStatus;
  effectiveness: number;
  distractions: number;
  note?: string;
  created_at: Date;
  updated_at: Date;
  day_id: string;
}
export interface Action{
  id: string;
  title: string;
  duration: number;
  completed: boolean;
  task_id: string;
  day_id: string;
  note?: string;
  created_at: Date;
  updated_at: Date;

}
export interface TaskActionPlan {
  id: string;
  task: Task;
  task_id: string;
  user: User;
  user_id: string;
  version: number;
  start_date: Date;
  end_date: Date;
  actionItems: ActionItem[];
  created_at: Date;
  updated_at: Date;
}

export interface ActionItem {
  id: string;
  plan_id ?: string;
  date: Date;
  duration: number;
  description: string;
  status: ActionItemStatus;
  task_id: string;
  day_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface PartialActionItem {
  id: string;
  date: Date;
  duration: number;
  description: string;
}

export enum ActionItemStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  SKIPPED = "SKIPPED"
}

export interface PlanFeedback {
  id: string;
  created_at: Date;
  day_id: string;
  overall_summary: string;
  achievements: string[];
  improvement_areas: string[];
  recommendations: string[];
  productivity_score: number;
  goal_alignment?: string;
  time_management?: string;
  pattern_insights?: string;
}

export enum MilestoneType {
  COMPLETION_PERCENTAGE = "COMPLETION_PERCENTAGE",
  TIME_BASED = "TIME_BASED",
  TASK_COUNT = "TASK_COUNT",
  CUSTOM = "CUSTOM"
}

export enum NotificationUrgency {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}

export interface AccountabilityGroup {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
  isArchived: boolean
  archivedAt: Date | null
  creator_id: string;
  creator: User;
  members: AccountabilityGroupMember[];
}

export interface AccountabilityGroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: Date;
  group: AccountabilityGroup;
  user: User;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  goal_updates: boolean;
  milestones: boolean;
  accountability: boolean;
  reminders: boolean;
  quiet_hours_start: Date | null;
  quiet_hours_end: Date | null;
  created_at: Date;
  updated_at: Date;
}