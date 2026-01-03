
import { GoogleGenAI } from "@google/genai";

export const analyzeFilenameWithAI = async (filename: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this BIM filename according to ISO 19650 standards: "${filename}".
    Standard segments: Project-Originator-Volume-Level-Type-Role-Number.
    Provide your analysis in Arabic. 
    1. Confirm if the segments look like standard BIM codes (e.g., is "AR" likely Architecture?).
    2. Identify any logical errors beyond just character length.
    3. Suggest corrections if the file seems related to Revit or Navisworks.
    Keep the tone professional and helpful for a BIM Manager.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "لم يتمكن الذكاء الاصطناعي من تحليل الملف.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي لتحليل الملف.";
  }
};
