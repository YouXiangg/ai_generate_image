import { useState } from 'react';
import type { GenerationParams } from '../types';
import { MODELS, DEFAULT_MODEL, getModelById } from '../config/models';

interface AdvancedSettingsProps {
    params: GenerationParams;
    onChange: (params: GenerationParams) => void;
}

export function AdvancedSettings({ params, onChange }: AdvancedSettingsProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const selectedModelId = params.modelId || DEFAULT_MODEL.id;
    const model = getModelById(selectedModelId) || DEFAULT_MODEL;

    const handleModelChange = (modelId: string) => {
        const newModel = getModelById(modelId) || DEFAULT_MODEL;
        // Reset to first available size/style when switching models
        onChange({
            ...params,
            modelId,
            imageSize: newModel.supportedSizes[0],
            style: newModel.supportedStyles?.[0] || 'natural',
        });
    };

    return (
        <div>
            <button
                className="advanced-toggle"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? '▾' : '▸'} Advanced Settings
            </button>
            {isExpanded && (
                <div className="advanced-content">
                    <div className="form-group">
                        <label className="form-label">Model</label>
                        <select
                            className="select"
                            value={selectedModelId}
                            onChange={(e) => handleModelChange(e.target.value)}
                        >
                            {MODELS.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Image Size</label>
                        <select
                            className="select"
                            value={params.imageSize}
                            onChange={(e) => onChange({ ...params, imageSize: e.target.value })}
                        >
                            {model.supportedSizes.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Seed (optional)</label>
                        <input
                            type="number"
                            className="input"
                            placeholder="Random"
                            value={params.seed || ''}
                            onChange={(e) =>
                                onChange({
                                    ...params,
                                    seed: e.target.value ? parseInt(e.target.value) : undefined,
                                })
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Style</label>
                        <select
                            className="select"
                            value={params.style || 'natural'}
                            onChange={(e) => onChange({ ...params, style: e.target.value })}
                        >
                            {model.supportedStyles?.map((style) => (
                                <option key={style} value={style}>
                                    {style.charAt(0).toUpperCase() + style.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}

