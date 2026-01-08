import { GoogleGenAI, Modality, GenerateContentResponse } from '@google/genai';
import { EditResult } from '../types';
import { processImageForApi } from "../lib/imageUtils";

// The API key is sourced from environment variables, which is a requirement.
// The application must not ask the user for it.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.error("API_KEY is not set. Please configure it in your environment.");
    // In a real app, you might show a user-friendly error overlay.
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// A helper function to convert a File object to a base64 string without the data URL prefix.
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]); // Return only the base64 part
        };
        reader.onerror = err => reject(err);
    });
};

const base64ToDataUrl = (base64: string, mimeType: string): string => {
    return `data:${mimeType};base64,${base64}`;
}

export const editImage = async (imageFile: File, prompt: string, maskDataUrl?: string | null): Promise<EditResult> => {
    try {
        const processedFile = await processImageForApi(imageFile);
        const imageBase64 = await fileToBase64(processedFile);

        const imagePart = {
            inlineData: { data: imageBase64, mimeType: processedFile.type },
        };

        const textPart = { text: prompt };
        
        const parts: any[] = [imagePart, textPart];
        
        // Add the mask as an additional image part if it exists
        if (maskDataUrl) {
            const maskBase64 = maskDataUrl.split(',')[1];
            parts.push({
                inlineData: { data: maskBase64, mimeType: 'image/png' }
            });
        }
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const candidate = response.candidates?.[0];
        let resultImageUrl: string | null = null;
        
        if (candidate?.content?.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData) {
                    resultImageUrl = base64ToDataUrl(part.inlineData.data, part.inlineData.mimeType);
                    break; // Found the image part
                }
            }
        }

        // Use the convenient .text accessor for the text response
        let resultText: string | null = response.text;

        if (!resultImageUrl) {
            resultText = resultText || "The AI did not return an image. It may have refused the request due to safety policies.";
        }

        return { imageUrl: resultImageUrl, text: resultText };

    } catch (error) {
        console.error("Error editing image with AI:", error);
        throw new Error("Failed to edit image with AI. Please check the console for details.");
    }
};


export const mergeImages = async (imageFile1: File, imageFile2: File, prompt: string): Promise<EditResult> => {
    try {
        const [processedFile1, processedFile2] = await Promise.all([
            processImageForApi(imageFile1),
            processImageForApi(imageFile2),
        ]);
        const [imageBase64_1, imageBase64_2] = await Promise.all([
            fileToBase64(processedFile1),
            fileToBase64(processedFile2),
        ]);

        const imagePart1 = { inlineData: { data: imageBase64_1, mimeType: processedFile1.type } };
        const imagePart2 = { inlineData: { data: imageBase64_2, mimeType: processedFile2.type } };
        const textPart = { text: prompt };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart1, imagePart2, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        const candidate = response.candidates?.[0];
        let resultImageUrl: string | null = null;
        
        if (candidate?.content?.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData) {
                    resultImageUrl = base64ToDataUrl(part.inlineData.data, part.inlineData.mimeType);
                    break; // Found the image part
                }
            }
        }

        // Use the convenient .text accessor for the text response
        let resultText: string | null = response.text;
        
        if (!resultImageUrl) {
            resultText = resultText || "The AI did not return an image. It may have refused the request due to safety policies.";
        }

        return { imageUrl: resultImageUrl, text: resultText };

    } catch (error) {
        console.error("Error merging images with AI:", error);
        throw new Error("Failed to merge images with AI. Please check the console for details.");
    }
};

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string[]> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 2, // Generate 2 for variety
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        });

        const imageUrls = response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
        
        if (imageUrls.length === 0) {
            throw new Error("The AI did not return any images. It might have refused the request.");
        }

        return imageUrls;
    } catch (error) {
        console.error("Error generating image with AI:", error);
        throw new Error("Failed to generate image with AI. Please check the console for details.");
    }
};