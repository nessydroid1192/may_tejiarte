import React, { useState } from 'react';
import { analyzeJournalEntry } from '../services/geminiService';
import { Mic, Square, Send, BookOpen, Sparkles } from 'lucide-react';
import { JournalEntry } from '../types';

export const Journal: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setInputText("Hoy tuve problemas con el borde de la bufanda. Me sentí frustrada porque el color no quedaba parejo con el teñido de molle.");
    } else {
      setIsRecording(true);
      setInputText('');
    }
  };

  const handleSaveEntry = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    try {
      const analysis = await analyzeJournalEntry(inputText);
      
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
        type: 'text',
        content: inputText,
        emotions: analysis.emotions || [],
        tags: analysis.tags || [],
        aiReflection: analysis.reflection || "Sigue practicando, cada error es una lección.",
      };

      setEntries([newEntry, ...entries]);
      setInputText('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-md mx-auto h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-p-highlight p-2 rounded-xl text-white">
            <BookOpen className="w-6 h-6" />
        </div>
        <div>
            <h2 className="text-2xl font-black text-ink">Mi Diario</h2>
            <p className="text-slate-500 text-sm font-medium">Reflexiona y crece</p>
        </div>
      </div>

      {/* Input Area - Look like a Chat Box */}
      <div className="bg-white p-2 rounded-3xl shadow-card border border-p-accent/30 mb-8">
        <textarea
          className="w-full p-4 bg-transparent text-lg text-ink placeholder-slate-300 focus:outline-none resize-none font-medium"
          rows={3}
          placeholder="¿Qué aprendiste hoy?"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        
        <div className="flex justify-between items-center px-2 pb-2 mt-2">
          <button 
            onClick={toggleRecording}
            className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
              isRecording ? 'bg-red-500 text-white animate-pulse shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-6 h-6" />}
          </button>

          <button 
            onClick={handleSaveEntry}
            disabled={loading || !inputText}
            className="bg-p-highlight text-white px-6 py-3 rounded-2xl font-bold shadow-pedagogical hover:bg-orange-400 disabled:opacity-50 disabled:shadow-none flex items-center gap-2 transition-all active:translate-y-1 active:shadow-none"
          >
            {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <span>Guardar</span>}
            {!loading && <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Entries Feed */}
      <div className="space-y-6 pb-20">
        {entries.map(entry => (
          <div key={entry.id} className="animate-fade-in">
            <div className="flex justify-center mb-2">
                <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{entry.date}</span>
            </div>
            
            {/* User Entry Bubble */}
            <div className="bg-white p-5 rounded-3xl rounded-tl-none shadow-sm border border-slate-100 mb-2 ml-4">
                <p className="text-lg text-ink leading-relaxed">{entry.content}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                    {entry.emotions.map(emo => (
                    <span key={emo} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200">#{emo}</span>
                    ))}
                </div>
            </div>

            {/* AI Reflection Bubble */}
            <div className="bg-p-teal/10 p-5 rounded-3xl rounded-tr-none border border-p-teal/20 mr-4 relative">
              <div className="absolute -top-3 -right-2 bg-p-teal text-white p-1.5 rounded-full border-4 border-paper">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-p-teal uppercase mb-1">Consejo Sabio:</p>
              <p className="text-ink font-medium italic">"{entry.aiReflection}"</p>
            </div>
          </div>
        ))}
        
        {entries.length === 0 && (
          <div className="text-center py-10 opacity-60">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium text-lg">Tu diario está esperando<br/>tu primera historia.</p>
          </div>
        )}
      </div>
    </div>
  );
};