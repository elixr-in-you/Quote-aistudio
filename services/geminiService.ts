import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-3-flash-preview';

export const enhanceDescription = async (text: string): Promise<string> => {
  if (!text) return '';
  
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Rewrite the following line item description for a business quotation to make it sound professional, clear, and value-oriented. Keep it concise (under 20 words). Input: "${text}"`,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini enhance error:", error);
    return text;
  }
};

export const generateTerms = async (businessType: string): Promise<string> => {
  if (!businessType) return '';

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate a concise set of standard terms and conditions (max 3 bullet points) for a quotation for a "${businessType}" business. Include payment terms and validity. Format as plain text.`,
    });
    return response.text?.trim() || '';
  } catch (error) {
    console.error("Gemini terms error:", error);
    return "Error generating terms. Please try again.";
  }
};

export const generateEmailDraft = async (clientName: string, totalAmount: string, businessName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Write a short, polite, professional email draft to send a quotation to a client. 
      Client Name: ${clientName || 'Valued Client'}
      Total Amount: ${totalAmount}
      My Business: ${businessName}
      
      Keep it friendly and ask for approval to proceed.`,
    });
    return response.text?.trim() || '';
  } catch (error) {
    console.error("Gemini email error:", error);
    return "Error generating email.";
  }
};
