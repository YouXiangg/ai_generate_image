interface ResultDisplayProps {
    result: string | null;
    isLoading: boolean;
    onDownload: () => void;
    onRegenerate: () => void;
}

export function ResultDisplay({
    result,
    isLoading,
    onDownload,
    onRegenerate,
}: ResultDisplayProps) {
    return (
        <div className="card result-container">
            <div className="section-header">
                <span className="section-number">3</span>
                <span className="section-title">Result</span>
            </div>
            {isLoading ? (
                <div className="result-empty">
                    <div className="result-empty-icon">
                        <div className="spinner" style={{ width: 24, height: 24 }}></div>
                    </div>
                    <div>Generating your image...</div>
                    <div style={{ fontSize: 12 }}>This may take a few seconds</div>
                </div>
            ) : result ? (
                <div className="result-image-container">
                    <div className="result-image">
                        <img src={result} alt="Generated result" />
                    </div>
                    <div className="result-actions">
                        <button className="btn btn-primary" onClick={onDownload}>
                            ⬇ Download
                        </button>
                        <button className="btn btn-secondary" onClick={onRegenerate}>
                            ↻ Regenerate
                        </button>
                    </div>
                </div>
            ) : (
                <div className="result-empty">
                    <div className="result-empty-icon">🖼️</div>
                    <div>Your masterpiece will appear here</div>
                    <div style={{ fontSize: 12 }}>Configure settings and click Generate</div>
                </div>
            )}
        </div>
    );
}
