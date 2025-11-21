import React, { useState, useEffect } from 'react';
import { TranscriptionHistoryItem } from '../types';
import { CopyIcon, CheckIcon, TrashIcon } from './Icons';

interface HistoryItemProps {
  item: TranscriptionHistoryItem;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.text);
    setCopied(true);
  };

  const formattedDate = new Date(item.timestamp).toLocaleString();

  return (
    <div className="bg-gray-900/50 p-4 rounded-lg relative group">
      <p className="text-xs text-gray-500 mb-2">{formattedDate}</p>
      <p className="text-gray-300 text-sm leading-relaxed max-h-20 overflow-hidden">
        {item.text}
      </p>
       <button 
         onClick={handleCopy}
         className="absolute top-2 right-2 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
         aria-label="Copy transcription"
       >
         {copied ? <CheckIcon /> : <CopyIcon />}
       </button>
    </div>
  );
};

interface TranscriptionHistoryProps {
  history: TranscriptionHistoryItem[];
  onClear: () => void;
}

export const TranscriptionHistory: React.FC<TranscriptionHistoryProps> = ({ history, onClear }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-300">History</h2>
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-400 bg-red-900/30 hover:bg-red-900/60 rounded-md transition-colors"
          aria-label="Clear all history"
        >
          <TrashIcon />
          Clear History
        </button>
      </div>
      <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
        {history.map((item) => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};