import type { ModelConfig } from '../types';

// Model configurations based on official Gemini API documentation
// https://ai.google.dev/gemini-api/docs/image-generation
export const MODELS: ModelConfig[] = [
    {
        id: 'gemini-2.5-flash-image',
        name: 'Nano Banana',
        provider: 'google',
        supportsImageToImage: true,
        supportedSizes: ['1024x1024'],
        supportedStyles: ['natural', 'vivid'],
    },
    {
        id: 'gemini-3-pro-image-preview',
        name: 'Nano Banana Pro',
        provider: 'google',
        supportsImageToImage: true,
        supportedSizes: ['1024x1024', '2048x2048', '4096x4096'],
        supportedStyles: ['natural', 'vivid', 'cinematic', 'artistic'],
    },
];

export const DEFAULT_MODEL = MODELS[0];

export function getModelById(id: string): ModelConfig | undefined {
    return MODELS.find(model => model.id === id);
}
