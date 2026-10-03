import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Dumbbell,
  Utensils,
  User,
  WifiOff,
  Flame,
  Timer,
  X,
  MessageCircle,
  Plus,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Layout() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { gymHistory, activeTimer, setActiveTimer, toast, dismissToast } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer > 0) {
      interval = setInterval(() => {
        setActiveTimer(activeTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer, setActiveTimer]);

  // Calculate Streak
  const calculateStreak = () => {
    if (!gymHistory || gymHistory.length === 0) return 0;
    let streak = 1;
    for (let i = 0; i < gymHistory.length - 1; i++) {
      const d1 = new Date(gymHistory[i].date);
      const d2 = new Date(gymHistory[i+1].date);
      const diffTime = Math.abs(d1.getTime() - d2.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays === 1) streak++;
      else if (diffDays > 1) break;
    }
    return streak;
  };
  const streak = calculateStreak();

  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'short' });
  const dateString = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="w-full max-w-lg mx-auto min-h-screen bg-zinc-950 text-zinc-100 flex flex-col relative pb-24 shadow-2xl sm:border-x sm:border-zinc-800/80">
      {/* Offline Alert Strip */}
      {isOffline && (
        <div 
          role="alert" 
          aria-live="polite"
          className="bg-amber-500 text-zinc-950 text-xs font-semibold py-1.5 px-4 flex justify-center items-center gap-2 z-50 sticky top-0"
        >
          <WifiOff size={14} className="shrink-0" />
          <span>Offline mode active · Local storage will sync when connected</span>
        </div>
      )}

      {/* Floating Global Toast Notification */}
      {toast && (
        <div 
          role="status" 
          aria-live="polite"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 text-white rounded-xl p-3 shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle size={18} className="text-rose-400 shrink-0" />}
              {toast.type === 'info' && <Info size={18} className="text-sky-400 shrink-0" />}
              <span className="text-xs font-medium text-zinc-100 truncate">{toast.message}</span>
            </div>
            <button
              onClick={dismissToast}
              aria-label="Dismiss notification"
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
      
      {/* Executive Header Lockup */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/70 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white uppercase font-sans">
                APEX<span className="text-emerald-400">.</span>
              </span>
              <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400 font-semibold px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                FUEL & FIT
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-medium">
              {dayName} · {dateString}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Streak Indicator */}
          <div 
            title={`${streak} day workout streak`}
            className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-full"
          >
            <Flame size={14} className="text-amber-400 fill-amber-400/20" />
            <span className="text-xs font-bold font-mono text-zinc-200">{streak}</span>
          </div>

          {/* Quick Coach / AI Indicator */}
          <NavLink
            to="/coach"
            aria-label="Open Gym Bro AI Coach"
            className="relative min-w-[38px] min-h-[38px] rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-all press-scale"
          >
            <Sparkles size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </NavLink>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
        <Outlet />
      </main>

      {/* Floating Rest Timer Widget */}
      {activeTimer > 0 && (
        <aside 
          aria-label="Rest timer"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-zinc-900/95 backdrop-blur-md border border-sky-500/50 rounded-full px-4 py-2 flex items-center gap-3 shadow-2xl z-50 animate-in slide-in-from-bottom-4"
        >
          <Timer size={16} className="text-sky-400 animate-pulse shrink-0" />
          <span className="text-white font-mono font-bold text-sm tracking-wide">
            {Math.floor(activeTimer / 60)}:{(activeTimer % 60).toString().padStart(2, '0')}
          </span>
          <button
            onClick={() => setActiveTimer(activeTimer + 30)}
            aria-label="Add 30 seconds"
            className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-sky-300 transition-colors"
          >
            +30s
          </button>
          <button 
            onClick={() => setActiveTimer(0)} 
            aria-label="Stop timer"
            className="text-zinc-400 hover:text-white p-1"
          >
            <X size={15} />
          </button>
        </aside>
      )}

      {/* Bottom Navigation */}
      <nav 
        aria-label="Main Navigation"
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 px-2 py-1.5 flex justify-around items-center z-50 pb-safe"
      >
        <NavItem to="/" icon={<Home size={20} />} label="Home" />
        <NavItem to="/workout" icon={<Dumbbell size={20} />} label="Train" />
        <NavItem to="/nutrition" icon={<Utensils size={20} />} label="Fuel" />
        <NavItem to="/coach" icon={<MessageCircle size={20} />} label="Coach" badge="AI" />
        <NavItem to="/profile" icon={<User size={20} />} label="Stats" />
      </nav>
    </div>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}

function NavItem({ to, icon, label, badge }: NavItemProps) {
  return (
    <NavLink 
      to={to} 
      end={to === '/'}
      aria-label={label}
      className={({ isActive }) => 
        `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-all rounded-lg press-scale relative ${
          isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`p-1.5 rounded-xl transition-all relative ${
            isActive ? 'bg-zinc-800 text-white' : 'bg-transparent'
          }`}>
            {icon}
            {badge && (
              <span className="absolute -top-1 -right-1.5 text-[8px] font-mono font-bold px-1 py-0.2 rounded-full bg-emerald-500 text-zinc-950">
                {badge}
              </span>
            )}
          </div>
          <span className={`text-[10px] tracking-tight font-medium transition-colors ${
            isActive ? 'text-white font-bold' : 'text-zinc-400'
          }`}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

