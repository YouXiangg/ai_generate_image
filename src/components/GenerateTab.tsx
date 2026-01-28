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
    const [referenceImage, setReferenceImage] = useState<string | null>(null);
    const [imageMode, setImageMode] = useState<'source' | 'reference'>('source');
    const [prompt, setPrompt] = useState(initialPrompt || '');
    const [params, setParams] = useState<GenerationParams>({
        imageSize: DEFAULT_MODEL.supportedSizes[0],
        aspectRatio: '1:1',
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
            let finalPrompt = prompt;
            let finalImage = sourceImage;

            if (imageMode === 'reference' && referenceImage) {
                finalPrompt = `The following photo is a reference idea of the image, you should capture the characteristic, at the same time, follow the prompt provided to change/modify/regenerate the image, here is the reference image for you to follow:\n\nUser Prompt: ${prompt}`;
                finalImage = referenceImage;
            }

            const imageUrl = await generateImage(apiKey, finalPrompt, finalImage, params);
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
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="image-tabs">
                        <button
                            className={`image-tab ${imageMode === 'source' ? 'active' : ''}`}
                            onClick={() => setImageMode('source')}
                        >
                            Source Image
                        </button>
                        <button
                            className={`image-tab ${imageMode === 'reference' ? 'active' : ''}`}
                            onClick={() => setImageMode('reference')}
                        >
                            Reference Photo (Optional)
                        </button>
                    </div>
                    <div style={{ padding: 'var(--space-lg)' }}>
                        {imageMode === 'source' ? (
                            <ImageUpload
                                title="Source Image"
                                number="1"
                                image={sourceImage}
                                onImageChange={setSourceImage}
                            />
                        ) : (
                            <ImageUpload
                                title="Reference Photo"
                                number="Ref"
                                image={referenceImage}
                                onImageChange={setReferenceImage}
                            />
                        )}
                    </div>
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
