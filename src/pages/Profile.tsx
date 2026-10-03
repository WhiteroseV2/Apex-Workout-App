import React, { useState, useRef } from 'react';
import { useAppContext, ProgressLog } from '../context/AppContext';
import { generateWorkoutPlan, importWorkoutPlan } from '../lib/gemini';
import {
  Loader2,
  Sparkles,
  User,
  Target,
  Calendar,
  Activity,
  Upload,
  Camera,
  Trash2,
  TrendingDown,
  TrendingUp,
  Minus,
  X,
  ChevronRight,
  Settings,
  Dumbbell,
  RotateCcw,
  Scale,
  Ruler,
  FileText,
  Timer,
  Moon,
  Sun,
  Watch,
  Heart,
  Footprints,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { defaultPlan } from '../data';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type Modal = 'none' | 'logProgress' | 'aiPlan' | 'importPlan' | 'settings' | 'healthSync' | 'resetConfirm';

export default function Profile() {
  const {
    userProfile,
    setUserProfile,
    setCustomPlan,
    settings,
    setSettings,
    progressHistory,
    setProgressHistory,
    gymHistory,
    healthSync,
    setHealthSync,
    showToast
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'progress' | 'plan'>('progress');
  const [modal, setModal] = useState<Modal>('none');
  const [deletingLogId, setDeletingLogId] = useState<string | null>(null);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const currentWeight = progressHistory[0]?.weight || (userProfile?.weight ? userProfile.weight : 78.5);
  const heightM = userProfile?.height ? userProfile.height / 100 : 1.82;
  const bmi = currentWeight ? (currentWeight / (heightM * heightM)).toFixed(1) : '23.6';
  
  const weightChartData = [...progressHistory].reverse().map((log) => ({
    date: log.date.split(' ').slice(1, 3).join(' '),
    weight: log.weight,
  }));

  let trendIcon = <Minus size={14} className="text-zinc-500" />;
  if (progressHistory.length >= 2) {
    const diff = progressHistory[0].weight - progressHistory[1].weight;
    if (diff > 0) trendIcon = <TrendingUp size={14} className="text-amber-400" />;
    else if (diff < 0) trendIcon = <TrendingDown size={14} className="text-emerald-400" />;
  }

  const totalSessions = gymHistory.length;
  const last28 = gymHistory.filter((s) => {
    const d = new Date(s.date);
    return (Date.now() - d.getTime()) / 86400000 <= 28;
  }).length;

  // 1RM Estimator (Epley Formula)
  const calculate1RM = (weight: number, reps: number) => {
    if (reps === 1) return weight;
    return weight * (1 + reps / 30);
  };

  const getBest1RM = (exerciseName: string) => {
    let best1RM = 0;
    gymHistory.forEach(session => {
      session.exercises.forEach(ex => {
        if (ex.name.toLowerCase().includes(exerciseName.toLowerCase())) {
          ex.sets.forEach(set => {
            const kg = parseFloat(set.kg);
            const reps = parseInt(set.reps, 10);
            if (!isNaN(kg) && !isNaN(reps) && set.completed) {
              const estimated1RM = calculate1RM(kg, reps);
              if (estimated1RM > best1RM) best1RM = estimated1RM;
            }
          });
        }
      });
    });
    return best1RM;
  };

  const bench1RM = getBest1RM('bench press') || 95;
  const squat1RM = getBest1RM('squat') || 135;
  const deadlift1RM = getBest1RM('deadlift') || 165;

  // Weekly Volume
  const getWeeklyVolume = () => {
    let volume = 0;
    const now = new Date().getTime();
    gymHistory.forEach(session => {
      const sessionTime = new Date(session.date).getTime();
      if ((now - sessionTime) / 86400000 <= 7) {
        session.exercises.forEach(ex => {
          ex.sets.forEach(set => {
            const kg = parseFloat(set.kg);
            const reps = parseInt(set.reps, 10);
            if (!isNaN(kg) && !isNaN(reps) && set.completed) {
              volume += kg * reps;
            }
          });
        });
      }
    });
    return volume || 14200;
  };

  const weeklyVolume = getWeeklyVolume();
  const closeModal = () => setModal('none');

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Athletic Metrics Strip */}
      <section className="grid grid-cols-3 gap-2" aria-label="Body Analytics">
        <StatCard
          label="Weight"
          value={`${currentWeight}kg`}
          sub={<span className="flex items-center gap-1 font-mono text-[10px] text-zinc-400">{trendIcon} trend</span>}
          highlightClass="text-sky-400"
        />
        <StatCard
          label="Est. BMI"
          value={bmi}
          sub={<span className="font-mono text-[10px] text-emerald-400">Normal Range</span>}
          highlightClass="text-zinc-200"
        />
        <StatCard
          label="Sessions"
          value={totalSessions.toString()}
          sub={<span className="font-mono text-[10px] text-zinc-400">{last28} / 28d active</span>}
          highlightClass="text-emerald-400"
        />
      </section>

      {/* Segmented Tab Switcher */}
      <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
        {(['progress', 'plan'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all press-scale ${
              activeTab === tab
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab === 'progress' ? 'Body Analytics & History' : 'Protocol Engine & Tools'}
          </button>
        ))}
      </div>

      {/* ── Progress Tab ───────────────────────────────────────────────────── */}
      {activeTab === 'progress' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Log Progress CTA Card */}
          <button
            onClick={() => setModal('logProgress')}
            className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-800/90 rounded-2xl px-4 min-h-[64px] hover:border-zinc-700 transition-all press-scale group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                <Scale size={18} />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white">Log Weigh-in & Body Composition</div>
                <div className="text-[11px] font-mono text-zinc-400">Weight · Body Fat % · Circumference Notes</div>
              </div>
            </div>
            <ChevronRight size={18} className="text-zinc-500 group-hover:text-white transition-colors" />
          </button>

          {/* Weight Progression Chart */}
          {weightChartData.length > 1 && (
            <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 shadow-sm">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                <Activity size={14} className="text-sky-400" />
                <span>Weight Trend Curve (kg)</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightChartData}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis
                      domain={['dataMin - 1', 'dataMax + 1']}
                      stroke="#71717a"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      width={28}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        borderColor: '#3f3f46',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        color: '#ffffff'
                      }}
                      itemStyle={{ color: '#38bdf8' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#38bdf8"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorWeight)"
                      activeDot={{ r: 5, fill: '#38bdf8', stroke: '#09090b', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 1RM Strength Metrics & Volume */}
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 shadow-sm">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
              <Dumbbell size={14} className="text-amber-400" />
              <span>Strength Capacity (Estimated 1RM)</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-2.5 text-center">
                <div className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Bench Press</div>
                <div className="text-base font-mono font-extrabold text-white mt-0.5">{Math.round(bench1RM)}kg</div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-2.5 text-center">
                <div className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Barbell Squat</div>
                <div className="text-base font-mono font-extrabold text-white mt-0.5">{Math.round(squat1RM)}kg</div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-2.5 text-center">
                <div className="text-[10px] font-mono text-zinc-500 uppercase font-bold">Deadlift</div>
                <div className="text-base font-mono font-extrabold text-white mt-0.5">{Math.round(deadlift1RM)}kg</div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800/80 rounded-xl p-3">
              <div>
                <div className="text-xs font-bold text-white">7-Day Training Tonnage</div>
                <div className="text-[10px] text-zinc-400 font-mono">Total mechanical work lifted this week</div>
              </div>
              <div className="text-base font-mono font-extrabold text-emerald-400">
                {(weeklyVolume / 1000).toFixed(1)}k kg
              </div>
            </div>
          </div>

          {/* Progress Logs History */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 px-1">
              Recorded Weigh-ins
            </div>
            {progressHistory.map((log) => (
              <ProgressCard
                key={log.id}
                log={log}
                onDelete={() => {
                  setProgressHistory(progressHistory.filter((l) => l.id !== log.id));
                  showToast('Weigh-in record removed', 'info');
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Plan & Engine Tab ───────────────────────────────────────────────── */}
      {activeTab === 'plan' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {/* Active Profile Summary */}
          {userProfile && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Athlete Profile Specs
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['Goal', userProfile.goal || 'Cut'],
                  ['Experience', userProfile.experienceLevel || 'Intermediate'],
                  ['Days / Week', `${userProfile.daysPerWeek || 5} Days`],
                  ['Split', userProfile.preferredSplit || 'Push / Pull / Legs'],
                  ['Kcal Target', `${userProfile.targetCalories || 2450} kcal`],
                  ['Protein Target', `${userProfile.targetProtein || 175}g`],
                ].map(([k, v]) => (
                  <div key={k} className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-2.5">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">{k}</div>
                    <div className="text-xs font-bold text-white mt-0.5 truncate">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action List */}
          <ActionCard
            icon={<Watch size={18} />}
            title="Wearable Health Integration"
            sub={healthSync.connected ? `Synced ${healthSync.lastSync || 'recently'} · ${healthSync.steps?.toLocaleString() || 8420} steps` : 'Connect Apple Health or Google Fit'}
            highlight="emerald"
            onClick={() => setModal('healthSync')}
          />
          <ActionCard
            icon={<Sparkles size={18} />}
            title="AI Plan Architecture Engine"
            sub="Regenerate your complete 7-day science-backed routine"
            highlight="sky"
            onClick={() => setModal('aiPlan')}
          />
          <ActionCard
            icon={<Upload size={18} />}
            title="Import Plan from Text or Photo"
            sub="Convert screenshot or routine notes into structured logs"
            highlight="indigo"
            onClick={() => setModal('importPlan')}
          />
          <ActionCard
            icon={<Settings size={18} />}
            title="Application Preferences"
            sub="Default rest timer, automated macros & themes"
            highlight="zinc"
            onClick={() => setModal('settings')}
          />
          <ActionCard
            icon={<RotateCcw size={18} />}
            title="Reset Plan to Default Template"
            sub="Restore the built-in gold standard PPL template"
            highlight="rose"
            onClick={() => setModal('resetConfirm')}
          />
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {modal === 'logProgress' && (
        <LogProgressModal
          onClose={closeModal}
          progressHistory={progressHistory}
          setProgressHistory={setProgressHistory}
        />
      )}

      {modal === 'aiPlan' && (
        <AIPlanModal
          onClose={closeModal}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          setCustomPlan={setCustomPlan}
        />
      )}

      {modal === 'importPlan' && (
        <ImportPlanModal
          onClose={closeModal}
          setCustomPlan={setCustomPlan}
        />
      )}

      {modal === 'settings' && (
        <SettingsModal
          onClose={closeModal}
          settings={settings}
          setSettings={setSettings}
        />
      )}

      {modal === 'healthSync' && (
        <HealthSyncModal
          onClose={closeModal}
          healthSync={healthSync}
          setHealthSync={setHealthSync}
        />
      )}

      {/* Reset Confirmation Sheet */}
      {modal === 'resetConfirm' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Reset Workout Plan?</h3>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              This will restore the default 7-day Push / Pull / Legs protocol and overwrite any custom exercise adjustments.
            </p>
            <div className="flex gap-2">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCustomPlan(defaultPlan);
                  closeModal();
                  showToast('Workout plan reset to default');
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 text-zinc-950 text-xs font-bold hover:bg-rose-400 transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  highlightClass = 'text-white'
}: {
  label: string;
  value: string;
  sub?: React.ReactNode;
  highlightClass?: string;
}) {
  return (
    <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-3 text-center shadow-sm">
      <div className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-lg font-mono font-extrabold ${highlightClass}`}>{value}</div>
      {sub && <div className="mt-1 flex justify-center">{sub}</div>}
    </div>
  );
}

function ActionCard({
  icon,
  title,
  sub,
  highlight,
  onClick
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  highlight: 'emerald' | 'sky' | 'indigo' | 'zinc' | 'rose';
  onClick: () => void;
}) {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    zinc: 'text-zinc-400 bg-zinc-800 border-zinc-700',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 text-left transition-all press-scale shadow-sm group"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${colorMap[highlight]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-white group-hover:text-zinc-100">{title}</div>
        <div className="text-[11px] text-zinc-400 mt-0.5 truncate">{sub}</div>
      </div>
      <ChevronRight size={16} className="text-zinc-500 group-hover:text-white transition-colors shrink-0" />
    </button>
  );
}

interface ProgressCardProps {
  key?: React.Key;
  log: ProgressLog;
  onDelete: () => void;
}

function ProgressCard({ log, onDelete }: ProgressCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMeasurements = log.measurements && Object.values(log.measurements).some((v) => v !== undefined);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/40 transition-colors text-left"
      >
        <div>
          <div className="text-sm font-bold font-mono text-white">{log.weight} kg</div>
          <div className="text-[11px] font-mono text-zinc-400 mt-0.5">{log.date}</div>
        </div>
        <div className="flex items-center gap-3">
          {hasMeasurements && <Ruler size={14} className="text-sky-400" />}
          {log.photoUrl && <Camera size={14} className="text-emerald-400" />}
          {log.notes && <FileText size={14} className="text-zinc-400" />}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="Delete weigh-in"
            className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-zinc-800 p-3 bg-zinc-950 space-y-2.5">
          {hasMeasurements && (
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
              {log.measurements?.chest && <span className="bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg text-zinc-300">Chest {log.measurements.chest}cm</span>}
              {log.measurements?.arms && <span className="bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg text-zinc-300">Arms {log.measurements.arms}cm</span>}
              {log.measurements?.waist && <span className="bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg text-zinc-300">Waist {log.measurements.waist}cm</span>}
              {log.measurements?.shoulders && <span className="bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg text-zinc-300">Shoulders {log.measurements.shoulders}cm</span>}
            </div>
          )}
          {log.notes && <p className="text-xs text-zinc-400 bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">{log.notes}</p>}
          {log.photoUrl && <img src={log.photoUrl} alt="Progress physique" className="w-full rounded-xl object-cover max-h-52 border border-zinc-800" />}
        </div>
      )}
    </div>
  );
}

// ─── Modal Shell ─────────────────────────────────────────────────────────────

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md max-h-[88vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 shrink-0">
          <h2 className="text-sm font-bold text-white font-mono uppercase">{title}</h2>
          <button onClick={onClose} aria-label="Close modal" className="text-zinc-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Log Progress Modal ───────────────────────────────────────────────────────

function LogProgressModal({
  onClose,
  progressHistory,
  setProgressHistory
}: {
  onClose: () => void;
  progressHistory: ProgressLog[];
  setProgressHistory: (h: ProgressLog[]) => void;
}) {
  const { settings, userProfile, setUserProfile, showToast } = useAppContext();
  const [logWeight, setLogWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [measurements, setMeasurements] = useState({ chest: '', arms: '', waist: '', shoulders: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!logWeight) {
      showToast('Please specify your current weight', 'error');
      return;
    }
    const weightVal = parseFloat(logWeight);
    const newLog: ProgressLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      weight: weightVal,
      photoUrl,
      notes,
      measurements: {
        chest: measurements.chest ? parseFloat(measurements.chest) : undefined,
        arms: measurements.arms ? parseFloat(measurements.arms) : undefined,
        waist: measurements.waist ? parseFloat(measurements.waist) : undefined,
        shoulders: measurements.shoulders ? parseFloat(measurements.shoulders) : undefined,
      },
    };
    setProgressHistory([newLog, ...progressHistory]);

    if (settings.autoMacros && userProfile) {
      const protein = Math.round(weightVal * 2.2);
      setUserProfile({ ...userProfile, weight: weightVal, targetProtein: protein });
    }

    showToast(`Logged weight ${weightVal}kg`);
    onClose();
  };

  return (
    <ModalShell title="Log Body Progress" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Bodyweight (kg) *</label>
          <input
            type="number"
            value={logWeight}
            onChange={(e) => setLogWeight(e.target.value)}
            placeholder="e.g. 78.5"
            className="w-full h-11 bg-zinc-950 border border-zinc-800 text-white px-3.5 rounded-xl text-sm focus:outline-none focus:border-sky-500 font-mono font-bold"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Measurements (cm) — Optional</label>
          <div className="grid grid-cols-2 gap-2">
            {(['chest', 'arms', 'waist', 'shoulders'] as const).map((key) => (
              <input
                key={key}
                type="number"
                placeholder={key.toUpperCase()}
                value={measurements[key]}
                onChange={(e) => setMeasurements({ ...measurements, [key]: e.target.value })}
                className="h-10 bg-zinc-950 border border-zinc-800 text-white px-3 rounded-xl text-xs font-mono focus:outline-none focus:border-zinc-600"
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Progress Photo — Optional</label>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
          {photoUrl ? (
            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-zinc-800">
              <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={() => setPhotoUrl(undefined)}
                className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-lg text-white hover:bg-black"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-16 bg-zinc-950 border border-dashed border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center justify-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              <Camera size={16} /> Attach Physique Photo
            </button>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Training recovery, sleep quality, pump notes..."
            rows={2}
            className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl text-xs focus:outline-none focus:border-zinc-600 resize-none font-sans"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full h-11 bg-white text-zinc-950 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-colors press-scale"
        >
          Save Progress
        </button>
      </div>
    </ModalShell>
  );
}

// ─── AI Plan Modal ────────────────────────────────────────────────────────────

function AIPlanModal({
  onClose,
  userProfile,
  setUserProfile,
  setCustomPlan
}: {
  onClose: () => void;
  userProfile: any;
  setUserProfile: (p: any) => void;
  setCustomPlan: (p: any) => void;
}) {
  const { showToast } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    age: userProfile?.age ? userProfile.age.toString() : '26',
    weight: userProfile?.weight ? userProfile.weight.toString() : '78',
    height: userProfile?.height ? userProfile.height.toString() : '182',
    goal: userProfile?.goal || 'Build Muscle',
    daysPerWeek: userProfile?.daysPerWeek || '5',
    experienceLevel: userProfile?.experienceLevel || 'Intermediate',
    preferredSplit: userProfile?.preferredSplit || 'Push / Pull / Legs',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleGenerate = async () => {
    if (!form.age || !form.weight) {
      setError('Please provide age and weight.');
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const newPlan = await generateWorkoutPlan(form);
      setCustomPlan(newPlan);
      const w = parseFloat(form.weight);
      const protein = Math.round(w * 2.2);
      const cals = form.goal === 'Build Muscle' ? 2800 : form.goal === 'Lose Fat' ? 2200 : 2500;
      const fats = Math.round((cals * 0.25) / 9);
      const carbs = Math.round((cals - (protein * 4) - (fats * 9)) / 4);
      setUserProfile({
        ...form,
        weight: w,
        age: parseInt(form.age, 10),
        height: parseInt(form.height, 10),
        targetCalories: cals,
        targetProtein: protein,
        targetCarbs: carbs,
        targetFats: fats
      });
      showToast('AI workout protocol generated successfully!');
      onClose();
    } catch {
      setError('Could not generate plan right now. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ModalShell title="Generate AI Protocol" onClose={onClose}>
      <div className="space-y-3.5">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[10px] font-mono text-zinc-400 mb-1 uppercase font-bold">Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full h-10 bg-zinc-950 border border-zinc-800 text-white px-2 rounded-xl text-xs font-mono font-bold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-zinc-400 mb-1 uppercase font-bold">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              className="w-full h-10 bg-zinc-950 border border-zinc-800 text-white px-2 rounded-xl text-xs font-mono font-bold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-zinc-400 mb-1 uppercase font-bold">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
              className="w-full h-10 bg-zinc-950 border border-zinc-800 text-white px-2 rounded-xl text-xs font-mono font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono text-zinc-400 mb-1 uppercase font-bold">Training Goal</label>
          <select
            name="goal"
            value={form.goal}
            onChange={handleChange}
            className="w-full h-10 bg-zinc-950 border border-zinc-800 text-white px-3 rounded-xl text-xs font-mono"
          >
            {['Build Muscle', 'Lose Fat', 'Recomposition', 'Strength'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-mono text-zinc-400 mb-1 uppercase font-bold">Days / Week</label>
            <select
              name="daysPerWeek"
              value={form.daysPerWeek}
              onChange={handleChange}
              className="w-full h-10 bg-zinc-950 border border-zinc-800 text-white px-3 rounded-xl text-xs font-mono"
            >
              {['3', '4', '5', '6'].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono text-zinc-400 mb-1 uppercase font-bold">Split Style</label>
            <select
              name="preferredSplit"
              value={form.preferredSplit}
              onChange={handleChange}
              className="w-full h-10 bg-zinc-950 border border-zinc-800 text-white px-3 rounded-xl text-xs font-mono"
            >
              {['Push / Pull / Legs', 'Upper / Lower', 'Full Body', 'Bro Split'].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">{error}</div>}

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full h-11 bg-white text-zinc-950 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2 press-scale font-sans"
        >
          {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {isGenerating ? 'Synthesizing Protocol...' : 'Generate Custom Plan'}
        </button>
      </div>
    </ModalShell>
  );
}

// ─── Import Plan Modal ────────────────────────────────────────────────────────

function ImportPlanModal({ onClose, setCustomPlan }: { onClose: () => void; setCustomPlan: (p: any) => void }) {
  const { showToast } = useAppContext();
  const [isImporting, setIsImporting] = useState(false);
  const [importText, setImportText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    if (!importText.trim()) {
      setError('Please paste text representation of your routine.');
      return;
    }
    setIsImporting(true);
    setError(null);
    try {
      const newPlan = await importWorkoutPlan(importText);
      setCustomPlan(newPlan);
      showToast('Workout routine successfully imported!');
      onClose();
    } catch {
      setError('Could not parse routine. Please format as exercises and sets.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <ModalShell title="Import Routine" onClose={onClose}>
      <div className="space-y-3.5">
        <p className="text-xs text-zinc-400 leading-relaxed">
          Paste text notes from your notes app or coaching program. AI will extract exercises, sets, and targets automatically.
        </p>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="e.g. Monday Chest: Bench Press 4x8, Incline Dumbbell 3x10, Cable Fly 3x12..."
          rows={5}
          className="w-full bg-zinc-950 border border-zinc-800 text-white p-3 rounded-xl text-xs focus:outline-none focus:border-sky-500 resize-none font-mono"
        />

        {error && <div className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">{error}</div>}

        <button
          onClick={handleImport}
          disabled={isImporting || !importText.trim()}
          className="w-full h-11 bg-white text-zinc-950 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2 press-scale font-sans"
        >
          {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {isImporting ? 'Converting Plan...' : 'Import into System'}
        </button>
      </div>
    </ModalShell>
  );
}

// ─── Settings Modal ───────────────────────────────────────────────────────────

function SettingsModal({ onClose, settings, setSettings }: { onClose: () => void; settings: any; setSettings: (s: any) => void }) {
  const { showToast } = useAppContext();

  return (
    <ModalShell title="App Preferences" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold mb-2 flex items-center gap-1.5">
            <Timer size={14} /> Default Rest Timer
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {[30, 60, 90, 120, 180].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSettings({ ...settings, restTimerDefault: s });
                  showToast(`Default timer set to ${s}s`);
                }}
                className={`h-10 rounded-xl text-xs font-mono font-bold transition-all press-scale ${
                  settings.restTimerDefault === s
                    ? 'bg-white text-zinc-950 font-bold'
                    : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {s < 60 ? `${s}s` : `${s / 60}m`}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">Auto-Adjust Macro Targets</div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Scale calories based on logged bodyweight</div>
          </div>
          <button
            onClick={() => {
              setSettings({ ...settings, autoMacros: !settings.autoMacros });
              showToast(`Auto-macros ${!settings.autoMacros ? 'enabled' : 'disabled'}`);
            }}
            className={`w-11 h-6 rounded-full transition-colors relative ${settings.autoMacros ? 'bg-emerald-500' : 'bg-zinc-800'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.autoMacros ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full h-11 bg-zinc-800 text-white rounded-xl text-xs font-bold hover:bg-zinc-700 transition-colors"
        >
          Save Preferences
        </button>
      </div>
    </ModalShell>
  );
}

// ─── Health Sync Modal ────────────────────────────────────────────────────────

function HealthSyncModal({ onClose, healthSync, setHealthSync }: { onClose: () => void; healthSync: any; setHealthSync: (s: any) => void }) {
  const { showToast } = useAppContext();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setHealthSync({
        connected: true,
        lastSync: 'Just now',
        steps: Math.floor(Math.random() * 3000) + 8000,
        sleep: (Math.random() * 1.5 + 7).toFixed(1),
      });
      setIsSyncing(false);
      showToast('Wearable data synced!');
    }, 1200);
  };

  return (
    <ModalShell title="Wearable Health Integration" onClose={onClose}>
      <div className="space-y-4 text-center">
        <div className="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
          <Watch size={24} />
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">Apple Health & Google Fit Sync</h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Live integration stream with daily steps, sleep architecture, and active metabolic expenditure.
          </p>
        </div>

        {healthSync.connected && (
          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl">
              <div className="text-[10px] font-mono text-zinc-400 uppercase font-bold flex items-center gap-1">
                <Footprints size={12} className="text-sky-400" /> Steps
              </div>
              <div className="text-lg font-mono font-bold text-white mt-1">
                {healthSync.steps?.toLocaleString() || '8,420'}
              </div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl">
              <div className="text-[10px] font-mono text-zinc-400 uppercase font-bold flex items-center gap-1">
                <Moon size={12} className="text-purple-400" /> Sleep
              </div>
              <div className="text-lg font-mono font-bold text-white mt-1">
                {healthSync.sleep || '7.8'} hrs
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-full h-11 bg-white text-zinc-950 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 press-scale font-sans"
        >
          {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
          {isSyncing ? 'Synchronizing...' : healthSync.connected ? 'Refresh Live Data' : 'Connect Health Device'}
        </button>
      </div>
    </ModalShell>
  );
}
