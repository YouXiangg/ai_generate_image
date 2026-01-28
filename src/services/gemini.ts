import type { GenerationParams } from '../types';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

interface GeminiResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text?: string;
                inlineData?: {
                    mimeType: string;
                    data: string;
                };
            }>;
        };
    }>;
    error?: {
        message: string;
        code: number;
    };
}

export async function generateImage(
    apiKey: string,
    prompt: string,
    referenceImage?: string | null,
    params?: GenerationParams
): Promise<string> {
    // Use selected model or default to Nano Banana (gemini-2.5-flash-image)
    const model = params?.modelId || 'gemini-2.5-flash-image';
    const url = `${GEMINI_API_BASE}/models/${model}:generateContent`;

    // Build the request parts
    const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

    // Add reference image if provided
    if (referenceImage) {
        // Extract base64 data from data URL
        const base64Match = referenceImage.match(/^data:([^;]+);base64,(.+)$/);
        if (base64Match) {
            parts.push({
                inlineData: {
                    mimeType: base64Match[1],
                    data: base64Match[2],
                },
            });
        }
    }

    // Add prompt
    parts.push({ text: prompt });

    const requestBody = {
        contents: [
            {
                parts,
            },
        ],
        generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
            ...(params?.seed && { seed: params.seed }),
        },
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(requestBody),
    });

    const data: GeminiResponse = await response.json();

    if (data.error) {
        throw new Error(data.error.message || 'Failed to generate image');
    }

    // Extract the generated image from response
    const candidate = data.candidates?.[0];
    const imagePart = candidate?.content?.parts?.find(part => part.inlineData);

    if (!imagePart?.inlineData) {
        throw new Error('No image was generated. The model may have returned text only.');
    }

    // Return as data URL
    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
    try {
        // Simple validation by listing models
        const url = `${GEMINI_API_BASE}/models`;
        const response = await fetch(url, {
            headers: {
                'x-goog-api-key': apiKey,
            },
        });
        return response.ok;
    } catch {
        return false;
    }
}
