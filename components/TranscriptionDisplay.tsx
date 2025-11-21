import React, { useState, useEffect } from 'react';
import { Spinner } from './Spinner';
import { CopyIcon, CheckIcon } from './Icons';

interface TranscriptionDisplayProps {
  transcription: string | null;
  isLoading: boolean;
  error: string | null;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ transcription, isLoading, error }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (transcription) {
      navigator.clipboard.writeText(transcription);
      setCopied(true);
    }
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <Spinner />
          <p className="mt-2 text-lg">Transcribing audio...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center text-red-400 bg-red-900/30 p-4 rounded-lg">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }
    if (transcription) {
      return (
        <div className="relative">
           <button 
             onClick={handleCopy}
             className="absolute top-2 right-2 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
             aria-label="Copy transcription"
           >
             {copied ? <CheckIcon /> : <CopyIcon />}
           </button>
          <blockquote className="p-4 bg-gray-900/50 rounded-lg border-l-4 border-indigo-500 text-gray-200 whitespace-pre-wrap leading-relaxed">
            {transcription}
          </blockquote>
        </div>
      );
    }
    return (
        <div className="text-center text-gray-500">
            <p>Your transcription will appear here.</p>
        </div>
    );
  };

  return <div className="mt-6 min-h-[10rem] flex items-center justify-center">{renderContent()}</div>;
};