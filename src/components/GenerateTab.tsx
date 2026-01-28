import { useState } from 'react';
import type { GenerationParams } from '../types';
import { ImageUpload } from './ImageUpload';
import { PromptInput } from './PromptInput';
import { AdvancedSettings } from './AdvancedSettings';
import { ResultDisplay } from './ResultDisplay';
import { generateImage } from '../services/gemini';
import { getApiKey } from '../services/storage';
import { DEFAULT_MODEL } from '../config/models';

interface GenerateTabProps {
    initialPrompt?: string;
    onClearInitialPrompt?: () => void;
}

export function GenerateTab({ initialPrompt, onClearInitialPrompt }: GenerateTabProps) {
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState(initialPrompt || '');
    const [params, setParams] = useState<GenerationParams>({
        imageSize: DEFAULT_MODEL.supportedSizes[0],
        style: 'natural',
    });
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Update prompt when initialPrompt changes
    useState(() => {
        if (initialPrompt) {
            setPrompt(initialPrompt);
            onClearInitialPrompt?.();
        }
    });

    const handleGenerate = async () => {
        const apiKey = getApiKey();
        if (!apiKey) {
            setError('Please set your API key first');
            return;
        }

        if (!prompt.trim()) {
            setError('Please enter a prompt');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const imageUrl = await generateImage(apiKey, prompt, sourceImage, params);
            setResult(imageUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate image');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!result) return;

        const link = document.createElement('a');
        link.href = result;
        link.download = `nanogen-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleRegenerate = () => {
        handleGenerate();
    };

    return (
        <div className="generate-layout">
            <div className="generate-left">
                <div className="card">
                    <ImageUpload image={sourceImage} onImageChange={setSourceImage} />
                </div>
                <div className="card">
                    <PromptInput value={prompt} onChange={setPrompt} />
                    <AdvancedSettings params={params} onChange={setParams} />
                    {error && (
                        <div style={{ color: 'var(--error)', fontSize: 13, marginTop: 8 }}>
                            {error}
                        </div>
                    )}
                    <button
                        className="btn btn-primary generate-btn"
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt.trim()}
                    >
                        {isLoading ? (
                            <>
                                <div className="spinner"></div>
                                Generating...
                            </>
                        ) : (
                            <>✨ Generate Image</>
                        )}
                    </button>
                </div>
            </div>
            <div className="generate-right">
                <ResultDisplay
                    result={result}
                    isLoading={isLoading}
                    onDownload={handleDownload}
                    onRegenerate={handleRegenerate}
                />
            </div>
        </div>
    );
}
