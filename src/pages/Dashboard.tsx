import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import {
  Activity,
  Flame,
  Target,
  ChevronRight,
  Trophy,
  Zap,
  Play,
  Dumbbell,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { customPlan, gymHistory, nutritionHistory, userProfile } = useAppContext();

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const todayDayId = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
  
  const todaysPlan = customPlan[todayDayId] || customPlan['mon'];
  const todayNutrition = nutritionHistory.find(h => h.date === today) || { foods: [], water: 0 };
  
  const totalCals = todayNutrition.foods?.reduce((sum, f) => sum + f.calories, 0) || 0;
  const totalProtein = todayNutrition.foods?.reduce((sum, f) => sum + f.protein, 0) || 0;
  const totalCarbs = todayNutrition.foods?.reduce((sum, f) => sum + f.carbs, 0) || 0;
  const totalFats = todayNutrition.foods?.reduce((sum, f) => sum + f.fats, 0) || 0;

  const targetCals = userProfile?.targetCalories || (todaysPlan.type === 'rest' ? 2400 : 2800);
  const targetProtein = userProfile?.targetProtein || 150;
  const targetCarbs = userProfile?.targetCarbs || 250;
  const targetFats = userProfile?.targetFats || 75;

  // Calculate Streak
  const calculateStreak = () => {
    if (gymHistory.length === 0) return 0;
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

  // Calculate Weekly Completion (last 7 days)
  const last7DaysWorkouts = gymHistory.filter(session => {
    const sessionDate = new Date(session.date);
    const todayDate = new Date();
    const diffTime = Math.abs(todayDate.getTime() - sessionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;
  
  const targetWorkoutsPerWeek = parseInt(userProfile?.daysPerWeek || '5', 10);
  const weeklyCompletion = Math.min(Math.round((last7DaysWorkouts / targetWorkoutsPerWeek) * 100), 100);

  // Muscle Fatigue Logic
  const getMuscleFatigue = () => {
    const fatigue = { chest: 0, back: 0, legs: 0, arms: 0, shoulders: 0 };
    const now = new Date().getTime();
    
    gymHistory.forEach(session => {
      const sessionTime = new Date(session.date).getTime();
      const hoursSince = (now - sessionTime) / (1000 * 60 * 60);
      
      if (hoursSince < 48) {
        const multiplier = Math.max(0, 1 - (hoursSince / 48));
        session.exercises.forEach(ex => {
          const name = ex.name.toLowerCase();
          if (name.includes('bench') || name.includes('chest') || name.includes('fly') || name.includes('push-up')) fatigue.chest += 35 * multiplier;
          if (name.includes('row') || name.includes('pull') || name.includes('lat')) fatigue.back += 35 * multiplier;
          if (name.includes('squat') || name.includes('leg') || name.includes('deadlift') || name.includes('calf')) fatigue.legs += 40 * multiplier;
          if (name.includes('curl') || name.includes('tricep') || name.includes('extension')) fatigue.arms += 25 * multiplier;
          if (name.includes('shoulder') || name.includes('raise') || name.includes('overhead')) fatigue.shoulders += 30 * multiplier;
        });
      }
    });
    
    return {
      chest: Math.min(100, fatigue.chest),
      back: Math.min(100, fatigue.back),
      legs: Math.min(100, fatigue.legs),
      arms: Math.min(100, fatigue.arms),
      shoulders: Math.min(100, fatigue.shoulders),
    };
  };

  const fatigue = getMuscleFatigue();
  const averageFatigue = Math.round(
    (fatigue.chest + fatigue.back + fatigue.legs + fatigue.arms + fatigue.shoulders) / 5
  );
  const readinessScore = Math.max(10, 100 - averageFatigue);

  const getStatusLabel = (level: number) => {
    if (level < 25) return { label: 'Optimal', color: 'text-emerald-400', bar: 'bg-emerald-400' };
    if (level < 60) return { label: 'Recovering', color: 'text-amber-400', bar: 'bg-amber-400' };
    return { label: 'Fatigued', color: 'text-rose-400', bar: 'bg-rose-400' };
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Editorial Athlete Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800/80 p-5 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs uppercase tracking-wider font-mono text-emerald-400 font-semibold mb-1">
              Readiness & Energy
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {readinessScore >= 80 ? 'Peak Conditioning' : readinessScore >= 50 ? 'Steady Capacity' : 'Rest Advised'}
            </h1>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              {readinessScore}%
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Score</span>
          </div>
        </div>

        {/* Readiness Bar */}
        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
            style={{ width: `${readinessScore}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" /> System CNS primed
          </span>
          <span className="font-mono text-zinc-300">Target: {todaysPlan?.title || 'Training Day'}</span>
        </div>
      </section>

      {/* Primary KPI Grid */}
      <section className="grid grid-cols-2 gap-3" aria-label="Key Performance Indicators">
        {/* Streak & Consistency */}
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-mono tracking-wider text-zinc-400">Consistency</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-white">
              {streak} <span className="text-xs font-normal text-zinc-400">days</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
              <span>{weeklyCompletion}% target met</span>
            </div>
          </div>
        </div>

        {/* Weekly Adherence */}
        <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase font-mono tracking-wider text-zinc-400">Weekly Goal</span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Trophy size={16} />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-white">
              {last7DaysWorkouts} <span className="text-xs font-normal text-zinc-400">/ {targetWorkoutsPerWeek} sess</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 font-medium">
              On track this cycle
            </div>
          </div>
        </div>
      </section>

      {/* Today's Workout Focus */}
      <section className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            <Dumbbell size={14} className="text-sky-400" />
            <span>Today's Protocol</span>
          </div>
          <Link
            to="/workout"
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-0.5 transition-colors"
          >
            Full Split <ChevronRight size={14} />
          </Link>
        </div>

        <div className="mb-4">
          <div className="text-lg font-bold text-white mb-1 tracking-tight flex items-center gap-2">
            <span>{todaysPlan.title}</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold">
              {todaysPlan.type}
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
            {todaysPlan.focus}
          </p>
        </div>

        <Link
          to="/workout"
          className="w-full flex items-center justify-center gap-2 bg-white text-zinc-950 min-h-[46px] rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all press-scale shadow-sm"
        >
          <Play size={16} className="fill-zinc-950" /> Start Session Now
        </Link>
      </section>

      {/* Live Nutrition & Macro Fuel Breakdown */}
      <section className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Fuel & Nutrition</h2>
          </div>
          <Link
            to="/nutrition"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
          >
            Log Fuel <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Primary Macro Bars */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-xl p-3">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">Calories</span>
              <span className="text-xs font-mono font-bold text-white">{totalCals} <span className="text-[10px] font-normal text-zinc-500">/ {targetCals}</span></span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalCals / targetCals) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800/60 rounded-xl p-3">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">Protein</span>
              <span className="text-xs font-mono font-bold text-sky-400">{totalProtein}g <span className="text-[10px] font-normal text-zinc-500">/ {targetProtein}g</span></span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-sky-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalProtein / targetProtein) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Secondary Macro Splits */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/60 text-center">
          <div>
            <div className="text-[10px] font-mono uppercase text-zinc-400">Carbs</div>
            <div className="text-xs font-mono font-bold text-zinc-200 mt-0.5">{totalCarbs}g / {targetCarbs}g</div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-zinc-400">Fats</div>
            <div className="text-xs font-mono font-bold text-zinc-200 mt-0.5">{totalFats}g / {targetFats}g</div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-zinc-400">Water</div>
            <div className="text-xs font-mono font-bold text-sky-400 mt-0.5">{((todayNutrition.water || 0) / 1000).toFixed(1)}L / 3.0L</div>
          </div>
        </div>
      </section>

      {/* Muscle Recovery Heatmap */}
      <section className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Muscle Recovery Status</h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">Estimated fatigue based on last 48-hour training stimulus</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {[
            { label: 'Chest', val: fatigue.chest },
            { label: 'Back', val: fatigue.back },
            { label: 'Legs', val: fatigue.legs },
            { label: 'Arms', val: fatigue.arms },
            { label: 'Delts', val: fatigue.shoulders }
          ].map(m => {
            const status = getStatusLabel(m.val);
            return (
              <div key={m.label} className="flex flex-col items-center">
                <div className="w-full h-16 rounded-xl border border-zinc-800 bg-zinc-950/80 p-1 relative overflow-hidden flex flex-col justify-end">
                  <div
                    className={`w-full rounded-lg transition-all duration-700 ${status.bar} opacity-75`}
                    style={{ height: `${Math.max(8, m.val)}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-[11px] font-mono font-bold text-white drop-shadow">
                    {Math.round(m.val)}%
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase text-zinc-300 font-semibold mt-1.5">{m.label}</span>
                <span className={`text-[9px] font-medium ${status.color}`}>{status.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center items-center gap-4 mt-4 pt-3 border-t border-zinc-800/60 text-[10px] font-mono text-zinc-400">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Optimal (&lt;25%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Recovering (25-60%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400" /> Fatigued (&gt;60%)</span>
        </div>
      </section>

      {/* Recent Training History */}
      <section className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Recent Activity</h2>
          <Link to="/workout" className="text-xs text-zinc-400 hover:text-white font-medium flex items-center gap-1">
            History <ChevronRight size={14} />
          </Link>
        </div>

        <div className="space-y-2.5">
          {gymHistory.slice(0, 3).map(session => (
            <div
              key={session.id}
              className="bg-zinc-950/70 border border-zinc-800/70 rounded-xl p-3 flex justify-between items-center hover:border-zinc-700 transition-colors"
            >
              <div>
                <div className="text-sm font-bold text-white">{session.name}</div>
                <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">{session.date}</div>
              </div>
              <div className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md">
                {session.exercises.length} Exercises Completed
              </div>
            </div>
          ))}
          {gymHistory.length === 0 && (
            <div className="text-center py-6 text-zinc-500 text-xs">
              No workouts logged yet. Start your first session!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

