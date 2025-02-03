"use server";
import OpenAI from "openai";
import { Action, Goal, Task } from "../types";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { fetchAllActiveGoals } from "../data/goals/fetchAllActiveGoals";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Zod schema for validation
const ActionSchema = z.object({
  title: z.string(),
  duration: z.number().min(15).max(120),
  task_title: z.string(),
  task_id: z.string(),
  day_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
});

export async function generateDailyActions({
  tasks
}: {
  tasks: Task[];
}): Promise<Action[] | null> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const goals = await fetchAllActiveGoals();
    if (!goals?.length) return null;

    // Prepare task map for validation
    const taskMap = new Map<string, Task>(
      tasks.map(task => [task.id, task])
    );

    const systemPrompt = `You are a productivity coach specializing in breaking down goals into daily executable actions. 
    Analyze the user's goals, subgoals, and tasks to generate daily atomic actions. Follow these rules:
    1. Convert tasks into 15-120 minute actions
    2. Balance learning, practice, and project work
    3. Prioritize by goal priority and deadlines
    4. Use ISO dates (YYYY-MM-DD) for scheduling`;

    const userPrompt = `Generate daily actions for these goals:
    ${goals.map(goal => `
    Goal: ${goal.title} (Priority: ${goal.priority})
    Timeline: ${goal.start_date} to ${goal.end_date}
    ${goal.subgoals?.map(subgoal => `
    - Subgoal: ${subgoal.title}
      ${subgoal.tasks?.map(task => `
      * Task: ${task.title} (ID:${task.id}, ${task.estimated_hours}h)`).join('')}
    `).join('')}
    `).join('')}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      tools: [{
        type: "function",
        function: {
          name: "generate_actions",
          description: "Generate daily actionable items for goal achievement",
          parameters: {
            type: "object",
            properties: {
              actions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description: "Action title (e.g., 'Practice React Hooks')"
                    },
                    duration: {
                      type: "number",
                      description: "Duration in minutes (15-120)"
                    },
                    task_title: {
                      type: "string",
                      description: "Exact title of the parent task"
                    },
                    task_id: {
                      type: "string",
                      description: "ID of the parent task"
                    },
                    day_date: {
                      type: "string",
                      description: "Scheduled date in YYYY-MM-DD format"
                    },
                    notes: {
                      type: "string",
                      description: "Optional implementation notes"
                    }
                  },
                  required: ["title", "duration", "task_title", "task_id", "day_date"]
                }
              }
            },
            required: ["actions"]
          }
        }
      }],
      tool_choice: {
        type: "function",
        function: { name: "generate_actions" }
      }
    });

    // Extract and validate response
    const args = JSON.parse(
      response.choices[0].message.tool_calls![0].function.arguments
    );
    
    const validation = z.object({
      actions: z.array(ActionSchema)
    }).safeParse(args);

    if (!validation.success) {
      console.error("Validation failed:", validation.error);
      return null;
    }

    // Map validated data to Action structure
    const date = new Date();
    return validation.data.actions.map(action => {
      const task = taskMap.get(action.task_id);
      if (!task) throw new Error(`Invalid task ID: ${action.task_id}`);

      return {
        id: crypto.randomUUID(), // Generate unique ID
        title: action.title,
        duration: action.duration,
        completed: false,
        task_id: action.task_id,
        day_id: "", // You'll need to implement day_id lookup
        notes: action.notes,
        created_at: new Date(),
        updated_at: new Date()
      };
    });

  } catch (error) {
    console.error("Error generating actions:", error);
    return null;
  }
}