"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Goal, SubgoalSuggestion } from "../types";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getGoal } from "../data/goals/getGoal";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);


export async function generateSubgoalSuggestions({
    goalId
}:{ goalId: string  }
): Promise<SubgoalSuggestion[]> {
    try{
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
        const goal: Goal | null = await getGoal(goalId);
        if (!goal) {
            throw new Error("Goal not found");
        }
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `As an AI assistant, analyze this goal and suggest realistic, actionable subgoals.
        Goal Title: ${goal.title}
        ${goal.description ? `Goal Description: ${goal.description}` : ''}
        Timeline: From ${goal.start_date} to ${goal.end_date}

        Please provide a list of 3-5 subgoals in the following JSON format:
        [{
            "title": "Subgoal title",
            "description": "Brief description of what needs to be done",
            "frequency": "WEEKLY/MONTHLY/QUARTERLY/YEARLY"
        }]

        Make sure the subgoals are:
        1. Specific and measurable
        2. Realistic and achievable
        3. Aligned with the main goal
        4. Have appropriate frequency based on the timeline
        5. Progressive (building towards the main goal)`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        // Extract JSON from the response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error("Failed to parse AI response");
        }
        
        const suggestions: SubgoalSuggestion[] = JSON.parse(jsonMatch[0]);
        return suggestions;
    } catch (error) {
        console.error("Error generating subgoals:", error);
        throw error;
    }
    }catch (error) {
        console.error("Error generating subgoals:", error);
        throw error;
    }
    
}
