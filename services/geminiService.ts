
import { GoogleGenAI, Type } from "@google/genai";
import { WorkoutRoutine } from "../types";

export const analyzeEquipment = async (
  base64Image: string, 
  preferredUnits: 'metric' | 'imperial' = 'metric',
  language: 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ru' | 'hi' | 'ar' = 'en'
): Promise<WorkoutRoutine> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-3-flash-preview';
  
  const unitInstructions = preferredUnits === 'imperial' 
    ? "Use Imperial units (lbs, miles)." 
    : "Use Metric units (kg, km).";

  const langMap: Record<string, string> = {
    'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
    'pt': 'Portuguese', 'ru': 'Russian', 'hi': 'Hindi', 'ar': 'Arabic'
  };
  const langName = langMap[language] || 'English';

  const prompt = `
    Identify gym equipment/training tools in this image and create a workout.
    OUTPUT LANGUAGE: ${langName}
    UNITS: ${unitInstructions}

    EXERCISE RULES:
    - CONCRETE weights (e.g. "10kg", "15lbs"). No "light/medium".
    - Use "Bodyweight" if no equipment load.
    - If a person/pet/child is shown, design "Interactive Play" or "Bodyweight Resistance".
    - MUST GENERATE BETWEEN 4 and 6 exercises. Never more than 6, never less than 4.
    - Format: Names/Instructions must be in ${langName}.

    SCHEMA REQUIREMENTS:
    - equipmentName: Common name of gear.
    - exercises: Array of 4-6 exercises using ONLY this gear.
    - safetyTips: 3-4 critical safety points.
    - estimatedDuration: Total time (e.g., "25 min").
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            equipmentName: { type: Type.STRING },
            equipmentDescription: { type: Type.STRING },
            targetMuscles: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedIntensity: { type: Type.STRING },
            exercises: {
              type: Type.ARRAY,
              minItems: 4,
              maxItems: 6,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sets: { type: Type.STRING },
                  reps: { type: Type.STRING },
                  rest: { type: Type.STRING },
                  weight: { type: Type.STRING },
                  instructions: { type: Type.STRING }
                },
                required: ["name", "sets", "reps", "instructions", "weight"]
              }
            },
            safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedDuration: { type: Type.STRING }
          },
          required: ["equipmentName", "exercises", "targetMuscles", "suggestedIntensity"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI.");
    
    const result = JSON.parse(text) as WorkoutRoutine;
    result.generatedLanguage = language;
    return result;
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    throw new Error("Analysis failed. Please try a clearer photo.");
  }
};
