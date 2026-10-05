import { GoogleGenAI, Type, Schema } from '@google/genai';
import {WorkoutPlan} from '../types/workout';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function analyzeFoodImage(imageBase64: string, mimeType: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: 'Analyze this food image and estimate its nutritional content. Provide a realistic estimate for a typical portion size shown.' },
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType,
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Name of the food or meal' },
            calories: { type: Type.INTEGER, description: 'Estimated total calories' },
            protein: { type: Type.INTEGER, description: 'Estimated protein in grams' },
            carbs: { type: Type.INTEGER, description: 'Estimated carbohydrates in grams' },
            fats: { type: Type.INTEGER, description: 'Estimated fats in grams' },
          },
          required: ['name', 'calories', 'protein', 'carbs', 'fats'],
        } as Schema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error('No response from AI');
  } catch (error) {
    console.error('Error analyzing food:', error);
    throw error;
  }
}

export async function searchFoodDatabase(query: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Search for the food "${query}". Return a list of 8 realistic, varied matching food items (include raw ingredients, common prepared meals, and branded items if applicable). Use standard, realistic serving sizes (not strictly 100g) and provide accurate nutritional information per serving.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              product_name: { type: Type.STRING, description: 'Name of the food with the serving size included (e.g., "Apple, Medium (182g)" or "Chicken Breast, Cooked (4oz)")' },
              nutriments: {
                type: Type.OBJECT,
                properties: {
                  'energy-kcal_100g': { type: Type.INTEGER, description: 'Calories per serving' },
                  'proteins_100g': { type: Type.INTEGER, description: 'Protein per serving (g)' },
                  'carbohydrates_100g': { type: Type.INTEGER, description: 'Carbs per serving (g)' },
                  'fat_100g': { type: Type.INTEGER, description: 'Fats per serving (g)' },
                },
                required: ['energy-kcal_100g', 'proteins_100g', 'carbohydrates_100g', 'fat_100g']
              }
            },
            required: ['product_name', 'nutriments']
          }
        } as Schema
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error('No response from AI');
  } catch (error) {
    console.error('Error searching food database:', error);
    throw error;
  }
}

export async function chatWithGymBro(
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  message: string,
  userContext?: string
) {
  try {
    const systemInstruction = `You are a supportive, knowledgeable "Gym Bro" fitness coach. 
You talk like a friendly gym bro (use words like "bro", "man", "brah", "dude", "sick", "gains", etc., but keep it natural, not overly obnoxious).
You give actually great, science-based fitness and nutrition advice, broken down simply. 
Be supportive, encouraging, and human-like. Keep your responses concise as this is a mobile text chat.

Here is the live data about your bro (the user) right now. Use this to personalize your advice if relevant:
<user_context>
${userContext || 'No context available'}
</user_context>`;

    // Build the contents array preserving turns
    const contents: any[] = [
      ...history.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: msg.parts
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
      }
    });

    return response.text;
  } catch (error) {
    console.error('Error chatting with Gym Bro:', error);
    throw error;
  }
}

export async function generateWorkoutPlan(details: {
  age: string;
  weight: string;
  goal: string;
  daysPerWeek: string;
  experienceLevel: string;
  preferredSplit: string;
}): Promise<WorkoutPlan> {
  try {
    const prompt = `Create a detailed weekly workout plan for a user with the following profile:
    Age: ${details.age}
    Weight: ${details.weight}
    Goal: ${details.goal}
    Days per week: ${details.daysPerWeek}
    Experience Level (Training Age): ${details.experienceLevel}
    Preferred Split: ${details.preferredSplit}

    Return a JSON object where keys are days of the week ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun').
    Each day must have:
    - id: string (e.g., 'mon')
    - dayLabel: string (e.g., 'Monday')
    - title: string (e.g., 'Push - Strength' or 'Rest')
    - focus: string (description of the day's focus)
    - type: 'push' | 'pull' | 'legs' | 'rest'
    - sections: Array of sections (e.g., 'Chest', 'Back'). Each section has:
      - id: string
      - label: string
      - exercises: Array of exercises. Each exercise has:
        - id: string
        - name: string
        - note: string (tips for form)
        - sets: string (e.g., '3 x 8-12' or 'required' for rest days)
        - rpe: string (e.g., 'RPE 8' or empty string)
        - pills: Array of objects { text: string, type: 'rest' | 'rpe' | 'failure' | 'dropset' | 'tip' }
    - tips: Array of strings (daily tips)
    
    Ensure rest days are included to make up a full 7-day week.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as WorkoutPlan;
    }
    throw new Error('No response from AI');
  } catch (error) {
    console.error('Error generating workout plan:', error);
    throw error;
  }
}

export async function importWorkoutPlan(text?: string, imageBase64?: string, mimeType?: string): Promise<WorkoutPlan> {
  try {
    const prompt = `You are an expert fitness AI. The user is providing an existing workout plan either via text or an image.
    Parse this plan and convert it into a structured JSON format.
    
    Return a JSON object where keys are days of the week ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun').
    If the user's plan doesn't specify all 7 days, fill the remaining days with 'rest' type days.
    
    Each day must have:
    - id: string (e.g., 'mon')
    - dayLabel: string (e.g., 'Monday')
    - title: string (e.g., 'Push Day' or 'Rest')
    - focus: string (description of the day's focus)
    - type: 'push' | 'pull' | 'legs' | 'rest'
    - sections: Array of sections (e.g., 'Main Lifts', 'Accessories'). Each section has:
      - id: string
      - label: string
      - exercises: Array of exercises. Each exercise has:
        - id: string
        - name: string
        - note: string (tips for form)
        - sets: string (e.g., '3 x 8-12' or 'required' for rest days)
        - rpe: string (e.g., 'RPE 8' or empty string)
        - pills: Array of objects { text: string, type: 'rest' | 'rpe' | 'failure' | 'dropset' | 'tip' }
    - tips: Array of strings (daily tips)
    
    Ensure rest days are included to make up a full 7-day week.`;

    const parts: any[] = [{ text: prompt }];
    if (text) {
      parts.push({ text: `User's plan text:\n${text}` });
    }
    if (imageBase64 && mimeType) {
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: parts
        }
      ],
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as WorkoutPlan;
    }
    throw new Error('No response from AI');
  } catch (error) {
    console.error('Error importing workout plan:', error);
    throw error;
  }
}
