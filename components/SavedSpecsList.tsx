import React from 'react';
import { SavedSpec } from '../types';
import { SavedSpecItem } from './SavedSpecItem';
import { ExportIcon } from './icons/ExportIcon';

interface SavedSpecsListProps {
  specs: SavedSpec[];
  onView: (spec: SavedSpec) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
}

export const SavedSpecsList: React.FC<SavedSpecsListProps> = ({ specs, onView, onDelete, onExport }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-700 pb-2">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Saved Specifications
        </h2>
        <button 
          onClick={onExport} 
          disabled={specs.length === 0}
          className="flex items-center gap-2 bg-slate-700 text-slate-200 font-semibold py-2 px-4 rounded-md hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed disabled:text-slate-500 transition-colors duration-200 text-sm"
          aria-label="Export all specifications"
        >
          <ExportIcon className="w-4 h-4" />
          Export All
        </button>
      </div>
      {specs.length === 0 ? (
        <div className="text-center py-12 px-6 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="text-slate-400">You haven't saved any specifications yet.</p>
          <p className="text-sm text-slate-500 mt-1">Generated specs will appear here once you save them.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specs.map((spec) => (
            <li key={spec.id}>
              <SavedSpecItem spec={spec} onView={onView} onDelete={onDelete} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
