
import { GoogleGenAI, Type } from "@google/genai";
import { WorkoutRoutine } from "../types";

export const analyzeEquipment = async (
  base64Image: string,
  preferredUnits: 'metric' | 'imperial' = 'metric',
  language: 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ru' | 'hi' | 'ar' = 'en'
): Promise<WorkoutRoutine> => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key configuration missing. Check your environment variables.");

  const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });
  const modelName = 'gemini-2.5-flash';

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

    CRITICAL: Look VERY carefully at the image. Even if the photo is blurry or unclear:
    - Try to identify ANY visible equipment, objects, or tools that could be used for exercise
    - If you see dumbbells, barbells, kettlebells, machines, bands, or ANY fitness equipment, you MUST use them
    - Make educated guesses about equipment type and weights based on visual cues
    - Default to "Bodyweight" ONLY as an absolute last resort when NO equipment is visible at all

    EXERCISE RULES:
    - CONCRETE weights (e.g. "10kg", "15lbs"). No "light/medium".
    - ONLY use "Bodyweight" if the image shows ZERO equipment - just a person, empty space, or non-fitness objects.
    - If ANY equipment is visible (dumbbells, barbells, kettlebells, machines, resistance bands, benches, etc.), you MUST specify concrete weight values.
    - For adjustable equipment (dumbbells, barbells), suggest appropriate starting weights based on the equipment type and typical usage.
    - If unclear what equipment it is, make your best guess based on shape, size, and context.
    - If a person/pet/child is shown WITHOUT any fitness equipment, design "Interactive Play" or "Bodyweight Resistance".
    - MUST GENERATE BETWEEN 4 and 6 exercises. Never more than 6, never less than 4.
    - Format: Names/Instructions must be in ${langName}.

    SCHEMA REQUIREMENTS:
    - equipmentName: Common name of gear (be specific - "20kg Dumbbells" not just "Dumbbells").
    - exercises: Array of 4-6 exercises using ONLY this gear.
    - safetyTips: 3-4 critical safety points.
    - estimatedDuration: Total time (e.g., "25 min").
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: prompt }
        ]
      }],
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
          required: ["equipmentName", "exercises", "targetMuscles", "suggestedIntensity", "safetyTips", "estimatedDuration"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      console.error("AI Response Missing Text. Full Response:", JSON.stringify(response));
      throw new Error("AI returned an empty response. Please try a different photo.");
    }

    const result = JSON.parse(text) as WorkoutRoutine;
    result.generatedLanguage = language;
    result.debugRawResponse = text; // Store raw response for debug menu
    return result;
  } catch (error: any) {
    console.error("AI Analysis Detailed Error:", error);
    // Log the actual error message to console to help debugging
    if (error.message) console.error("Error Message:", error.message);
    if (error.stack) console.error("Error Stack:", error.stack);

    throw new Error(`Analysis failed: ${error.message || "Please try a clearer photo."}`);
  }
};
