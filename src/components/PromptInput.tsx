import { useState, useRef, useEffect } from 'react';
import type { Prompt } from '../types';
import { getPrompts } from '../services/storage';

interface PromptInputProps {
    value: string;
    onChange: (value: string) => void;
}

export function PromptInput({ value, onChange }: PromptInputProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (showDropdown) {
            setPrompts(getPrompts());
        }
    }, [showDropdown]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectPrompt = (prompt: Prompt) => {
        onChange(prompt.content);
        setShowDropdown(false);
    };

    return (
        <div className="prompt-section">
            <div className="prompt-header">
                <div className="section-header" style={{ marginBottom: 0 }}>
                    <span className="section-number">2</span>
                    <span className="section-title">Edit Prompt</span>
                </div>
                <div className="load-prompt-dropdown" ref={dropdownRef}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        Load saved prompt...
                    </button>
                    {showDropdown && (
                        <div className="load-prompt-menu">
                            {prompts.length === 0 ? (
                                <div className="load-prompt-empty">
                                    No saved prompts yet
                                </div>
                            ) : (
                                prompts.map((prompt) => (
                                    <div
                                        key={prompt.id}
                                        className="load-prompt-item"
                                        onClick={() => handleSelectPrompt(prompt)}
                                    >
                                        <div className="load-prompt-title">{prompt.title}</div>
                                        <div className="load-prompt-preview">{prompt.content}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
            <textarea
                className="input textarea prompt-textarea"
                placeholder="Describe how you want to change the image (e.g., 'Add a neon sign', 'Make it cyberpunk style')"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
