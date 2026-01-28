// Prompt interface for saved prompts
interface Prompt {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Generation parameters for image generation
interface GenerationParams {
  modelId?: string;
  imageSize: string;
  aspectRatio?: string;
  seed?: number;
  style?: string;
}

// Model configuration
interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  supportsImageToImage: boolean;
  supportedSizes: string[];
  supportedStyles?: string[];
}

// API configuration state
interface ApiConfig {
  apiKey: string | null;
  isConnected: boolean;
}

// Generation result
interface GenerationResult {
  imageUrl: string;
  prompt: string;
  params: GenerationParams;
  timestamp: string;
}

// Tab types
type TabType = 'generate' | 'prompts';

// Export all types
export type {
  Prompt,
  GenerationParams,
  ModelConfig,
  ApiConfig,
  GenerationResult,
  TabType
};
