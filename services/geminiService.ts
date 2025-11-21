import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      // remove the "data:*/*;base64," part
      resolve(base64data.split(',')[1]);
    };
    reader.onerror = (error) => reject(new Error(`FileReader error: ${error}`));
    reader.readAsDataURL(blob);
  });
};

export const transcribeAudio = async (audioData: File | Blob): Promise<string> => {
  try {
    const base64Audio = await blobToBase64(audioData);
    
    const audioPart = {
      inlineData: {
        mimeType: audioData.type,
        data: base64Audio,
      },
    };

    const textPart = {
      text: "Transcribe the following audio. Provide only the transcribed text.",
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [audioPart, textPart] },
    });

    const transcription = response.text;
    if (transcription) {
      return transcription.trim();
    } else {
      throw new Error("The API returned an empty transcription. The audio might be silent or unclear.");
    }
  } catch (error) {
    console.error("Error in Gemini API call:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to transcribe audio: ${error.message}`);
    }
    throw new Error("An unexpected error occurred during transcription.");
  }
};