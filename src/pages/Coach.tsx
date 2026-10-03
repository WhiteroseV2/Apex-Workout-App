import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  User as UserIcon,
  Bot,
  Loader2,
  Trash2,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { chatWithGymBro } from '../lib/gemini';
import { useAppContext } from '../context/AppContext';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp?: string;
}

const QUICK_PROMPTS = [
  "Did I hit my protein goal today?",
  "What meal should I eat next based on my remaining macros?",
  "How is my recovery status looking?",
  "Can I swap Incline DB Press for Barbell?"
];

export default function Coach() {
  const { userProfile, customPlan, nutritionHistory, gymHistory, coachMessages, setCoachMessages, showToast } = useAppContext();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [coachMessages, isTyping]);

  const buildUserContext = () => {
    const today = new Date();
    const dateFormatted = today.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    const timeString = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Find today's nutrition log matching either standard en-GB or ISO
    const todayLog = nutritionHistory.find(
      log => log.date === dateFormatted || log.date === today.toISOString().split('T')[0]
    );
    
    let macrosStr = 'No food logged today yet.';
    if (todayLog && todayLog.foods.length > 0) {
      const cals = todayLog.foods.reduce((acc, f) => acc + f.calories, 0);
      const pro = todayLog.foods.reduce((acc, f) => acc + f.protein, 0);
      const carbs = todayLog.foods.reduce((acc, f) => acc + f.carbs, 0);
      const fats = todayLog.foods.reduce((acc, f) => acc + f.fats, 0);
      macrosStr = `Calories consumed: ${cals} kcal (Target: ${userProfile?.targetCalories || 2450} kcal), Protein: ${pro}g (Target: ${userProfile?.targetProtein || 175}g), Carbs: ${carbs}g, Fats: ${fats}g, Water: ${((todayLog.water || 0) / 1000).toFixed(2)}L.`;
    }
    
    const recentWorkouts = gymHistory
      .slice(0, 3)
      .map(w => `${w.date}: ${w.name} (${w.exercises.length} movements)`)
      .join('; ');

    return `
      Current Local Date & Time: ${dateFormatted} at ${timeString}
      User Profile: ${userProfile?.age || 26} yrs old, Weight: ${userProfile?.weight || 78.5}kg, Height: ${userProfile?.height || 182}cm, Goal: ${userProfile?.goal || 'cut'}, Activity Level: ${userProfile?.activityLevel || 'active'}
      Daily Targets: ${userProfile?.targetCalories || 2450} kcal, ${userProfile?.targetProtein || 175}g Protein, ${userProfile?.targetCarbs || 230}g Carbs, ${userProfile?.targetFats || 65}g Fats
      Today's Live Nutrition: ${macrosStr}
      Recent Training Sessions: ${recentWorkouts || 'None recorded yet'}
      Split System: ${userProfile?.preferredSplit || 'Push / Pull / Legs'}
    `;
  };

  const handleSendText = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const currentMessages = [...coachMessages, userMsg];
    setCoachMessages(currentMessages);
    setInput('');
    setIsTyping(true);

    try {
      const history = coachMessages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));
      
      const userContext = buildUserContext();
      const responseText = await chatWithGymBro(history, userMsg.text, userContext);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "Let's keep crushing it, bro! What else is on your mind?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setCoachMessages([...currentMessages, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Dropped my protein shaker bro! Give me a quick second and shoot that message again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setCoachMessages([...currentMessages, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendText(input);
  };

  const clearChat = () => {
    const initial: Message[] = [
      {
        id: 'init-1',
        role: 'model',
        text: "What's up bro! I'm your Gym Bro AI co-pilot. I have live access to your daily macros, workout logs, and recovery metrics. Ask me anything about your training, food, or form!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setCoachMessages(initial);
    showToast('Chat history cleared', 'info');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-145px)] animate-in fade-in duration-300">
      {/* Coach Header & Context Pill */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-extrabold text-white tracking-tight uppercase font-sans">
              Gym Bro Co-Pilot
            </h1>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Context Synced
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
            Connected to your workout logs, active plan & today's macros
          </p>
        </div>

        <button
          onClick={clearChat}
          aria-label="Clear chat"
          className="text-zinc-500 hover:text-rose-400 p-2 rounded-lg hover:bg-zinc-900 transition-colors"
          title="Clear Chat History"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Chat Messages Frame */}
      <div className="flex-1 bg-zinc-900/90 rounded-2xl border border-zinc-800/80 overflow-hidden flex flex-col shadow-inner">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {coachMessages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[88%] gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar Icon */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold ${
                      isUser
                        ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                        : 'bg-emerald-500 text-zinc-950 font-black'
                    }`}
                  >
                    {isUser ? <UserIcon size={14} /> : <Bot size={15} />}
                  </div>

                  {/* Message Content Bubble */}
                  <div className="flex flex-col">
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-white text-zinc-950 font-medium rounded-tr-sm shadow-sm'
                          : 'bg-zinc-950/80 text-zinc-200 border border-zinc-800/80 rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.timestamp && (
                      <span className={`text-[9px] font-mono text-zinc-500 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing State */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%] gap-2.5 flex-row items-center">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 text-zinc-950 flex items-center justify-center shrink-0 font-bold">
                  <Bot size={15} />
                </div>
                <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-zinc-400 rounded-tl-sm flex items-center gap-2">
                  <Loader2 size={13} className="animate-spin text-emerald-400" />
                  <span className="text-[11px] font-mono">Gym Bro is analyzing your data...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Starter Chips */}
        {coachMessages.length <= 4 && !isTyping && (
          <div className="px-3 py-2 bg-zinc-950/50 border-t border-zinc-800/60 overflow-x-auto flex gap-1.5 scrollbar-none">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendText(prompt)}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[11px] whitespace-nowrap transition-all press-scale shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your workout, macros, calories..."
              className="flex-1 bg-zinc-900 text-white text-xs px-3.5 py-3 rounded-xl border border-zinc-800 focus:outline-none focus:border-zinc-600 transition-colors font-sans placeholder-zinc-500"
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              aria-label="Send message"
              className="w-11 h-11 bg-white text-zinc-950 rounded-xl flex items-center justify-center hover:bg-zinc-200 transition-all disabled:opacity-40 shrink-0 press-scale font-bold shadow-sm"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
