import { useState, useEffect } from 'react';
import type { TabType } from './types';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { ApiKeyModal } from './components/ApiKeyModal';
import { GenerateTab } from './components/GenerateTab';
import { PromptsTab } from './components/PromptsTab';
import { getApiKey } from './services/storage';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('generate');
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | undefined>();

  useEffect(() => {
    // Check if API key exists on mount
    const key = getApiKey();
    setIsConnected(!!key);
  }, []);

  const handleApiKeySave = (key: string) => {
    setIsConnected(!!key);
  };

  const handleUsePrompt = (content: string) => {
    setPendingPrompt(content);
    setActiveTab('generate');
  };

  const handleClearPendingPrompt = () => {
    setPendingPrompt(undefined);
  };

  return (
    <div className="app">
      <Header
        isConnected={isConnected}
        onApiConfigClick={() => setIsApiModalOpen(true)}
      />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {activeTab === 'generate' ? (
          <GenerateTab
            initialPrompt={pendingPrompt}
            onClearInitialPrompt={handleClearPendingPrompt}
          />
        ) : (
          <PromptsTab onUsePrompt={handleUsePrompt} />
        )}
      </main>
      <ApiKeyModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onSave={handleApiKeySave}
      />
    </div>
  );
}

export default App;
