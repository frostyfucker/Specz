import { GoogleGenAI } from "@google/genai";
import { Persona, MediaInput } from '../types';
import { PERSONAS } from '../constants';

// Ensure the API key is available, but do not handle its input.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateSpecification(description: string, persona: Persona, mediaInput: MediaInput | null): Promise<string> {
  const personaDetails = PERSONAS[persona];

  if (!personaDetails) {
    throw new Error('Invalid persona selected.');
  }

  const parts = [];

  if (mediaInput) {
      parts.push({
          inlineData: {
              data: mediaInput.data,
              mimeType: mediaInput.mimeType,
          },
      });
  }

  let userPrompt = "Please generate a detailed specification for my idea.";
  if (description && mediaInput) {
      userPrompt = `Based on the attached media and the following text, generate a detailed specification:\n\n${description}`;
  } else if (description) {
      userPrompt = `Generate a detailed specification for the following concept:\n\n${description}`;
  } else if (mediaInput) {
      userPrompt = `Based on the attached media, generate a detailed specification.`;
  }

  parts.push({ text: userPrompt });


  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config: {
            systemInstruction: personaDetails.systemInstruction,
            temperature: 0.5,
            topP: 0.95,
        }
    });
    
    return response.text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("The AI model failed to generate a response. Please try again.");
  }
}
