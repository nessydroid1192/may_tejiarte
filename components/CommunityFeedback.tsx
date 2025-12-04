import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { Users, Heart, Sun, ThumbsUp } from 'lucide-react';

// Updated data colors via styles, but logic remains
const data = [
  { subject: 'Calidez', A: 90, fullMark: 100 },
  { subject: 'Belleza', A: 85, fullMark: 100 },
  { subject: 'Peso', A: 70, fullMark: 100 },
  { subject: 'Color', A: 95, fullMark: 100 },
  { subject: 'Acabados', A: 80, fullMark: 100 },
];

export const CommunityFeedback: React.FC = () => {
  return (
    <div className="p-5 max-w-md mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="bg-p-teal p-2 rounded-xl text-white shadow-sm">
             <Users className="w-6 h-6" />
        </div>
        <div>
            <h2 className="text-2xl font-black text-p-teal">La Voz del Ayllu</h2>
            <p className="text-slate-500 font-medium text-sm">Lo que dice tu comunidad</p>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-white p-6 rounded-3xl shadow-card border border-slate-100">
        <h3 className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Evaluación del Poncho</h3>
        <div className="h-72 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
              <PolarGrid stroke="#e2e8f0" strokeDasharray="4 4" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#457B9D', fontSize: 12, fontWeight: 'bold' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Mi Tejido"
                dataKey="A"
                stroke="#E63946"
                strokeWidth={3}
                fill="#E63946"
                fillOpacity={0.2}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                itemStyle={{ color: '#E63946' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-2">
            <span className="inline-block bg-p-primary/10 text-p-primary text-xs font-bold px-3 py-1 rounded-full">Puntaje Total: 84/100</span>
        </div>
      </div>

      {/* Highlights */}
      <div className="space-y-4">
        <h3 className="font-black text-ink text-lg px-2">Elogios Destacados</h3>
        
        <div className="bg-white p-5 rounded-2xl border-l-8 border-p-sun shadow-sm flex gap-4 items-start">
          <div className="bg-orange-100 p-2 rounded-full shrink-0">
             <Sun className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-xs font-black text-orange-400 uppercase mb-1">Calidez Sentida</p>
            <p className="text-ink font-medium">"El grosor es perfecto para las heladas de junio. Se siente el cariño en el hilado."</p>
             <div className="flex gap-1 mt-2">
                <ThumbsUp className="w-3 h-3 text-slate-300" />
                <span className="text-xs text-slate-400 font-bold">12 votos</span>
             </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border-l-8 border-p-primary shadow-sm flex gap-4 items-start">
           <div className="bg-red-100 p-2 rounded-full shrink-0">
             <Heart className="w-6 h-6 text-p-primary" />
          </div>
          <div>
            <p className="text-xs font-black text-p-primary uppercase mb-1">Belleza Simbólica</p>
            <p className="text-ink font-medium">"El rojo cochinilla resalta muy bien los ojos de llama. Muy fiel a la tradición."</p>
            <div className="flex gap-1 mt-2">
                <ThumbsUp className="w-3 h-3 text-slate-300" />
                <span className="text-xs text-slate-400 font-bold">8 votos</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};