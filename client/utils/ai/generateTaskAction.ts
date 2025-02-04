"use server";
import OpenAI from "openai";
import { z } from "zod";
import { Task, Action, PartialActionItem } from "../types";
import { uid } from "uid";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Zod schema for validating an Action
const ActionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  description: z.string(),
  duration: z.number(),
});

// Type for the parsed Action schema
type ActionSchemaType = z.infer<typeof ActionSchema>;

// Convert ActionSchema to PartialActionItem and generate a valid ID
function convertToPartialActionItem(action: ActionSchemaType): PartialActionItem {
  return {
    id: uid(32), // Generate a new 32-character ID
    date: new Date(action.date),
    description: action.description,
    duration: action.duration,
  };
}

export async function generateTaskActions({
  task,
}: {
  task: Task;
}): Promise<PartialActionItem[] | null> {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Improved system prompt:
    // - Specify that today's date is the current date.
    // - Actions should be scheduled from today until task.due_date.
    // - The total allocated duration equals (estimated_hours - actual_hours) * 60.
    const systemPrompt = `You are a productivity assistant.
Generate a list of daily actions that break down a task.
Each action must include:
  - id: a unique 32-character UID,
  - date: a scheduled date in YYYY-MM-DD format,
  - description: a short description that incorporates the task title and, if available, its description,
  - duration: the duration in minutes allocated for that action.
Schedule the actions starting from today's date (${today}) until the task's due_date.
The total duration across all actions must equal (task.estimated_hours - task.actual_hours) * 60 minutes.
Distribute the time as evenly as possible over the days from today to the due_date.`;

    const userPrompt = `Generate daily actions for the following task:
Task Title: ${task.title}
Task Description: ${task.description ?? "No description provided"}
Estimated Hours: ${task.estimated_hours}
Actual Hours: ${task.actual_hours}
Due Date: ${task.due_date}
Remember: the remaining time is (estimated_hours - actual_hours) hours.`;

    // Call OpenAI with function calling enabled.
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "get_actions",
            description: "Generate daily actions for a given task",
            parameters: {
              type: "object",
              properties: {
                actions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      date: {
                        type: "string",
                        description: "The date for this action in YYYY-MM-DD format",
                      },
                      description: {
                        type: "string",
                        description: "A short description of the action",
                      },
                      duration: {
                        type: "number",
                        description:
                          "Duration in minutes allocated to this action. The sum over all actions equals (task.estimated_hours - task.actual_hours) * 60",
                      },
                    },
                    required: ["date", "description", "duration"],
                  },
                },
              },
              required: ["actions"],
            },
          },
        },
      ],
      // Force the model to respond with a function call matching our defined tool.
      tool_choice: { type: "function", function: { name: "get_actions" } },
    });

    // Parse the function call's arguments from the response.
    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (!toolCall) {
      console.error("No function call was made in the response.");
      return null;
    }

    const args = JSON.parse(toolCall.function.arguments);
    const validation = z
      .object({ actions: z.array(ActionSchema) })
      .safeParse(args);

    if (!validation.success) {
      console.error("Validation failed:", validation.error);
      return null;
    }

    // Convert ActionSchema to PartialActionItem
    const actions = validation.data.actions.map(convertToPartialActionItem);

    return actions;
  } catch (error) {
    console.error("Error generating actions:", error);
    return null;
  }
}
