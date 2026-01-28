import type { TabType } from '../types';

interface TabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function Tabs({ activeTab, onTabChange }: TabsProps) {
    return (
        <nav className="tabs">
            <button
                className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
                onClick={() => onTabChange('generate')}
            >
                🖼️ Generate Image
            </button>
            <button
                className={`tab ${activeTab === 'prompts' ? 'active' : ''}`}
                onClick={() => onTabChange('prompts')}
            >
                ≡ Saved Prompts
            </button>
        </nav>
    );
}
