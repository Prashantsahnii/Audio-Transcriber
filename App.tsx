import React, { useState, useCallback, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { AudioRecorder } from './components/AudioRecorder';
import { TranscriptionDisplay } from './components/TranscriptionDisplay';
import { transcribeAudio } from './services/geminiService';
import { ActiveTab, TranscriptionHistoryItem } from './types';
import { UploadIcon, MicIcon } from './components/Icons';
import { TranscriptionHistory } from './components/TranscriptionHistory';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.Upload);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TranscriptionHistoryItem[]>([]);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('transcriptionHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (err) {
      console.error("Failed to parse transcription history from localStorage", err);
      setHistory([]);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('transcriptionHistory', JSON.stringify(history));
    } catch (err) {
      console.error("Failed to save transcription history to localStorage", err);
    }
  }, [history]);

  const handleTranscription = useCallback(async (audioData: File | Blob) => {
    setIsLoading(true);
    setError(null);
    setTranscription(null);
    try {
      const result = await transcribeAudio(audioData);
      setTranscription(result);
      const newItem: TranscriptionHistoryItem = {
        id: new Date().toISOString(),
        text: result,
        timestamp: Date.now(),
      };
      setHistory(prevHistory => [newItem, ...prevHistory]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please ensure your API key is set correctly.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const onFileSelect = (file: File) => {
    handleTranscription(file);
  };

  const onRecordingComplete = (audioBlob: Blob) => {
    handleTranscription(audioBlob);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
            Audio Transcriber
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Upload a file or start recording to get a transcription powered by Gemini.
          </p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-indigo-900/20 border border-gray-700/50 p-6 sm:p-8">
          <div className="flex border-b border-gray-700 mb-6">
            <TabButton
              label="Upload File"
              icon={<UploadIcon />}
              isActive={activeTab === ActiveTab.Upload}
              onClick={() => setActiveTab(ActiveTab.Upload)}
            />
            <TabButton
              label="Record Audio"
              icon={<MicIcon />}
              isActive={activeTab === ActiveTab.Record}
              onClick={() => setActiveTab(ActiveTab.Record)}
            />
          </div>

          <div className="transition-all duration-300">
            {activeTab === ActiveTab.Upload ? (
              <FileUpload onFileSelect={onFileSelect} isLoading={isLoading} />
            ) : (
              <AudioRecorder onRecordingComplete={onRecordingComplete} isLoading={isLoading} />
            )}
          </div>
          
          <TranscriptionDisplay 
            transcription={transcription}
            isLoading={isLoading}
            error={error}
          />
          
          <TranscriptionHistory history={history} onClear={clearHistory} />
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
}

interface TabButtonProps {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm sm:text-base font-semibold border-b-2 transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:ring-indigo-500 rounded-t-lg ${
            isActive
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-700/50'
        }`}
    >
        {icon}
        {label}
    </button>
);