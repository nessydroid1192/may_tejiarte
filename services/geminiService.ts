import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert File/Blob to Base64
export const fileToGenerativePart = async (file: File | Blob): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Technical Assistant: Analyzes weave photo for tension, density, and errors.
 */
export const analyzeWeaveTechnique = async (imageFile: File) => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          imagePart,
          {
            text: `Actúa como un maestro tejedor andino experto ("Mayor"). Analiza esta imagen de un tejido en proceso.
            Evalúa:
            1. Uniformidad y Tensión (¿Está muy suelto o apretado?).
            2. Densidad visual (¿Es apto para el frío?).
            3. Errores visibles en el patrón.
            
            Responde estrictamente en formato JSON con la siguiente estructura:
            {
              "tension": "Descripción breve del estado de la tensión",
              "density": "Evaluación de la densidad para retención térmica",
              "errors": ["Lista de posibles errores detectados"],
              "suggestions": ["Consejo práctico 1", "Consejo práctico 2"]
            }`
          }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error analyzing weave:", error);
    throw error;
  }
};

/**
 * Cultural Validation: Identifies symbols and validates against Andean iconography.
 */
export const validateSymbolism = async (imageFile: File) => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          imagePart,
          {
            text: `Eres un experto en iconografía andina de la región de Chaguaya. Analiza el símbolo en este tejido.
            Identifica el símbolo (ej. Illapa, Cóndor, Chakana, Ojos de Llama).
            Explica su significado cultural.
            Verifica la fidelidad geométrica (número de vueltas, proporciones).
            
            Responde estrictamente en formato JSON:
            {
              "symbolName": "Nombre del símbolo",
              "meaning": "Significado profundo y cultural",
              "accuracy": "Evaluación de la fidelidad del patrón",
              "question": "Una pregunta reflexiva para el tejedor sobre su intención con este símbolo"
            }`
          }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error validating symbol:", error);
    throw error;
  }
};

/**
 * Journal Reflexion: Analyzes audio or text reflection.
 */
export const analyzeJournalEntry = async (text: string, audioBlob?: Blob) => {
  try {
    const parts: any[] = [{ text: `Analiza esta reflexión de un tejedor. Identifica emociones y problemas técnicos. Genera una respuesta reflexiva de apoyo.
    Texto de entrada: "${text}"
    
    Responde en JSON:
    {
       "emotions": ["emoción 1", "emoción 2"],
       "tags": ["técnica", "material", "sentimiento"],
       "reflection": "Consejo sabio y empático en segunda persona"
    }` }];

    if (audioBlob) {
      const audioPart = await fileToGenerativePart(audioBlob);
      parts.unshift(audioPart);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");

  } catch (error) {
    console.error("Error analyzing journal:", error);
    throw error;
  }
};
