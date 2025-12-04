import React, { useState, useRef, useEffect } from 'react';
import { getLibraryItems, saveLibraryItem, deleteLibraryItem } from '../services/storageService';
import { LibraryItem } from '../types';
import { Camera, Mic, StopCircle, Save, Trash2, Plus, Book, Play, X, Image as ImageIcon } from 'lucide-react';
import { fileToGenerativePart } from '../services/geminiService';

export const Library: React.FC = () => {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [viewMode, setViewMode] = useState<'gallery' | 'create' | 'detail'>('gallery');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  // Creation State
  const [newTitle, setNewTitle] = useState('');
  const [newStory, setNewStory] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasAudioRecording, setHasAudioRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setItems(getLibraryItems());
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Convert to base64 for storage
    const base64Obj = await fileToGenerativePart(file);
    setNewImage(`data:${base64Obj.inlineData.mimeType};base64,${base64Obj.inlineData.data}`);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasAudioRecording(true); // Simulate successful recording
    } else {
      setIsRecording(true);
    }
  };

  const handleSave = () => {
    if (!newImage || !newTitle) return;

    saveLibraryItem({
      title: newTitle,
      story: newStory,
      date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
      image: newImage,
      hasAudio: hasAudioRecording
    });

    setItems(getLibraryItems());
    resetForm();
    setViewMode('gallery');
  };

  const handleDelete = (id: string) => {
    if(confirm('¿Estás seguro de borrar esta historia?')) {
        const updated = deleteLibraryItem(id);
        setItems(updated);
        setViewMode('gallery');
    }
  };

  const resetForm = () => {
    setNewTitle('');
    setNewStory('');
    setNewImage(null);
    setHasAudioRecording(false);
    setIsRecording(false);
  };

  /* --- VIEW: CREATE NEW --- */
  if (viewMode === 'create') {
    return (
      <div className="p-5 max-w-md mx-auto animate-fade-in pb-24">
        <div className="flex items-center gap-2 mb-4">
            <button onClick={() => { resetForm(); setViewMode('gallery'); }} className="bg-slate-100 p-2 rounded-full">
                <X className="w-6 h-6 text-slate-500" />
            </button>
            <h2 className="text-2xl font-black text-p-secondary">Nueva Historia</h2>
        </div>

        <div className="space-y-6">
            {/* 1. Photo */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">1. La Foto</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video bg-slate-100 rounded-3xl border-4 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-slate-200 transition relative"
                >
                    <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                    {newImage ? (
                        <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center text-slate-400">
                            <Camera className="w-10 h-10 mx-auto mb-2" />
                            <span className="font-bold">Toca para subir foto</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Voice */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">2. Tu Voz (Historia Oral)</label>
                <button 
                    onClick={toggleRecording}
                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                        hasAudioRecording 
                        ? 'bg-green-100 text-green-700 border-2 border-green-200'
                        : isRecording 
                            ? 'bg-red-100 text-red-600 animate-pulse border-2 border-red-200' 
                            : 'bg-white border-2 border-p-secondary/20 text-p-secondary shadow-sm'
                    }`}
                >
                    {hasAudioRecording ? (
                        <>
                            <CheckCircle2 className="w-6 h-6" />
                            <span>¡Audio Guardado! (Toca para regrabar)</span>
                        </>
                    ) : isRecording ? (
                        <>
                            <StopCircle className="w-6 h-6 fill-current" />
                            <span>Grabando... (Toca para terminar)</span>
                        </>
                    ) : (
                        <>
                            <Mic className="w-6 h-6" />
                            <span>Grabar Relato de Voz</span>
                        </>
                    )}
                </button>
            </div>

            {/* 3. Text */}
            <div className="space-y-2">
                 <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">3. Detalles Escritos</label>
                 <input 
                    type="text" 
                    placeholder="Título de la obra (ej. Poncho de José)"
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold text-ink focus:border-p-secondary focus:outline-none"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                 />
                 <textarea 
                    placeholder="Escribe aquí los detalles técnicos o el significado del patrón..."
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 text-ink focus:border-p-secondary focus:outline-none h-32 resize-none"
                    value={newStory}
                    onChange={(e) => setNewStory(e.target.value)}
                 />
            </div>

            <button 
                onClick={handleSave}
                disabled={!newImage || !newTitle}
                className="w-full bg-p-secondary text-white py-4 rounded-2xl font-black text-lg shadow-card flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none hover:bg-p-secondary/90 transition"
            >
                <Save className="w-6 h-6" />
                Guardar en Biblioteca
            </button>
        </div>
      </div>
    );
  }

  /* --- VIEW: DETAIL --- */
  if (viewMode === 'detail' && selectedItem) {
      return (
        <div className="p-5 max-w-md mx-auto animate-slide-up pb-24">
             <div className="flex items-center justify-between mb-4">
                <button onClick={() => setViewMode('gallery')} className="bg-slate-100 p-2 rounded-full">
                    <X className="w-6 h-6 text-slate-500" />
                </button>
                <button onClick={() => handleDelete(selectedItem.id)} className="bg-red-50 p-2 rounded-full">
                    <Trash2 className="w-6 h-6 text-red-500" />
                </button>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-slate-100">
                <div className="relative aspect-square">
                    <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-20">
                        <h2 className="text-3xl font-black text-white">{selectedItem.title}</h2>
                        <p className="text-white/80 font-medium">{selectedItem.date}</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {selectedItem.hasAudio && (
                        <div className="bg-p-secondary/10 p-4 rounded-2xl flex items-center gap-4">
                            <button className="w-12 h-12 bg-p-secondary text-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition">
                                <Play className="w-5 h-5 ml-1" />
                            </button>
                            <div>
                                <p className="font-bold text-p-secondary">Relato de Voz</p>
                                <div className="w-32 h-1 bg-p-secondary/20 rounded-full mt-1">
                                    <div className="w-1/2 h-full bg-p-secondary rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="font-black text-slate-400 uppercase tracking-widest text-xs mb-2">La Historia</h3>
                        <p className="text-lg text-ink leading-relaxed font-medium">
                            {selectedItem.story || "Sin descripción escrita."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  /* --- VIEW: GALLERY (DEFAULT) --- */
  return (
    <div className="p-5 max-w-md mx-auto pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-black text-p-secondary">Biblioteca</h2>
            <p className="text-slate-500 font-medium">Tus obras y sus memorias</p>
        </div>
        <div className="bg-p-secondary/10 p-2 rounded-xl">
            <Book className="w-6 h-6 text-p-secondary" />
        </div>
      </div>

      <button 
        onClick={() => setViewMode('create')}
        className="w-full bg-gradient-to-r from-p-secondary to-p-teal text-white p-4 rounded-3xl shadow-pedagogical flex items-center justify-center gap-2 font-bold hover:scale-[1.02] transition-transform"
      >
        <Plus className="w-6 h-6" />
        Agregar Nueva Obra
      </button>

      <div className="grid grid-cols-2 gap-4">
        {items.map(item => (
            <div 
                key={item.id} 
                onClick={() => { setSelectedItem(item); setViewMode('detail'); }}
                className="bg-white p-3 rounded-3xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow group"
            >
                <div className="aspect-square rounded-2xl overflow-hidden mb-3 relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {item.hasAudio && (
                        <div className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full backdrop-blur-sm">
                            <Mic className="w-3 h-3 text-white" />
                        </div>
                    )}
                </div>
                <h3 className="font-bold text-ink text-sm leading-tight line-clamp-2">{item.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{item.date}</p>
            </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-10 opacity-50">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="text-slate-400 font-medium">Tu biblioteca está vacía.</p>
        </div>
      )}
    </div>
  );
};

// Helper for UI
const CheckCircle2 = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
);
