"use server";

import { Entry } from "@/utils/types";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    const entriesText = entries.map(entry => 
        `- ${entry.title}: ${entry.description || 'No description'} (${entry.category})`
    ).join('\n');

    const prompt = `Based on the following activities from today, generate a concise summary of the day:
    
    ${entriesText}
    
    Please include:
    1. Overall productivity assessment
    2. Main accomplishments
    3. Areas that might need attention
    4. Suggestions for improvement`;

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