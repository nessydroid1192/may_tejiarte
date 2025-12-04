import React, { useState, useRef } from 'react';
import { analyzeWeaveTechnique } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { Camera, Upload, AlertTriangle, CheckCircle2, Lightbulb, RefreshCw } from 'lucide-react';

export const TechnicalAssistant: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult>({ status: 'idle', message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setResult({ status: 'loading', message: 'El Maestro está observando...' });

    try {
      const data = await analyzeWeaveTechnique(file);
      setResult({
        status: 'success',
        message: '¡Análisis listo!',
        technicalData: data
      });
    } catch (error) {
      setResult({ status: 'error', message: 'Hubo un error. Inténtalo de nuevo.' });
    }
  };

  return (
    <div className="p-5 max-w-md mx-auto space-y-6">
      
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-2xl font-black text-p-primary">Lupa Técnica</h2>
        <p className="text-slate-500 font-medium">Sube una foto para recibir consejos</p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-3xl shadow-pedagogical border-2 border-slate-100 p-6 text-center relative overflow-hidden">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleImageUpload}
        />

        {!image ? (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-10 border-4 border-dashed border-p-primary/20 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-red-50 hover:border-p-primary/50 transition-all group"
          >
            <div className="bg-red-100 p-4 rounded-full group-hover:scale-110 transition-transform">
                <Camera className="w-10 h-10 text-p-primary" />
            </div>
            <span className="text-p-primary font-bold text-lg">Tomar foto del tejido</span>
          </button>
        ) : (
          <div className="relative rounded-2xl overflow-hidden shadow-inner border-4 border-white">
            <img src={image} alt="Tejido" className="w-full h-72 object-cover" />
            {result.status === 'loading' && (
              <div className="absolute inset-0 bg-p-primary/80 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
                <span className="font-bold text-lg animate-pulse">Analizando puntadas...</span>
              </div>
            )}
            <button 
              onClick={() => { setImage(null); setResult({status:'idle', message:''}); }}
              className="absolute top-4 right-4 bg-white text-p-primary p-3 rounded-full shadow-lg font-bold hover:bg-slate-100 transition"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {result.status === 'success' && result.technicalData && (
        <div className="space-y-5 animate-slide-up">
          
          {/* Traffic Light System Cards */}
          <div className="grid grid-cols-1 gap-4">
             {/* Tension Card */}
            <div className={`p-5 rounded-3xl border-b-4 shadow-sm ${
                result.technicalData.tension.toLowerCase().includes('buena') || result.technicalData.tension.toLowerCase().includes('correcta') 
                ? 'bg-green-50 border-green-200' 
                : 'bg-orange-50 border-orange-200'
            }`}>
                <div className="flex items-center gap-3 mb-2">
                    {result.technicalData.tension.toLowerCase().includes('buena') || result.technicalData.tension.toLowerCase().includes('correcta') 
                     ? <CheckCircle2 className="w-6 h-6 text-green-600" />
                     : <AlertTriangle className="w-6 h-6 text-orange-500" />
                    }
                    <h3 className="font-black text-lg text-ink">Tensión del Hilo</h3>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed ml-9">
                    {result.technicalData.tension}
                </p>
            </div>

            {/* Density Card */}
            <div className="bg-blue-50 p-5 rounded-3xl border-b-4 border-blue-200 shadow-sm">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-200 p-1 rounded-full">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    </div>
                    <h3 className="font-black text-lg text-ink">Densidad (Abrigo)</h3>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed ml-9">
                    {result.technicalData.density}
                </p>
            </div>
          </div>

          {/* Teacher's Suggestions */}
          <div className="bg-p-sun/20 rounded-3xl p-6 border-2 border-p-sun/50 relative mt-4">
             <div className="absolute -top-5 left-6 bg-p-sun text-ink font-bold px-4 py-1 rounded-full shadow-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Consejos del Maestro
             </div>
            <ul className="space-y-4 mt-2">
              {result.technicalData.suggestions.map((sug, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="bg-white text-p-highlight font-black w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-0.5">{i + 1}</span>
                  <span className="text-ink font-medium">{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};