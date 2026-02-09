import { GoogleGenAI } from "@google/genai";
import { Publication } from "./types";

export const getGeminiResponse = async (prompt: string, customSystemInstruction?: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: customSystemInstruction || `You are the IUB Virtual Assistant (Islamia University Bahawalpur). 
        You provide information about admissions, departments, campus life, and academic rules.
        Be professional, helpful, and polite. If you don't know a specific recent detail, 
        advise the user to check the official website iub.edu.pk. Keep answers concise.`,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error?.message?.includes('429')) {
      return "The campus assistant is currently busy with many requests. Please try again in a few moments.";
    }
    return "I'm having trouble connecting to the campus server. Please try again later.";
  }
};

export const generateDepartmentImage = async (departmentName: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `A professional, high-quality, wide-angle architectural photograph of the ${departmentName} building at a modern Islamic university campus. The style should be clean, academic, and majestic, with clear blue sky and landscaped surroundings. Realistic photography style.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error: any) {
    if (error?.message?.includes('429')) {
      console.warn("Image Generation Quota Exhausted (429). Please wait before requesting more images.");
    } else {
      console.error("Image Generation Error:", error);
    }
    return null;
  }
};

export const generateFacultyBio = async (name: string, designation: string, qualification: string, interests: string[], publications: (string | Publication)[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const publicationsText = publications.map(p => 
      typeof p === 'string' ? p : `${p.title}${p.journal ? ` in ${p.journal}` : ''}${p.year ? ` (${p.year})` : ''}`
    ).join(", ");

    const prompt = `Write a prestigious, engaging, and informative academic biography (max 4 sentences) for ${name}, who serves as ${designation} at The Islamia University of Bahawalpur.
    Academic Profile:
    - Qualifications: ${qualification}
    - Specialized Research Areas: ${interests.join(", ")}
    - Notable Scholarly Contributions: ${publicationsText}
    
    The biography should synthesize these elements to highlight their unique expertise and the broader impact of their research within the global academic community. Maintain a tone of institutional excellence. Do not include introductory phrases like "Here is the biography."`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });
    return response.text;
  } catch (error: any) {
    console.error("Bio Generation Error:", error);
    return null;
  }
};