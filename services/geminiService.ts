import { GoogleGenAI, Type } from "@google/genai";
import type { TreatmentPlan, SymptomAIAnalysis } from '../types';
import type { AIRecommendation } from '../types/prescription';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "placeholder_api_key" });

const treatmentPlanSchema = {
  type: Type.OBJECT,
  properties: {
    diagnosis_suggestion: {
      type: Type.STRING,
      description: "A brief, likely diagnosis based on the symptoms. Preface with 'Based on the symptoms, this could be...'. Keep it non-definitive."
    },
    tests: {
      type: Type.ARRAY,
      description: "List of recommended diagnostic tests.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of the test." },
          cost: { type: Type.NUMBER, description: "Estimated cost in INR." },
          lab: { type: Type.STRING, description: "Example of a common lab in India, e.g., 'Dr. Lal PathLabs'." },
          priority: { type: Type.STRING, description: "Priority of the test: 'high', 'medium', or 'low'." },
          why_needed: { type: Type.STRING, description: "Brief justification for the test." }
        },
        required: ["name", "cost", "lab", "priority", "why_needed"]
      }
    },
    medicines: {
      type: Type.ARRAY,
      description: "List of recommended medicines.",
      items: {
        type: Type.OBJECT,
        properties: {
          generic_name: { type: Type.STRING, description: "Generic name of the medicine." },
          brand_options: {
            type: Type.ARRAY,
            description: "A few brand name options with prices.",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Brand name or 'Generic'." },
                price: { type: Type.NUMBER, description: "Estimated price for the full course in INR." }
              },
              required: ["name", "price"]
            }
          },
          dosage: { type: Type.STRING, description: "e.g., '500mg'" },
          frequency: { type: Type.STRING, description: "e.g., 'Twice a day after meals'" },
          duration: { type: Type.STRING, description: "e.g., '5 days'" }
        },
        required: ["generic_name", "brand_options", "dosage", "frequency", "duration"]
      }
    },
    consultation: {
        type: Type.OBJECT,
        properties: {
            type: { type: Type.STRING, description: "e.g., 'General Physician', 'Specialist', 'Teleconsultation'" },
            cost: { type: Type.NUMBER, description: "Estimated cost in INR." }
        },
        required: ["type", "cost"]
    },
    total_cost: {
      type: Type.NUMBER,
      description: "The calculated total cost of all recommended items."
    },
    remaining_budget: {
      type: Type.NUMBER,
      description: "The user's budget minus the total cost."
    },
    follow_up_recommendation: {
      type: Type.STRING,
      description: "A crucial follow-up warning. e.g., 'If symptoms do not improve in 3 days, or worsen, you must see a doctor immediately. You may need further tests like an Endoscopy which costs around ₹3000.'"
    }
  },
  required: ["diagnosis_suggestion", "tests", "medicines", "consultation", "total_cost", "remaining_budget", "follow_up_recommendation"]
};

