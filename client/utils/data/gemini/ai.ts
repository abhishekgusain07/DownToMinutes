"use server";

import { Entry, Goal } from "@/utils/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGoal } from "../goals/getGoal";
import { fetchAllActiveGoals } from "../goals/fetchAllActiveGoals";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Function to generate text using Gemini
export async function generateText(prompt: string): Promise<string> {
    try {
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating text with Gemini:', error);
        throw error;
    }
}

// Function to analyze text and provide insights
export async function analyzeText(text: string): Promise<string> {
    const prompt = `Analyze the following text and provide insights about the mood, key points, and any notable patterns:
    
    ${text}`;

    return generateText(prompt);
}

// Function to generate summary of the day
export async function generateDaySummary(entries: Entry[]): Promise<string> {
    const activeGoals:Goal[] | null = await fetchAllActiveGoals();

    const entriesText = entries.map(entry => 
        `- entry title: ${entry.title}, entry description: ${entry.description || 'No description'}, entry start time: ${entry.start_time}, entry end time: ${entry.end_time}, entry category: (${entry.category}), focus-levels: ${entry.focus_score}, energy-level: ${entry.energy_level}, interruptions: ${entry.interruptions}, location: ${entry.location}`
    ).join('\n');

    const goalsText = activeGoals?.map(goal => 
        `- goal title: ${goal.title}, goal description: ${goal.description || 'No description'} goal start date: ${goal.start_date} goal end date: ${goal.end_date}, priority: ${goal.priority}`
    ).join('\n');

    const prompt = `Based on the following activities of today and active goals of user, generate a concise summary of the day:
    
    ${entriesText}

    Goals:
    ${goalsText}

    Please include:
    1. Overall productivity assessment
    2. Main accomplishments
    3. Areas that might need attention
    4. Suggestions for improvement
    5. How well did you align with your goals today?`

    return generateText(prompt);
}

// Function to suggest mood based on entries
export async function suggestMood(entries: any[]): Promise<string> {
    const entriesText = entries.map(entry => 
        `- Activity: ${entry.title}
         - Description: ${entry.description || 'No description'}
         - Energy Level: ${entry.energy_level || 'Not specified'}
         - Focus Score: ${entry.focus_score || 'Not specified'}
         - Interruptions: ${entry.interruptions || 'Not specified'}`
    ).join('\n');

    const prompt = `Based on these activities and metrics from today, suggest an overall mood:
    
    ${entriesText}
    
    Please provide:
    1. A one-word mood description
    2. A brief explanation of why this mood was chosen
    3. Any patterns noticed in energy levels or focus scores`;

    return generateText(prompt);
}