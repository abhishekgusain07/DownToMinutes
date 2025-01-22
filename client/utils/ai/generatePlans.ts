"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Goal, Plan } from "../types";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getGoal } from "../data/goals/getGoal";
import { fetchAllActiveGoals } from "../data/goals/fetchAllActiveGoals";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generatePlans(): Promise<Plan[] | null> {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }
        const goals: Goal[] | null = await fetchAllActiveGoals();
        if (!goals || goals.length === 0) {
            return null;
        }
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const allPlans: Plan[] = [];

        for (const goal of goals) {
            const prompt = `As an AI assistant, analyze this goal and suggest realistic, actionable plans.\n        Goal Title: ${goal.title}\n        ${goal.description ? `Goal Description: ${goal.description}` : ''}\n        Timeline: From ${goal.start_date} to ${goal.end_date}\n\n        Current Active Subgoals: \n\n        Please provide a list of 1-2 plans in the following JSON format:\n        [{\n            "id": "unique-id",\n            "task": "Plan title",\n            "description": "Brief description of what needs to be done",\n            "start_time": "start time in ISO format",\n            "end_time": "end time in ISO format",\n            "status": "NOT_STARTED/STARTED/IN_PROGRESS",\n            "effectiveness": 0, // a number representing effectiveness\n            "distractions": 0, // a number representing distractions\n            "note": "optional note",\n            "created_at": "creation date in ISO format",\n            "updated_at": "update date in ISO format",\n            "day_id": "associated day id"\n        }]\n\n        Make sure the plans are:\n        1. Specific and measurable\n        2. Realistic and achievable\n        3. Aligned with the main goal\n        4. Have appropriate frequency based on the timeline\n        5. Progressive (building towards the main goal)`;

            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Extract JSON from the response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error("Failed to parse AI response");
            }

            const plans: Plan[] = JSON.parse(jsonMatch[0]);
            allPlans.push(...plans);
        }
        console.log(allPlans);
        return allPlans;
    } catch (error) {
        console.error("Error generating plans:", error);
        throw error;
    }
}
