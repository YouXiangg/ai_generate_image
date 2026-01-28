interface HeaderProps {
    isConnected: boolean;
    onApiConfigClick: () => void;
}

export function Header({ isConnected, onApiConfigClick }: HeaderProps) {
    return (
        <header className="header">
            <div className="header-left">
                <div className="logo">
                    <div className="logo-icon">⚡</div>
                    <span>NanoGen Studio</span>
                </div>
                <span className="version-badge">v1.0</span>
            </div>
            <div className="header-right">
                <button className="btn btn-secondary" onClick={onApiConfigClick}>
                    ⚙️ API Config
                </button>
                <div className={`status-badge ${!isConnected ? 'disconnected' : ''}`}>
                    <span className="status-dot"></span>
                    {isConnected ? 'Connected' : 'Disconnected'}
                </div>
            </div>
        </header>
    );
}
