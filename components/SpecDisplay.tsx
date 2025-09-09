import React from 'react';
import { UserIcon } from './icons/UserIcon';
import { CodeIcon } from './icons/CodeIcon';
import { DesignIcon } from './icons/DesignIcon';
import { SaveIcon } from './icons/SaveIcon';

interface SpecDisplayProps {
  spec: string;
  isLoading: boolean;
  error: string | null;
  onSave: () => void;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-5 animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-1/3"></div>
        <div className="space-y-3">
            <div className="h-3 bg-slate-700 rounded"></div>
            <div className="h-3 bg-slate-700 rounded w-5/6"></div>
            <div className="h-3 bg-slate-700 rounded w-4/6"></div>
        </div>
        <div className="h-4 bg-slate-700 rounded w-1/4 mt-6"></div>
        <div className="space-y-3">
            <div className="h-3 bg-slate-700 rounded"></div>
            <div className="h-3 bg-slate-700 rounded w-5/6"></div>
        </div>
    </div>
);


const InitialState: React.FC = () => (
  <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full gap-6">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-slate-700 rounded-full"><UserIcon className="w-8 h-8 text-cyan-400" /></div>
      <div className="p-3 bg-slate-700 rounded-full"><CodeIcon className="w-8 h-8 text-cyan-400" /></div>
      <div className="p-3 bg-slate-700 rounded-full"><DesignIcon className="w-8 h-8 text-cyan-400" /></div>
    </div>
    <p className="text-lg font-medium">Your generated spec will appear here.</p>
    <p>Fill out the form and let the AI assist you.</p>
  </div>
);

export const SpecDisplay: React.FC<SpecDisplayProps> = ({ spec, isLoading, error, onSave }) => {
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }
    if (error) {
      return (
        <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-md">
          <h3 className="font-bold mb-2">An Error Occurred</h3>
          <p>{error}</p>
        </div>
      );
    }
    if (spec) {
      // Using a div with prose-like styling for readability of pre-formatted text
      return (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={onSave}
              className="flex items-center gap-2 bg-slate-700 text-slate-200 font-semibold py-2 px-4 rounded-md hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
              aria-label="Save specification"
            >
              <SaveIcon className="w-4 h-4" />
              Save Spec
            </button>
          </div>
          <div className="prose prose-invert prose-slate max-w-none 
                         prose-headings:text-cyan-300 prose-strong:text-white 
                         prose-blockquote:border-l-cyan-400 prose-blockquote:text-slate-300
                         prose-code:bg-slate-900 prose-code:p-1 prose-code:rounded-sm prose-code:text-emerald-300
                         prose-a:text-cyan-400 hover:prose-a:text-cyan-300">
              <pre className="whitespace-pre-wrap break-words font-sans text-base leading-relaxed">{spec}</pre>
          </div>
        </>
      );
    }
    return <InitialState />;
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 h-full min-h-[400px] lg:min-h-0 overflow-y-auto">
      {renderContent()}
    </div>
  );
};
