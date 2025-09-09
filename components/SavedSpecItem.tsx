
import React from 'react';
import { SavedSpec, Persona } from '../types';
import { PERSONAS } from '../constants';
import { UserIcon } from './icons/UserIcon';
import { CodeIcon } from './icons/CodeIcon';
import { DesignIcon } from './icons/DesignIcon';
import { TrashIcon } from './icons/TrashIcon';

interface SavedSpecItemProps {
  spec: SavedSpec;
  onView: (spec: SavedSpec) => void;
  onDelete: (id: string) => void;
}

const personaIcons: Record<Persona, React.FC<React.SVGProps<SVGSVGElement>>> = {
  [Persona.NARRATIVE]: UserIcon,
  [Persona.REFERENCE]: CodeIcon,
  [Persona.JOURNEYS]: DesignIcon,
};

export const SavedSpecItem: React.FC<SavedSpecItemProps> = ({ spec, onView, onDelete }) => {
  const PersonaIcon = personaIcons[spec.persona];
  const personaLabel = PERSONAS[spec.persona]?.label || spec.persona;
  
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(spec.createdAt));

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col h-full hover:border-cyan-500 transition-colors duration-200">
      <div className="flex-grow">
        <div className="flex items-center gap-3 mb-3">
          <span className="p-2 bg-slate-700 rounded-full">
            <PersonaIcon className="w-5 h-5 text-cyan-400" />
          </span>
          <h3 className="font-bold text-lg text-white">{personaLabel}</h3>
        </div>
        <p className="text-slate-300 text-sm mb-4 line-clamp-3" title={spec.description}>
          {spec.description}
        </p>
      </div>
      <div className="mt-auto">
        <p className="text-xs text-slate-500 mb-4">{formattedDate}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(spec)}
            className="flex-1 bg-slate-700 text-slate-200 font-semibold py-2 px-3 rounded-md hover:bg-slate-600 transition-colors duration-200 text-sm"
          >
            View
          </button>
          <button
            onClick={() => onDelete(spec.id)}
            aria-label="Delete specification"
            className="p-2 bg-slate-700 text-red-400 rounded-md hover:bg-red-900/50 hover:text-red-300 transition-colors duration-200"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
