import { useState, useEffect, useRef } from 'react';
import type { Prompt } from '../types';
import {
    getPrompts,
    savePrompt,
    deletePrompt,
    generateId,
    exportPrompts,
    importPrompts,
} from '../services/storage';

interface PromptsTabProps {
    onUsePrompt: (content: string) => void;
}

export function PromptsTab({ onUsePrompt }: PromptsTabProps) {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        exportPrompts();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const count = await importPrompts(file);
            setPrompts(getPrompts());
            alert(`Successfully imported ${count} prompt(s)!`);
        } catch (error) {
            alert(`Failed to import: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        setPrompts(getPrompts());
    }, []);

    const filteredPrompts = prompts.filter(
        (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedPrompt = prompts.find((p) => p.id === selectedId);

    const handleSelect = (prompt: Prompt) => {
        setSelectedId(prompt.id);
        setEditTitle(prompt.title);
        setEditContent(prompt.content);
        setIsCreating(false);
    };

    const handleNewPrompt = () => {
        setSelectedId(null);
        setEditTitle('');
        setEditContent('');
        setIsCreating(true);
    };

    const handleSave = () => {
        if (!editTitle.trim() || !editContent.trim()) return;

        const prompt: Prompt = {
            id: selectedId || generateId(),
            title: editTitle.trim(),
            content: editContent.trim(),
            createdAt: selectedPrompt?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        savePrompt(prompt);
        setPrompts(getPrompts());
        setSelectedId(prompt.id);
        setIsCreating(false);
    };

    const handleDelete = () => {
        if (!selectedId) return;

        if (confirm('Are you sure you want to delete this prompt?')) {
            deletePrompt(selectedId);
            setPrompts(getPrompts());
            setSelectedId(null);
            setEditTitle('');
            setEditContent('');
        }
    };

    const handleUsePrompt = () => {
        if (editContent.trim()) {
            onUsePrompt(editContent.trim());
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="prompts-layout">
            <div className="prompts-sidebar">
                <div className="prompts-header-actions">
                    <button className="btn btn-primary" onClick={handleNewPrompt}>
                        + New Prompt
                    </button>
                    <div className="prompts-import-export">
                        <button className="btn btn-ghost btn-sm" onClick={handleExport} title="Export prompts">
                            📤 Export
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={handleImportClick} title="Import prompts">
                            📥 Import
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleImportFile}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>
                <div className="search-input">
                    <span className="search-input-icon">🔍</span>
                    <input
                        type="text"
                        className="input"
                        placeholder="Search prompts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: 36 }}
                    />
                </div>
                <div className="prompts-list">
                    {filteredPrompts.map((prompt) => (
                        <div
                            key={prompt.id}
                            className={`prompt-item ${selectedId === prompt.id ? 'selected' : ''}`}
                            onClick={() => handleSelect(prompt)}
                        >
                            <div className="prompt-item-title">
                                <span className="prompt-item-name">{prompt.title}</span>
                                <span className="prompt-item-date">
                                    {formatDate(prompt.updatedAt)}
                                </span>
                            </div>
                            <div className="prompt-item-preview">{prompt.content}</div>
                        </div>
                    ))}
                    {filteredPrompts.length === 0 && (
                        <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)' }}>
                            {searchQuery ? 'No prompts found' : 'No saved prompts yet'}
                        </div>
                    )}
                </div>
            </div>
            <div className="prompt-editor">
                {selectedId || isCreating ? (
                    <div className="prompt-editor-form">
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Give your prompt a name..."
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                            />
                        </div>
                        <div className="prompt-editor-content">
                            <label className="form-label">Prompt Content</label>
                            <textarea
                                className="input textarea"
                                placeholder="Write your prompt here..."
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                        </div>
                        <div className="prompt-editor-actions">
                            <button
                                className="btn btn-primary"
                                onClick={handleSave}
                                disabled={!editTitle.trim() || !editContent.trim()}
                            >
                                Save Prompt
                            </button>
                            {selectedId && (
                                <>
                                    <button className="btn btn-secondary" onClick={handleUsePrompt}>
                                        Use Prompt →
                                    </button>
                                    <button className="btn btn-ghost" onClick={handleDelete}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="prompt-editor-empty">
                        <div className="prompt-editor-empty-icon">✏️</div>
                        <div>Select a prompt to edit</div>
                        <div style={{ fontSize: 12, marginBottom: 8 }}>
                            Or create a new one to get started
                        </div>
                        <button className="btn btn-secondary" onClick={handleNewPrompt}>
                            Create New
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
