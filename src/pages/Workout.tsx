import React, { useState, useEffect } from 'react';
import { useAppContext, LoggedSession, LoggedExercise, LoggedSet } from '../context/AppContext';
import { WorkoutPlan, DayPlan } from '../data';
import {
  Check,
  Plus,
  Edit2,
  Save,
  Timer,
  History,
  Calculator,
  X,
  Play,
  Flame,
  RefreshCw,
  Trash2,
  Search,
  ChevronRight,
  Zap,
  Moon,
  Info,
  Dumbbell,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const COMMON_EXERCISES = [
  "Barbell Bench Press", "Dumbbell Bench Press", "Incline Dumbbell Press", "Push-ups", "Cable Crossovers",
  "Pull-ups", "Lat Pulldown", "Barbell Row", "Seated Cable Row", "Face Pulls",
  "Barbell Squat", "Leg Press", "Romanian Deadlift", "Leg Extension", "Leg Curl", "Calf Raises",
  "Overhead Press", "Lateral Raises", "Front Raises",
  "Barbell Curl", "Dumbbell Curl", "Hammer Curl",
  "Tricep Pushdown", "Overhead Tricep Extension", "Skull Crushers",
  "Crunches", "Plank", "Leg Raises"
].sort();

const TYPE_META: Record<string, { color: string; bg: string; border: string; label: string; textClass: string }> = {
  push:  { color: '#38bdf8', bg: 'bg-sky-500/10', border: 'border-sky-500/30', label: 'Push', textClass: 'text-sky-400' },
  pull:  { color: '#818cf8', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', label: 'Pull', textClass: 'text-indigo-400' },
  legs:  { color: '#fb923c', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Legs', textClass: 'text-amber-400' },
  rest:  { color: '#4ade80', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Rest', textClass: 'text-emerald-400' },
};

export default function Workout() {
  const { customPlan, setCustomPlan, gymHistory, setGymHistory, settings, showToast } = useAppContext();
  const [selectedDay, setSelectedDay] = useState<string>('mon');
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [showPlateCalc, setShowPlateCalc] = useState(false);

  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const shortLabels: Record<string, string> = { mon: 'M', tue: 'T', wed: 'W', thu: 'Th', fri: 'F', sat: 'Sa', sun: 'Su' };

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setIsEditingPlan(false);
    setIsTracking(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Day Selector Navigation */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5 flex-1 overflow-x-auto pb-1 scrollbar-none">
          {days.map((day) => {
            const plan = customPlan[day];
            const type = plan?.type || 'rest';
            const meta = TYPE_META[type] || TYPE_META.rest;
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => handleDaySelect(day)}
                aria-label={`Select ${day}`}
                className={`flex flex-col items-center justify-center shrink-0 w-11 h-14 rounded-xl border transition-all duration-200 press-scale ${
                  isSelected
                    ? 'border-white bg-zinc-800 text-white shadow-md'
                    : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <span className="text-xs font-mono font-bold mb-1">
                  {shortLabels[day]}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: meta.color, opacity: isSelected ? 1 : 0.4 }}
                />
              </button>
            );
          })}
        </div>

        {/* Plate Calculator Button */}
        <button
          onClick={() => setShowPlateCalc(true)}
          className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white min-h-[56px] min-w-[46px] flex items-center justify-center shrink-0 transition-colors press-scale"
          title="Barbell Plate Calculator"
          aria-label="Open plate calculator"
        >
          <Calculator size={18} />
        </button>
      </div>

      {/* Main Views */}
      {!isEditingPlan && !isTracking && (
        <PlanOverview
          plan={customPlan[selectedDay]}
          onStart={() => setIsTracking(true)}
          onEdit={() => setIsEditingPlan(true)}
        />
      )}

      {!isEditingPlan && isTracking && (
        <div className="space-y-4">
          <TrackerView
            plan={customPlan}
            selectedDay={selectedDay}
            gymHistory={gymHistory}
            defaultRestTime={settings.restTimerDefault}
            onSave={(session) => {
              setGymHistory([session, ...gymHistory]);
              setIsTracking(false);
              showToast('Workout session completed and saved to history!');
            }}
          />
          <div className="text-center pt-2">
            <button
              onClick={() => setIsTracking(false)}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300 min-h-[44px] transition-colors"
            >
              Cancel Workout
            </button>
          </div>
        </div>
      )}

      {isEditingPlan && (
        <DayEditor
          plan={customPlan[selectedDay]}
          onSave={(updatedDay) => {
            setCustomPlan({ ...customPlan, [selectedDay]: updatedDay });
            setIsEditingPlan(false);
            showToast('Workout plan updated!');
          }}
          onCancel={() => setIsEditingPlan(false)}
        />
      )}

      {showPlateCalc && <PlateCalculator onClose={() => setShowPlateCalc(false)} />}
    </div>
  );
}

// ─── Plan Overview ────────────────────────────────────────────────────────────

function PlanOverview({ plan, onStart, onEdit }: { plan: DayPlan; onStart: () => void; onEdit: () => void }) {
  if (!plan || plan.type === 'rest') {
    return (
      <div className="space-y-4 animate-in fade-in">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <Moon size={22} />
          </div>
          <div className="text-lg font-bold text-white mb-1">Rest & Muscle Hypertrophy Day</div>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto mb-5 leading-relaxed">
            {plan?.focus || 'Systemic nervous recovery and protein synthesis happen during active downtime.'}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={onEdit}
              className="text-xs font-mono font-bold text-zinc-300 hover:text-white px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 transition-colors press-scale"
            >
              Edit Day Split
            </button>
          </div>
        </div>

        {plan?.tips?.[0] && (
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex gap-3 items-start">
            <Info size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-400 leading-relaxed">{plan.tips[0]}</div>
          </div>
        )}
      </div>
    );
  }

  const meta = TYPE_META[plan.type] || TYPE_META.rest;
  const totalExercises = plan.sections.reduce((sum, s) => sum + s.exercises.length, 0);

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Session Hero Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">
                {plan.dayLabel} Protocol
              </span>
              <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${meta.bg} ${meta.border} ${meta.textClass}`}>
                {meta.label}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">{plan.title}</h1>
          </div>
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Dumbbell size={18} />
          </div>
        </div>

        <p className="text-xs text-zinc-400 mb-5 leading-relaxed">{plan.focus}</p>

        {/* Action Button */}
        <button
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2 bg-white text-zinc-950 min-h-[48px] rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all press-scale shadow-sm"
        >
          <Play size={16} className="fill-zinc-950" /> Start Workout ({totalExercises} exercises)
        </button>
      </div>

      {/* Exercises Breakdown */}
      <div className="space-y-3">
        {plan.sections.map((section) => (
          <div key={section.id} className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/40">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                {section.label}
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                {section.exercises.length} movements
              </span>
            </div>

            <div className="divide-y divide-zinc-800/60">
              {section.exercises.map((ex, i) => (
                <div key={ex.id} className="p-3.5 flex items-start gap-3 hover:bg-zinc-800/30 transition-colors">
                  <span className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white leading-snug">{ex.name}</div>
                    <div className="text-[11px] font-mono text-zinc-400 mt-1 flex items-center gap-2">
                      <span className="text-sky-400 font-semibold">{ex.sets}</span>
                      {ex.rpe && <span>· {ex.rpe}</span>}
                    </div>
                    {ex.note && <div className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{ex.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-1">
        <button
          onClick={onEdit}
          className="text-xs font-mono text-zinc-400 hover:text-white px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors"
        >
          Edit Routine
        </button>
      </div>
    </div>
  );
}

// ─── Plate Calculator Modal ───────────────────────────────────────────────────

function PlateCalculator({ onClose }: { onClose: () => void }) {
  const [targetWeight, setTargetWeight] = useState('100');
  const [barWeight, setBarWeight] = useState('20');

  const calculatePlates = () => {
    const target = parseFloat(targetWeight);
    const bar = parseFloat(barWeight);
    if (isNaN(target) || isNaN(bar) || target <= bar) return [];
    let remaining = (target - bar) / 2;
    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
    const result: { weight: number; count: number }[] = [];
    for (const plate of availablePlates) {
      if (remaining >= plate) {
        const count = Math.floor(remaining / plate);
        result.push({ weight: plate, count });
        remaining -= count * plate;
        remaining = Math.round(remaining * 100) / 100;
      }
    }
    return result;
  };

  const plateColors: Record<number, string> = {
    25: 'bg-red-600',
    20: 'bg-blue-600',
    15: 'bg-amber-500',
    10: 'bg-emerald-600',
    5: 'bg-zinc-500',
    2.5: 'bg-zinc-400 text-black',
    1.25: 'bg-zinc-300 text-black',
  };

  const plates = calculatePlates();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-5 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-white font-mono uppercase">Plate Calculator</h3>
          <button onClick={onClose} aria-label="Close calculator" className="text-zinc-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-[10px] font-mono text-zinc-400 mb-1 uppercase font-bold">Target Weight (kg)</label>
            <input
              type="number"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 h-11 rounded-xl text-base font-mono font-bold text-center focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-zinc-400 mb-1 uppercase font-bold">Bar Weight (kg)</label>
            <input
              type="number"
              value={barWeight}
              onChange={(e) => setBarWeight(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 h-11 rounded-xl text-base font-mono font-bold text-center focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
          <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-3 text-center font-bold">
            Load Per Barbell Side
          </div>
          {plates.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-1.5">
              {plates.flatMap((p) =>
                Array(p.count).fill(0).map((_, j) => (
                  <div
                    key={`${p.weight}-${j}`}
                    className={`w-9 h-14 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-white shadow-md border border-white/20 ${
                      plateColors[p.weight] || 'bg-zinc-600'
                    }`}
                  >
                    {p.weight}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="text-center text-zinc-500 text-xs py-3 font-mono">
              Load bar only or adjust target.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Active Session Tracker View ──────────────────────────────────────────────

function TrackerView({
  plan,
  selectedDay,
  gymHistory,
  defaultRestTime,
  onSave
}: {
  plan: WorkoutPlan;
  selectedDay: string;
  gymHistory: LoggedSession[];
  defaultRestTime: number;
  onSave: (s: LoggedSession) => void;
}) {
  const { setActiveTimer, showToast } = useAppContext();
  const [exercises, setExercises] = useState<LoggedExercise[]>([]);
  const [expandedHistory, setExpandedHistory] = useState<Record<number, boolean>>({});
  const [guideExercise, setGuideExercise] = useState<string | null>(null);
  const [swapTarget, setSwapTarget] = useState<number | null>(null);

  useEffect(() => {
    const dayPlan = plan[selectedDay];
    if (!dayPlan || dayPlan.type === 'rest') {
      setExercises([]);
      return;
    }
    const initial: LoggedExercise[] = [];
    dayPlan.sections.forEach((sec) => {
      sec.exercises.forEach((ex) => {
        const m = ex.sets.match(/^(\d+)/);
        const numSets = m ? parseInt(m[1]) : 3;
        initial.push({
          name: ex.name,
          notes: '',
          sets: Array(numSets).fill(null).map(() => ({ kg: '', reps: '', completed: false }))
        });
      });
    });
    setExercises(initial);
  }, [selectedDay, plan]);

  const dayPlan = plan[selectedDay];
  if (!dayPlan || dayPlan.type === 'rest') {
    return null;
  }

  const updateSet = (exIdx: number, setIdx: number, field: keyof LoggedSet, value: string | boolean) => {
    const newExs = [...exercises];
    newExs[exIdx] = { ...newExs[exIdx], sets: [...newExs[exIdx].sets] };
    newExs[exIdx].sets[setIdx] = { ...newExs[exIdx].sets[setIdx], [field]: value };
    setExercises(newExs);

    if (field === 'completed' && value === true) {
      setActiveTimer(0);
      setTimeout(() => setActiveTimer(defaultRestTime), 20);
      showToast(`Set ${setIdx + 1} completed! Rest timer activated (${defaultRestTime}s)`);
    }
  };

  const addSet = (exIdx: number) => {
    const newExs = [...exercises];
    const prevKg = newExs[exIdx].sets[newExs[exIdx].sets.length - 1]?.kg || '';
    const prevReps = newExs[exIdx].sets[newExs[exIdx].sets.length - 1]?.reps || '';
    newExs[exIdx] = {
      ...newExs[exIdx],
      sets: [...newExs[exIdx].sets, { kg: prevKg, reps: prevReps, completed: false }]
    };
    setExercises(newExs);
  };

  const handleSave = () => {
    const cleaned = exercises
      .map((ex) => ({ ...ex, sets: ex.sets.filter((s) => s.kg !== '' || s.reps !== '') }))
      .filter((ex) => ex.sets.length > 0);

    if (cleaned.length === 0) {
      showToast('Please log at least one set before saving', 'error');
      return;
    }

    const session: LoggedSession = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      dayId: selectedDay,
      name: dayPlan.title,
      exercises: cleaned,
    };
    onSave(session);
  };

  return (
    <div className="space-y-4">
      {/* Session Active Top Indicator */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
            Live Workout In Progress
          </div>
          <div className="text-base font-bold text-white">{dayPlan.title}</div>
        </div>
        <div className="text-xs font-mono text-zinc-400">
          {exercises.length} Exercises
        </div>
      </div>

      {/* Exercises Logging Cards */}
      {exercises.map((ex, exIdx) => {
        const completedSets = ex.sets.filter((s) => s.completed).length;
        return (
          <div key={exIdx} className="bg-zinc-900 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/40">
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-white block truncate">{ex.name}</span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {completedSets} / {ex.sets.length} Sets Completed
                </span>
              </div>

              <div className="flex gap-1.5 ml-2">
                <button
                  onClick={() => setGuideExercise(ex.name)}
                  aria-label="Form guide"
                  className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sky-400 flex items-center justify-center transition-colors"
                  title="Form Guide"
                >
                  <Info size={14} />
                </button>
                <button
                  onClick={() => setSwapTarget(exIdx)}
                  aria-label="Swap exercise"
                  className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                  title="Swap Movement"
                >
                  <RefreshCw size={13} />
                </button>
                <button
                  onClick={() => setExpandedHistory(prev => ({ ...prev, [exIdx]: !prev[exIdx] }))}
                  aria-label="Past performance"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    expandedHistory[exIdx] ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                  title="History"
                >
                  <History size={13} />
                </button>
              </div>
            </div>

            {/* Inline Previous History */}
            {expandedHistory[exIdx] && (
              <div className="p-3 bg-zinc-950 border-b border-zinc-800/80 text-[11px] font-mono">
                <div className="text-zinc-500 uppercase tracking-wider mb-2 font-bold">Past Recorded Sets</div>
                {gymHistory
                  .filter((s) => s.exercises.some((e) => e.name.toLowerCase().includes(ex.name.toLowerCase())))
                  .slice(0, 2)
                  .map((session, i) => {
                    const past = session.exercises.find((e) => e.name.toLowerCase().includes(ex.name.toLowerCase()));
                    if (!past) return null;
                    return (
                      <div key={i} className="flex justify-between items-center py-1 border-t border-zinc-900 first:border-0">
                        <span className="text-zinc-400">{session.date}</span>
                        <div className="flex gap-1.5">
                          {past.sets.map((s, j) => (
                            <span key={j} className="bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-200">
                              {s.kg}kg × {s.reps}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Sets Table */}
            <div className="p-3 space-y-2">
              <div className="grid grid-cols-[24px_1fr_1fr_40px] gap-2 px-1 text-center text-[10px] font-mono uppercase text-zinc-500 font-bold">
                <div>#</div>
                <div>Weight (kg)</div>
                <div>Reps</div>
                <div>Log</div>
              </div>

              {ex.sets.map((set, setIdx) => (
                <div
                  key={setIdx}
                  className={`grid grid-cols-[24px_1fr_1fr_40px] gap-2 items-center p-1.5 rounded-xl transition-colors ${
                    set.completed ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-zinc-950/60'
                  }`}
                >
                  <span className={`text-xs font-mono font-bold text-center ${set.completed ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {setIdx + 1}
                  </span>
                  <input
                    type="number"
                    placeholder="kg"
                    value={set.kg}
                    onChange={(e) => updateSet(exIdx, setIdx, 'kg', e.target.value)}
                    className="h-10 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-center focus:outline-none focus:border-sky-500 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="reps"
                    value={set.reps}
                    onChange={(e) => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                    className="h-10 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-center focus:outline-none focus:border-sky-500 text-sm"
                  />
                  <button
                    onClick={() => updateSet(exIdx, setIdx, 'completed', !set.completed)}
                    aria-label={`Mark set ${setIdx + 1} completed`}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all press-scale ${
                      set.completed
                        ? 'bg-emerald-500 text-zinc-950'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Check size={16} />
                  </button>
                </div>
              ))}

              <div className="flex justify-center pt-1">
                <button
                  onClick={() => addSet(exIdx)}
                  className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <Plus size={13} /> Add Set
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full h-12 bg-emerald-500 text-zinc-950 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all press-scale shadow-lg font-sans"
      >
        <Save size={16} /> Finish & Save Workout
      </button>

      {/* Form Guide Dialog */}
      {guideExercise && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-white font-mono">{guideExercise}</h3>
              <button onClick={() => setGuideExercise(null)} className="text-zinc-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
            <div className="text-xs text-zinc-300 space-y-2 leading-relaxed">
              <p>• <strong>Setup:</strong> Maintain active core brace, stabilize scapulae and shoulders.</p>
              <p>• <strong>Tempo:</strong> 2-second controlled eccentric stretch, crisp concentric drive.</p>
              <p>• <strong>Target:</strong> Keep constant mechanical tension without bouncing at reversal.</p>
            </div>
            <button
              onClick={() => setGuideExercise(null)}
              className="mt-4 w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Swap Exercise Modal */}
      {swapTarget !== null && (
        <ExerciseSelectorModal
          onClose={() => setSwapTarget(null)}
          onSelect={(name) => {
            const newExs = [...exercises];
            newExs[swapTarget] = { ...newExs[swapTarget], name };
            setExercises(newExs);
            setSwapTarget(null);
            showToast(`Swapped to ${name}`);
          }}
        />
      )}
    </div>
  );
}

// ─── Day Routine Editor ───────────────────────────────────────────────────────

function DayEditor({ plan, onSave, onCancel }: { plan: DayPlan; onSave: (p: DayPlan) => void; onCancel: () => void }) {
  const [editedPlan, setEditedPlan] = useState<DayPlan>(plan);
  const [selector, setSelector] = useState<{ sIdx: number; eIdx?: number } | null>(null);

  const updateExercise = (sIdx: number, eIdx: number, field: string, value: string) => {
    const np = { ...editedPlan };
    np.sections[sIdx].exercises[eIdx] = { ...np.sections[sIdx].exercises[eIdx], [field]: value };
    setEditedPlan(np);
  };

  const removeExercise = (sIdx: number, eIdx: number) => {
    const np = { ...editedPlan };
    np.sections[sIdx].exercises.splice(eIdx, 1);
    setEditedPlan({ ...np });
  };

  const addExercise = (sIdx: number, name: string) => {
    const np = { ...editedPlan };
    np.sections[sIdx].exercises.push({
      id: Date.now().toString(),
      name,
      sets: '3 × 8–12',
      rpe: 'RPE 8',
      note: '',
      pills: []
    });
    setEditedPlan({ ...np });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
        <h2 className="text-sm font-bold text-white font-mono uppercase">Edit {plan.dayLabel} Protocol</h2>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white">Cancel</button>
          <button onClick={() => onSave(editedPlan)} className="px-3 py-1.5 bg-emerald-500 text-zinc-950 rounded-lg text-xs font-bold">
            Save Plan
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {editedPlan.sections.map((section, sIdx) => (
          <div key={section.id} className="space-y-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
              {section.label} Group
            </span>
            {section.exercises.map((ex, eIdx) => (
              <div key={ex.id} className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelector({ sIdx, eIdx })}
                  className="text-xs font-bold text-white truncate text-left hover:text-sky-400 flex-1"
                >
                  {ex.name}
                </button>
                <button
                  onClick={() => removeExercise(sIdx, eIdx)}
                  aria-label="Remove exercise"
                  className="p-1 text-zinc-500 hover:text-rose-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            <button
              onClick={() => setSelector({ sIdx })}
              className="w-full py-2 bg-transparent border border-dashed border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
            >
              <Plus size={13} /> Add Movement
            </button>
          </div>
        ))}
      </div>

      {selector && (
        <ExerciseSelectorModal
          onClose={() => setSelector(null)}
          onSelect={(name) => {
            if (selector.eIdx !== undefined) updateExercise(selector.sIdx, selector.eIdx, 'name', name);
            else addExercise(selector.sIdx, name);
            setSelector(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Exercise Selector Modal ──────────────────────────────────────────────────

function ExerciseSelectorModal({ onClose, onSelect }: { onClose: () => void; onSelect: (name: string) => void }) {
  const [search, setSearch] = useState('');
  const filtered = COMMON_EXERCISES.filter((ex) => ex.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-4 max-h-[75vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-white font-mono uppercase">Select Movement</h3>
          <button onClick={onClose} aria-label="Close" className="text-zinc-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 text-white pl-9 pr-3 h-10 rounded-xl text-xs focus:outline-none focus:border-sky-500 font-sans"
            autoFocus
          />
        </div>

        <div className="overflow-y-auto flex-1 space-y-1 divide-y divide-zinc-800/40 custom-scrollbar pr-1">
          {filtered.map((ex, i) => (
            <button
              key={i}
              onClick={() => onSelect(ex)}
              className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              {ex}
            </button>
          ))}
          {filtered.length === 0 && search.trim() && (
            <button
              onClick={() => onSelect(search.trim())}
              className="w-full mt-2 py-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
            >
              Add "{search}" as custom exercise
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
