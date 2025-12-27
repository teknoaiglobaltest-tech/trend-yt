import { GoogleGenAI, Type } from "@google/genai";
import type { VideoAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "Ringkasan video yang detail dalam Bahasa Indonesia, menjelaskan konsep dan detail semua isi dalam video tersebut dari awal hingga akhir."
    },
    seoKeywords: {
      type: Type.ARRAY,
      description: "Daftar 5-10 kata kunci SEO dalam bahasa asli konten video. Jangan diterjemahkan.",
      items: { type: Type.STRING }
    },
    hashtags: {
      type: Type.ARRAY,
      description: "Daftar 3-5 tagar yang relevan dalam bahasa asli konten video. Jangan diterjemahkan.",
      items: { type: Type.STRING }
    }
  },
  required: ["summary", "seoKeywords", "hashtags"]
};

export const analyzeVideoContent = async (title: string, description: string): Promise<VideoAnalysis> => {
  const prompt = `
    Sebagai seorang ahli SEO dan strategi konten YouTube kelas dunia, analisislah konten video berikut berdasarkan judul dan deskripsinya.
    Sajikan analisis terstruktur dan terperinci dalam format JSON.

    Video Title: "${title}"
    Video Description: "${description}"

    Analisis Anda harus mencakup:
    1. summary (dalam Bahasa Indonesia): Ringkasan naratif yang komprehensif tentang isi video, jelaskan konsep dan detail semua isi dalam video tersebut dari awal hingga akhir.
    2. seoKeywords (dalam bahasa asli konten): Daftar 5-10 kata kunci SEO spesifik yang efektif untuk visibilitas video ini. JANGAN TERJEMAHKAN kata kunci ini jika konten aslinya berbahasa asing (misalnya, Inggris).
    3. hashtags (dalam bahasa asli konten): Daftar 3-5 tagar yang relevan untuk promosi di YouTube dan platform lain. JANGAN TERJEMAHKAN tagar ini jika bahasa aslinya bukan Bahasa Indonesia.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);

    // Validasi dasar
    if (!parsedJson.summary || !Array.isArray(parsedJson.seoKeywords) || !Array.isArray(parsedJson.hashtags)) {
        throw new Error("AI response is missing required fields.");
    }

    return parsedJson as VideoAnalysis;
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
        throw new Error(`AI analysis failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during AI analysis.");
  }
};