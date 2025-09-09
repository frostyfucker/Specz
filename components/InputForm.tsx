import React, { useState, useRef, useCallback } from 'react';
import { Persona, MediaInput } from '../types';
import { PERSONAS } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { CameraIcon } from './icons/CameraIcon';
import { UploadIcon } from './icons/UploadIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface InputFormProps {
  description: string;
  setDescription: (value: string) => void;
  persona: Persona;
  setPersona: (value: Persona) => void;
  mediaInput: MediaInput | null;
  setMediaInput: (value: MediaInput | null) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  description,
  setDescription,
  persona,
  setPersona,
  mediaInput,
  setMediaInput,
  onSubmit,
  isLoading,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingType, setRecordingType] = useState<'audio' | 'video' | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64String = (loadEvent.target?.result as string).split(',')[1];
        if (base64String) {
          setMediaInput({ data: base64String, mimeType: file.type });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setRecordingType(null);
  }, []);

  const startRecording = async (type: 'audio' | 'video') => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'video',
      });

      setIsRecording(true);
      setRecordingType(type);
      mediaChunksRef.current = [];
      
      const mimeType = type === 'video' ? 'video/webm' : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          mediaChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(mediaChunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          setMediaInput({ data: base64String, mimeType: mimeType });
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
    } catch (err) {
      console.error("Error accessing media devices.", err);
      alert("Could not access camera/microphone. Please check permissions.");
    }
  };

  const handleMediaButtonClick = (type: 'audio' | 'video') => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording(type);
    }
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 h-full flex flex-col">
      <div className="flex-grow flex flex-col gap-6">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
            High-Level Description (Optional if using media)
          </label>
          <textarea
            id="description"
            rows={8}
            className="w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 ease-in-out"
            placeholder="e.g., 'An app that lets users trade digital art using blockchain technology.'"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading || isRecording}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Or Describe with Media
          </label>
          {mediaInput ? (
            <div className="flex items-center justify-between bg-slate-900 p-3 rounded-md border border-slate-600">
              <span className="text-sm text-emerald-400">
                {mediaInput.mimeType.startsWith('audio') ? 'Audio' : 'Video'} clip attached
              </span>
              <button onClick={() => setMediaInput(null)} disabled={isLoading} aria-label="Clear media">
                <XCircleIcon className="w-6 h-6 text-slate-400 hover:text-red-400 transition-colors" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
               <button 
                  onClick={() => handleMediaButtonClick('audio')}
                  disabled={isLoading || (isRecording && recordingType !== 'audio')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-md border border-slate-600 transition-colors duration-200 ${isRecording && recordingType === 'audio' ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-900 hover:bg-slate-700'}`}
                >
                  <MicrophoneIcon className="w-5 h-5"/>
                  <span>{isRecording && recordingType === 'audio' ? 'Stop' : 'Audio'}</span>
                </button>
                <button 
                  onClick={() => handleMediaButtonClick('video')}
                  disabled={isLoading || (isRecording && recordingType !== 'video')}
                  className={`flex items-center justify-center gap-2 p-3 rounded-md border border-slate-600 transition-colors duration-200 ${isRecording && recordingType === 'video' ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-900 hover:bg-slate-700'}`}
                >
                  <CameraIcon className="w-5 h-5"/>
                  <span>{isRecording && recordingType === 'video' ? 'Stop' : 'Video'}</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*,video/*" className="hidden" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isRecording}
                  className="flex items-center justify-center gap-2 p-3 bg-slate-900 rounded-md border border-slate-600 hover:bg-slate-700 transition-colors duration-200 disabled:opacity-50"
                >
                  <UploadIcon className="w-5 h-5"/>
                  <span>Upload</span>
                </button>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="persona" className="block text-sm font-medium text-slate-300 mb-2">
            Generate As...
          </label>
          <select
            id="persona"
            className="w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-3 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 ease-in-out"
            value={persona}
            onChange={(e) => setPersona(e.target.value as Persona)}
            disabled={isLoading || isRecording}
          >
            {Object.values(PERSONAS).map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-2">
            {PERSONAS[persona].description}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={onSubmit}
          disabled={isLoading || isRecording || (!description.trim() && !mediaInput)}
          className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Generate Specification
            </>
          )}
        </button>
      </div>
    </div>
  );
};