export const generateTreatmentPlan = async (symptoms: string, budget: number): Promise<TreatmentPlan | null> => {
  if (!API_KEY) {
    console.error("Gemini API key is not configured.");
    // Return mock data if API key is not available
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    return {
        diagnosis_suggestion: "Based on the symptoms, this could be Gastritis or Acid Reflux. This is a mock response as the API key is missing.",
        tests: [{ name: "Complete Blood Count (CBC)", cost: 350, lab: "Thyrocare", priority: "medium", why_needed: "To check for signs of infection or anemia." }],
        medicines: [{ generic_name: "Pantoprazole", brand_options: [{ name: "Pantocid", price: 150 }, { name: "Generic", price: 80 }], dosage: "40mg", frequency: "Once a day before breakfast", duration: "7 days" }],
        consultation: { type: "Teleconsultation", cost: 400 },
        total_cost: 900,
        remaining_budget: budget - 900,
        follow_up_recommendation: "If symptoms persist for more than 3 days, a physical consultation is necessary."
    };
  }

  const prompt = `
    You are an expert medical AI assistant for India called Medify.
    Your primary goal is to create a budget-conscious, preliminary treatment plan.
    THIS IS NOT A MEDICAL DIAGNOSIS. You must act as a helpful guide for what a user might expect.
    
    User's situation:
    - Symptoms: "${symptoms}"
    - Budget: ₹${budget} (Indian Rupees)

    Your task is to generate a JSON object based on the provided schema. Follow these rules strictly:
    1.  Analyze the symptoms and suggest a *possible* diagnosis. Use cautious language.
    2.  Prioritize essential tests and medicines that fit within the budget.
    3.  If the budget is very low, suggest only the most critical actions (e.g., consultation and basic medicine).
    4.  Always include at least one generic medicine option to show cost savings.
    5.  Estimate costs realistically for the Indian market.
    6.  Calculate the total cost and the remaining budget.
    7.  Provide a clear and strong follow-up recommendation, mentioning what to do if symptoms don't improve and the potential cost of the next steps.
    8.  The final JSON must be clean and parseable. Do not include any text or markdown formatting before or after the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: treatmentPlanSchema,
        },
    });
    
    const jsonString = response.text.trim();
    const plan: TreatmentPlan = JSON.parse(jsonString);
    return plan;
  } catch (error) {
    console.error("Error generating treatment plan:", error);
    return null;
  }
};

const symptomAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        notes: {
            type: Type.STRING,
            description: "Detailed observations from the image. Describe color, texture, shape, and signs of inflammation or healing. Be objective. e.g., 'The image shows a circular red rash with slightly raised edges.'",
        },
        infection_risk: {
            type: Type.STRING,
            description: "An estimated risk of infection. Must be one of: 'low', 'medium', or 'high'."
        },
        advice: {
            type: Type.ARRAY,
            description: "A list of 2-3 general, non-prescriptive care suggestions. e.g., 'Keep the area clean and dry.', 'Avoid scratching the affected area.'",
            items: {
                type: Type.STRING
            }
        }
    },
    required: ["notes", "infection_risk", "advice"]
};

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export const analyzeSymptomImage = async (imageFile: File, userNotes: string): Promise<SymptomAIAnalysis | null> => {
    if (!API_KEY) {
        console.error("Gemini API key is not configured.");
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            notes: "This is a mock analysis as the API key is missing. The image shows some redness and inflammation.",
            infection_risk: 'medium',
            advice: ["Keep the area clean and dry.", "Consult a doctor for a proper diagnosis."]
        };
    }

    const imagePart = await fileToGenerativePart(imageFile);

    const prompt = `
        You are an expert medical AI assistant for India called Medify.
        Your task is to analyze an image of a skin condition or wound and provide a preliminary visual analysis.
        THIS IS NOT A MEDICAL DIAGNOSIS. Your analysis must be purely observational and provide general advice only.
        
        User's notes: "${userNotes}"
        
        Your task is to generate a JSON object based on the provided schema. Follow these rules strictly:
        1.  Analyze the image visually. Describe what you see objectively. Do not diagnose.
        2.  Assess the visual signs for a potential infection risk (low, medium, high).
        3.  Provide simple, safe, non-medical advice.
        4.  The app's UI will handle the disclaimer. Do NOT include a disclaimer in the JSON output.
        5.  The final JSON must be clean and parseable. Do not include any text or markdown formatting before or after the JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            // FIX: Use a model that supports vision, like gemini-2.5-flash, and format contents correctly for multimodal input.
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: symptomAnalysisSchema,
            },
        });

        const jsonString = response.text.trim();
        const analysis: SymptomAIAnalysis = JSON.parse(jsonString);
        return analysis;
    } catch (error) {
        console.error("Error analyzing symptom image:", error);
        return null;
    }
};

const prescriptionSchema = {
    type: Type.OBJECT,
    properties: {
        diagnosis: { type: Type.STRING, description: "A likely diagnosis based on the symptoms." },
        items: {
            type: Type.ARRAY,
            description: "List of recommended medications.",
            items: {
                type: Type.OBJECT,
                properties: {
                    medicine: { type: Type.STRING, description: "Generic name of the medicine." },
                    dosage: {
                        type: Type.OBJECT,
                        properties: {
                            strength: { type: Type.STRING, description: "e.g., '500 mg'" },
                            route: { type: Type.STRING, description: "e.g., 'oral', 'topical'" },
                            frequency: { type: Type.STRING, description: "e.g., 'Once daily', 'TID'" },
                            durationDays: { type: Type.NUMBER, description: "Duration in days." },
                            instructions: { type: Type.STRING, description: "e.g., 'after food'" },
                        },
                        required: ["strength", "route", "frequency", "durationDays"]
                    },
                    reason: { type: Type.STRING, description: "Brief justification for this medicine." },
                },
                required: ["medicine", "dosage", "reason"]
            }
        },
        warnings: {
            type: Type.ARRAY,
            description: "List of critical warnings or red flags for the doctor's attention.",
            items: { type: Type.STRING }
        }
    },
    required: ["diagnosis", "items", "warnings"]
};

export const generatePrescriptionSuggestion = async (symptoms: string): Promise<AIRecommendation | null> => {
    if (!API_KEY) {
        console.error("Gemini API key is not configured.");
        return null;
    }

    const prompt = `
        You are a clinical decision support AI for a doctor in India.
        Analyze the following patient symptoms and vitals to generate a prescription suggestion in JSON format.
        Your output must adhere to the provided schema.
        Prioritize common, first-line treatments. Be concise.
        Identify any potential red flags or critical warnings.

        Patient notes: "${symptoms}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: prescriptionSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const suggestion: AIRecommendation = JSON.parse(jsonString);
        return suggestion;
    } catch (error) {
        console.error("Error generating prescription suggestion:", error);
        return null;
    }
};


export const findHospitals = async (latitude: number, longitude: number) => {
    if (!API_KEY) {
        console.error("Gemini API key is not configured.");
        return null;
    }
    const prompt = "Find hospitals near me and provide their names. Also, provide an illustrative, realistic-looking count of available ICU, general, and ventilator beds for each. State clearly that the bed count is illustrative for a demo.";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{googleMaps: {}}],
                toolConfig: {
                    retrievalConfig: {
                        latLng: { latitude, longitude }
                    }
                }
            },
        });
        return response;
    } catch(e) {
        console.error("Error finding hospitals:", e);
        return null;
    }
}