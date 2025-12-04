import React, { useState, useRef } from 'react';
import { validateSymbolism } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { Sparkles, HelpCircle, Book, Search, Star } from 'lucide-react';

export const CulturalValidator: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult>({ status: 'idle', message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setResult({ status: 'loading', message: 'Consultando a los ancestros...' });

    try {
      const data = await validateSymbolism(file);
      setResult({
        status: 'success',
        message: 'Validación completada',
        culturalData: data
      });
    } catch (error) {
      setResult({ status: 'error', message: 'No se pudo identificar el símbolo.' });
    }
  };

  return (
    <div className="p-5 max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-black text-p-teal">Descubre el Símbolo</h2>
        <p className="text-slate-500 font-medium">¿Qué historia cuenta tu tejido?</p>
      </div>

      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        
        {!image ? (
          <div className="aspect-square bg-gradient-to-br from-p-teal/10 to-p-secondary/10 rounded-full border-4 border-dashed border-p-teal/30 flex flex-col items-center justify-center hover:bg-p-teal/20 transition-all mx-auto w-64 h-64 shadow-inner group-hover:scale-105 duration-300">
             <div className="bg-white p-4 rounded-full shadow-md mb-4 group-hover:rotate-12 transition-transform">
                <Search className="w-10 h-10 text-p-teal" />
             </div>
             <span className="text-p-teal font-bold text-center px-8">Toca aquí para escanear</span>
          </div>
        ) : (
          <div className="relative mx-auto w-64 h-64 rounded-full overflow-hidden border-8 border-p-teal shadow-2xl ring-4 ring-p-teal/20">
            <img src={image} alt="Símbolo" className="w-full h-full object-cover" />
            {result.status === 'loading' && (
              <div className="absolute inset-0 bg-p-teal/80 flex items-center justify-center backdrop-blur-md">
                <div className="text-center text-white">
                    <Sparkles className="w-10 h-10 animate-spin mx-auto mb-2" />
                    <span className="font-bold text-lg">Leyendo historia...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {result.status === 'success' && result.culturalData && (
        <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden animate-slide-up transform hover:-translate-y-1 transition-transform duration-500">
          
          {/* Card Header */}
          <div className="bg-p-teal p-6 text-white relative overflow-hidden">
            <div className="absolute -right-6 -top-6 bg-white/20 w-24 h-24 rounded-full blur-xl"></div>
            <div className="flex items-center gap-3 relative z-10">
                <div className="bg-white/20 p-2 rounded-xl">
                     <Book className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black">{result.culturalData.symbolName}</h3>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            
            {/* Meaning Section */}
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Significado Ancestral</p>
              <p className="text-ink text-lg font-medium leading-relaxed">{result.culturalData.meaning}</p>
            </div>

            {/* Reflection Question Box */}
            <div className="bg-amber-50 p-5 rounded-2xl border-l-8 border-p-sun shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-p-sun text-ink rounded-full p-1 shrink-0">
                    <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-800 uppercase mb-1">Para reflexionar:</p>
                  <p className="text-amber-900 font-bold italic text-lg">"{result.culturalData.question}"</p>
                </div>
              </div>
            </div>

            {/* Accuracy Badge */}
            <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
                <Star className="w-5 h-5 text-p-sun fill-p-sun" />
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Fidelidad Geométrica</p>
                    <p className="text-sm font-bold text-ink">{result.culturalData.accuracy}</p>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};