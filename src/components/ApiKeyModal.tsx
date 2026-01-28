import { useState } from 'react';
import { setApiKey, getApiKey } from '../services/storage';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (key: string) => void;
}

export function ApiKeyModal({ isOpen, onClose, onSave }: ApiKeyModalProps) {
    const [apiKey, setApiKeyValue] = useState(getApiKey() || '');
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!apiKey.trim()) return;

        setIsSaving(true);
        try {
            setApiKey(apiKey.trim());
            onSave(apiKey.trim());
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="modal-close" onClick={onClose}>×</button>
                    <div className="modal-icon">🔑</div>
                    <h2 className="modal-title">Enter API Key</h2>
                    <p className="modal-subtitle">
                        Your API key is stored locally in your browser and never sent to our servers.
                    </p>
                </div>
                <div className="modal-body">
                    <input
                        type="password"
                        className="input"
                        placeholder="Paste your Gemini API Key here"
                        value={apiKey}
                        onChange={(e) => setApiKeyValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        onClick={handleSave}
                        disabled={!apiKey.trim() || isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save API Key'}
                    </button>
                </div>
                <div className="modal-footer">
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Get your API key from Google AI Studio ↗
                    </a>
                </div>
            </div>
        </div>
    );
}
