import { createPartFromUri, GoogleGenAI } from "@google/genai";
import { IMessage } from "react-native-gifted-chat";
import { UploadedFileMeta } from "./types";
import { generateSystemPromptWithUserContext, getUserContext } from "./userContext";

const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY });

function safeExtractTextFromModelsResponse(response: any): string {
  try {
    if (!response) return "No response from Gemini.";

    return (
      extractFromCandidate(response) ||
      extractFromOutput(response) ||
      extractFromTextProperty(response) ||
      stringifyResponse(response)
    );
  } catch (err) {
    return `Failed to parse response: ${(err as Error).message}`;
  }
}

function extractFromCandidate(response: any): string | null {
  const cand = response?.candidates?.[0];
  if (!cand) return null;

  const content = cand.content;
  
  if (Array.isArray(content) && content.length > 0) {
    return extractTextFromContentArray(content);
  }
  
  if (typeof content === "string") {
    return content;
  }
  
  return null;
}

function extractTextFromContentArray(content: any[]): string {
  for (const part of content) {
    if (part?.text) return part.text;
  }
  return JSON.stringify(content).slice(0, 4000);
}

function extractFromOutput(response: any): string | null {
  return response?.output?.[0]?.content?.[0]?.text || null;
}

function extractFromTextProperty(response: any): string | null {
  if (typeof response.text === "function") return response.text();
  if (typeof response.text === "string") return response.text;
  return null;
}

function stringifyResponse(response: any): string {
  return JSON.stringify(response).slice(0, 4000);
}


/**
 * Upload a local file URI (Expo document picker uri) to Gemini file storage.
 */
// src/services/geminiPdfService.ts (Corrected)

/**
 * Upload a local file URI (Expo document picker uri) to Gemini file storage.
 * fileName (if provided) is used for a human-readable display name.
 */
export async function uploadPdfToGemini(fileUri: string, fileName?: string): Promise<UploadedFileMeta> {
  try {
    const res = await fetch(fileUri);
    if (!res.ok) throw new Error(`Failed to read file at ${fileUri} (status ${res.status})`);
    const blob = await res.blob();

    const uploadedFile = await ai.files.upload({
      file: blob,
      config: { 
        mimeType: "application/pdf", 
        displayName: fileName
      },
    });

    if (!uploadedFile?.name) throw new Error("Unexpected upload response: " + JSON.stringify(uploadedFile));
    return {
      name: uploadedFile.name,
      mimeType: uploadedFile.mimeType,
      sizeBytes: (uploadedFile as any).sizeBytes,
    };
  } catch (err: any) {
    console.error("uploadPdfToGemini error:", err);
    throw err;
  }
}

export async function askGeminiWithFile(
  uploadedFileName: string,
  question: string,
  options?: { model?: string }
): Promise<string> {
  if (!uploadedFileName) throw new Error("uploadedFileName required");
  const model = options?.model || "gemini-2.5-flash";

  try {
    // Get user context
    const userContext = await getUserContext();
    const systemPrompt = userContext 
      ? generateSystemPromptWithUserContext(userContext)
      : "You are BizAssist, a helpful business assistant AI.";

    // Retrieve the file resource
    const file = await ai.files.get({ name: uploadedFileName });

    if (file.state !== "ACTIVE") {
      throw new Error(`File ${uploadedFileName} is not ACTIVE (state: ${file.state}).`);
    }

    // Create file part
    let filePart: any;
    if (file.uri && file.mimeType) {
      filePart = createPartFromUri(file.uri, file.mimeType);
    } else {
      filePart = {
        fileData: {
          mimeType: file.mimeType || "application/pdf",
          name: uploadedFileName,
        },
      };
    }

    // Send request with system context
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            filePart,
            { text: `\n\nUser question: ${question}` },
          ],
        },
      ],
    });

    return safeExtractTextFromModelsResponse(response);
  } catch (err: any) {
    console.error("askGeminiWithFile error:", err);
    const message = err?.message || JSON.stringify(err);
    throw new Error(message);
  }
}

/**
 * Generate plain text from Gemini (no file). chatHistory is optional (IMessage[]).
 */
export async function generateText(
  question: string,
  chatHistory?: IMessage[],
  options?: { model?: string }
): Promise<string> {
  const model = options?.model || "gemini-2.5-flash";
  
  // Get user context
  const userContext = await getUserContext();
  const systemPrompt = userContext 
    ? generateSystemPromptWithUserContext(userContext)
    : "You are BizAssist, a helpful business assistant AI.";

  // Build chat context from history
  const chatContext = (chatHistory || [])
    .slice(-10) // Keep last 10 messages for context
    .map((m) => {
      const role = m.user?._id === 1 ? "User" : "Assistant";
      return `${role}: ${m.text}`;
    })
    .join("\n");

  const prompt = `${systemPrompt}

${chatContext ? "Previous conversation:\n" + chatContext + "\n\n" : ""}Current question: ${question}

Please respond naturally and helpfully.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    return safeExtractTextFromModelsResponse(response);
  } catch (err: any) {
    console.error("generateText error:", err);
    const message = err?.message || JSON.stringify(err);
    throw new Error(message);
  }
}


/**
 * Delete an uploaded file from Gemini storage (optional cleanup).
 */
export async function deleteUploadedFile(uploadedFileName: string): Promise<boolean> {
  if (!uploadedFileName) return false;
  try {
    await ai.files.delete({ name: uploadedFileName });
    return true;
  } catch (err: any) {
    console.error("deleteUploadedFile error:", err);
    return false;
  }
}

export async function waitForFileActive(uploadedFileName: string, maxAttempts: number = 30): Promise<void> {
  const delayMs = 2000;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const file = await ai.files.get({ name: uploadedFileName });

      if (file.state === 'ACTIVE') {
        console.log(`File ${uploadedFileName} is now ACTIVE.`);
        return;
      }
      
      if (file.state === 'FAILED') {
        throw new Error(`File processing failed for ${uploadedFileName}.`);
      }

      console.log(`File ${uploadedFileName} state: ${file.state}. Waiting...`);
    } catch (err) {
      if (i === maxAttempts - 1) throw err; 
      console.warn(`Error checking file status: ${(err as Error).message}. Retrying...`);
    }

    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  throw new Error(`File ${uploadedFileName} did not become ACTIVE within the maximum time.`);
}
