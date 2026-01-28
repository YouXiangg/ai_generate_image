import { useRef, useState, type DragEvent } from 'react';

interface ImageUploadProps {
    title: string;
    number: string;
    image: string | null;
    onImageChange: (image: string | null) => void;
}

export function ImageUpload({ title, number, image, onImageChange }: ImageUploadProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (JPG, PNG, or WEBP)');
            return;
        }

        if (file.size > 20 * 1024 * 1024) {
            alert('File size must be less than 20MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            onImageChange(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onImageChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <div className="section-header">
                <span className="section-number">{number}</span>
                <span className="section-title">{title}</span>
            </div>
            <div
                className={`upload-zone ${isDragOver ? 'dragover' : ''} ${image ? 'has-image' : ''}`}
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />
                {image ? (
                    <div className="upload-preview">
                        <img src={image} alt="Uploaded preview" />
                        <button className="upload-preview-remove" onClick={handleRemove}>
                            ✕
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="upload-icon">⬆</div>
                        <div className="upload-text">Click to upload or drag & drop</div>
                        <div className="upload-hint">JPG, PNG, WEBP (Max 20MB)</div>
                    </>
                )}
            </div>
        </div>
    );
}
