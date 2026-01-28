import type { Prompt } from '../types';

const API_KEY_STORAGE_KEY = 'nanogen_api_key';
const PROMPTS_STORAGE_KEY = 'nanogen_prompts';

// API Key Management
export function getApiKey(): string | null {
    try {
        return localStorage.getItem(API_KEY_STORAGE_KEY);
    } catch {
        return null;
    }
}

export function setApiKey(key: string): void {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
}

export function removeApiKey(): void {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
}

// Prompt Management
export function getPrompts(): Prompt[] {
    try {
        const data = localStorage.getItem(PROMPTS_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function savePrompt(prompt: Prompt): void {
    const prompts = getPrompts();
    const existingIndex = prompts.findIndex(p => p.id === prompt.id);

    if (existingIndex >= 0) {
        prompts[existingIndex] = { ...prompt, updatedAt: new Date().toISOString() };
    } else {
        prompts.push({
            ...prompt,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    }

    localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(prompts));
}

export function deletePrompt(id: string): void {
    const prompts = getPrompts().filter(p => p.id !== id);
    localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(prompts));
}

export function getPromptById(id: string): Prompt | undefined {
    return getPrompts().find(p => p.id === id);
}

// Generate unique ID
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Export prompts to JSON file
export function exportPrompts(): void {
    const prompts = getPrompts();
    const dataStr = JSON.stringify(prompts, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `nanogen-prompts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Import prompts from JSON file
export function importPrompts(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const importedPrompts: Prompt[] = JSON.parse(content);

                if (!Array.isArray(importedPrompts)) {
                    throw new Error('Invalid format: expected an array of prompts');
                }

                const existingPrompts = getPrompts();
                const existingIds = new Set(existingPrompts.map(p => p.id));

                let importedCount = 0;
                for (const prompt of importedPrompts) {
                    if (prompt.id && prompt.title && prompt.content) {
                        if (existingIds.has(prompt.id)) {
                            // Generate new ID for duplicates
                            prompt.id = generateId();
                        }
                        existingPrompts.push({
                            ...prompt,
                            createdAt: prompt.createdAt || new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        });
                        importedCount++;
                    }
                }

                localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(existingPrompts));
                resolve(importedCount);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}
