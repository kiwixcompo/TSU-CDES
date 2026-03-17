'use client';

import { useState, useRef } from 'react';
import { Upload, Link as LinkIcon } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function ImageUpload({ label, value, onChange, placeholder = "https://..." }: ImageUploadProps) {
  const [mode, setMode] = useState<'upload' | 'link'>('upload');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${mode === 'upload' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Upload size={12} /> Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('link')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${mode === 'link' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LinkIcon size={12} /> Link
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
          >
            <Upload className="text-gray-400" size={24} />
            <span className="text-sm text-gray-500 font-medium">Click to upload image (Max 5MB)</span>
          </div>
          {value && value.startsWith('data:image') && (
            <div className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
              ✓ Image uploaded successfully
            </div>
          )}
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
          placeholder={placeholder}
        />
      )}
      
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      
      {value && mode === 'link' && value.startsWith('http') && (
        <div className="mt-2 text-xs text-blue-600 font-medium flex items-center gap-1">
          ✓ Link provided
        </div>
      )}
    </div>
  );
}
