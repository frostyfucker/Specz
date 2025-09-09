import React, { useState, useCallback, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { SpecDisplay } from './components/SpecDisplay';
import { SavedSpecsList } from './components/SavedSpecsList';
import { generateSpecification } from './services/geminiService';
import { Persona, SavedSpec, MediaInput } from './types';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [description, setDescription] = useState<string>('');
  const [persona, setPersona] = useState<Persona>(Persona.PRODUCT_MANAGER);
  const [mediaInput, setMediaInput] = useState<MediaInput | null>(null);
  const [spec, setSpec] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSpecs, setSavedSpecs] = useState<SavedSpec[]>([]);

  useEffect(() => {
    try {
      const storedSpecs = localStorage.getItem('savedSpecs');
      if (storedSpecs) {
        setSavedSpecs(JSON.parse(storedSpecs));
      }
    } catch (error) {
      console.error("Failed to load specs from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('savedSpecs', JSON.stringify(savedSpecs));
    } catch (error) {
      console.error("Failed to save specs to localStorage", error);
    }
  }, [savedSpecs]);

  const handleSubmit = useCallback(async () => {
    if (!description.trim() && !mediaInput) {
      setError('Please enter a description or provide an audio/video clip.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSpec('');

    try {
      const generatedSpec = await generateSpecification(description, persona, mediaInput);
      setSpec(generatedSpec);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate specification. ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [description, persona, mediaInput]);

  const handleSaveSpec = useCallback(() => {
    if (!spec || (!description && !mediaInput) || !persona) return;

    const newSpec: SavedSpec = {
      id: `spec_${Date.now()}`,
      description: description || `Media-based spec generated on ${new Date().toLocaleDateString()}`,
      persona,
      spec,
      createdAt: new Date().toISOString(),
    };

    setSavedSpecs(prevSpecs => [newSpec, ...prevSpecs]);
  }, [spec, description, persona, mediaInput]);

  const handleDeleteSpec = useCallback((id: string) => {
    setSavedSpecs(prevSpecs => prevSpecs.filter(s => s.id !== id));
  }, []);

  const handleViewSpec = useCallback((specToView: SavedSpec) => {
    setDescription(specToView.description);
    setPersona(specToView.persona);
    setSpec(specToView.spec);
    setMediaInput(null); // Clear any active media input
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const handleExportSpecs = useCallback(() => {
    if (savedSpecs.length === 0) {
      alert("No saved specifications to export.");
      return;
    };

    try {
      const jsonString = JSON.stringify(savedSpecs, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spec-generator-ai-export-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export specs:", error);
      setError("An error occurred while exporting the specifications.");
    }
  }, [savedSpecs]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <header className="w-full p-4 border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <SparklesIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold tracking-tight text-white">Spec Generator AI</h1>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-white">1. Describe Your Vision</h2>
            <InputForm
              description={description}
              setDescription={setDescription}
              persona={persona}
              setPersona={setPersona}
              mediaInput={mediaInput}
              setMediaInput={setMediaInput}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-white">2. Review Generated Spec</h2>
            <SpecDisplay spec={spec} isLoading={isLoading} error={error} onSave={handleSaveSpec} />
          </div>
        </div>

        <div className="mt-16">
          <SavedSpecsList
            specs={savedSpecs}
            onView={handleViewSpec}
            onDelete={handleDeleteSpec}
            onExport={handleExportSpecs}
          />
        </div>
      </main>
      
      <footer className="w-full text-center p-4 mt-8 border-t border-slate-800">
        <p className="text-sm text-slate-500">Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;