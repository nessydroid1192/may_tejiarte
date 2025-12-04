import React, { useState } from 'react';
import { AppView } from './types';
import { TechnicalAssistant } from './components/TechnicalAssistant';
import { Journal } from './components/Journal';
import { CulturalValidator } from './components/CulturalValidator';
import { CommunityFeedback } from './components/CommunityFeedback';
import { Library } from './components/Library';
import { Home, Camera, BookOpen, Users, Sparkles, Menu, ChevronRight, Library as LibraryIcon } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [menuOpen, setMenuOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case AppView.ASSISTANT:
        return <TechnicalAssistant />;
      case AppView.JOURNAL:
        return <Journal />;
      case AppView.CULTURE:
        return <CulturalValidator />;
      case AppView.COMMUNITY:
        return <CommunityFeedback />;
      case AppView.LIBRARY:
        return <Library />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans">
      {/* Pedagogical Header */}
      <header className="bg-gradient-to-r from-p-secondary to-p-teal text-white p-4 shadow-lg sticky top-0 z-20 rounded-b-3xl">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3" onClick={() => setCurrentView(AppView.DASHBOARD)}>
            <div className="w-10 h-10 bg-white text-p-secondary rounded-full flex items-center justify-center border-2 border-p-sun shadow-md">
              <Sparkles className="w-6 h-6 fill-p-sun text-p-sun" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">TejAI</h1>
              <p className="text-xs text-white/90 font-medium">Tu Maestro Digital</p>
            </div>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-28 overflow-y-auto">
        {renderView()}
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-4 left-2 right-2 bg-white border border-p-accent/30 rounded-2xl py-2 px-1 shadow-2xl z-20 flex justify-between items-center">
          <NavButton 
            active={currentView === AppView.DASHBOARD} 
            onClick={() => setCurrentView(AppView.DASHBOARD)} 
            icon={<Home className="w-6 h-6" />} 
            label="Inicio"
            color="text-p-secondary"
          />
          <NavButton 
            active={currentView === AppView.ASSISTANT} 
            onClick={() => setCurrentView(AppView.ASSISTANT)} 
            icon={<Camera className="w-6 h-6" />} 
            label="Técnica"
            color="text-p-primary" 
          />
          <NavButton 
            active={currentView === AppView.LIBRARY} 
            onClick={() => setCurrentView(AppView.LIBRARY)} 
            icon={<LibraryIcon className="w-6 h-6" />} 
            label="Biblio" 
            color="text-p-secondary"
          />
          <NavButton 
            active={currentView === AppView.JOURNAL} 
            onClick={() => setCurrentView(AppView.JOURNAL)} 
            icon={<BookOpen className="w-6 h-6" />} 
            label="Diario" 
            color="text-p-highlight"
          />
          <NavButton 
            active={currentView === AppView.COMMUNITY} 
            onClick={() => setCurrentView(AppView.COMMUNITY)} 
            icon={<Users className="w-6 h-6" />} 
            label="Grupo" 
            color="text-p-teal"
          />
      </nav>
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label, color }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all duration-300 w-1/5 ${
      active ? 'bg-paper -translate-y-2 shadow-md scale-110' : 'hover:bg-slate-50'
    }`}
  >
    <div className={`${active ? color : 'text-slate-400'} transition-colors`}>
      {icon}
    </div>
    {active && <span className={`text-[9px] font-bold ${color}`}>{label}</span>}
  </button>
);

const Dashboard = ({ onViewChange }: { onViewChange: (view: AppView) => void }) => (
  <div className="p-5 max-w-md mx-auto space-y-8 animate-fade-in">
    
    {/* Welcome Card */}
    <div className="bg-p-secondary rounded-3xl p-6 text-white shadow-card relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
      <div className="relative z-10">
        <h2 className="text-3xl font-black mb-2">¡Hola, Maestro! 👋</h2>
        <p className="text-white/90 mb-6 font-medium">Hoy es un gran día para tejer historias.</p>
        
        <div className="flex gap-3">
          <div className="bg-white text-p-secondary rounded-2xl p-3 flex-1 text-center shadow-sm">
            <span className="block text-3xl font-black">12</span>
            <span className="text-xs font-bold uppercase tracking-wider">Días</span>
          </div>
          <div className="bg-p-sun text-ink rounded-2xl p-3 flex-1 text-center shadow-sm">
            <span className="block text-3xl font-black">5</span>
            <span className="text-xs font-bold uppercase tracking-wider">Símbolos</span>
          </div>
        </div>
      </div>
    </div>

    {/* Library Highlight Card (New) */}
    <div 
        onClick={() => onViewChange(AppView.LIBRARY)}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-card cursor-pointer transform hover:scale-[1.02] transition-transform"
    >
        <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
                <LibraryIcon className="w-8 h-8 text-white" />
            </div>
            <div>
                <h3 className="text-xl font-black">Mi Biblioteca</h3>
                <p className="text-white/80 text-sm font-medium">Guarda tus obras con voz y foto</p>
            </div>
            <ChevronRight className="w-6 h-6 ml-auto text-white/50" />
        </div>
    </div>

    {/* Big Action Cards */}
    <div>
      <h3 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
        <span className="w-2 h-8 bg-p-sun rounded-full"></span>
        Herramientas de Aprendizaje
      </h3>
      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={() => onViewChange(AppView.ASSISTANT)}
          className="bg-white p-4 rounded-3xl shadow-pedagogical border-2 border-p-primary/10 hover:border-p-primary/50 transition-all flex items-center gap-4 group"
        >
          <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Camera className="w-8 h-8 text-p-primary" />
          </div>
          <div className="text-left flex-1">
            <h3 className="font-black text-lg text-ink">Revisar mi Técnica</h3>
            <p className="text-sm text-slate-500 font-medium">Evaluar tensión y nudos</p>
          </div>
          <div className="bg-slate-100 p-2 rounded-full">
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </button>

        <button 
          onClick={() => onViewChange(AppView.CULTURE)}
          className="bg-white p-4 rounded-3xl shadow-pedagogical border-2 border-p-teal/10 hover:border-p-teal/50 transition-all flex items-center gap-4 group"
        >
          <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-8 h-8 text-p-teal" />
          </div>
          <div className="text-left flex-1">
            <h3 className="font-black text-lg text-ink">Consultar Símbolos</h3>
            <p className="text-sm text-slate-500 font-medium">Descubre significados ancestrales</p>
          </div>
          <div className="bg-slate-100 p-2 rounded-full">
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </button>
      </div>
    </div>
  </div>
);