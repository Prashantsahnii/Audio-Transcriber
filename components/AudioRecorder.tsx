import React from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { MicIcon, StopCircleIcon } from './Icons';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isLoading: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, isLoading }) => {
  const { isRecording, recordingTime, startRecording, stopRecording, error } = useAudioRecorder({
    onRecordingComplete,
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-64 bg-gray-700/50 rounded-lg">
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <div className="flex flex-col items-center space-y-4">
        {isRecording ? (
          <>
            <button
              onClick={stopRecording}
              disabled={isLoading}
              className="flex items-center justify-center w-24 h-24 bg-red-600 rounded-full text-white shadow-lg transform hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Stop recording"
            >
              <StopCircleIcon />
            </button>
            <div className="w-28 text-center px-3 py-1 bg-gray-900 rounded-full text-lg font-mono tracking-wider">
              {formatTime(recordingTime)}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={startRecording}
              disabled={isLoading}
              className="flex items-center justify-center w-24 h-24 bg-indigo-600 rounded-full text-white shadow-lg transform hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Start recording"
            >
              <MicIcon />
            </button>
            <p className="text-gray-400">Click the button to start recording</p>
          </>
        )}
      </div>
    </div>
  );
};