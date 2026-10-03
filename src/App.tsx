import React, { FormEvent, ReactNode, useState, useEffect, useRef } from "react";
import { chatWithGymBro } from "./lib/gemini";

type IconName =
  | "grid"
  | "nutrition"
  | "training"
  | "chart"
  | "coach"
  | "settings"
  | "bell"
  | "plus"
  | "arrow"
  | "bolt"
  | "clock"
  | "flame"
  | "send"
  | "chevron"
  | "check"
  | "close"
  | "trash"
  | "checkCircle"
  | "droplet";

const paths: Record<IconName, ReactNode> = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>
  ),
  nutrition: (
    <>
      <path d="M7 3v7a3 3 0 0 0 3 3V3M4 7h6M10 13v8M17 3v18M17 3c3 2 4 5 0 9" />
    </>
  ),
  training: (
    <>
      <path d="M6 7v10M18 7v10M3 9v6M21 9v6M6 12h12" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
    </>
  ),
  coach: (
    <>
      <path d="M12 3a7 7 0 0 0-7 7v1a4 4 0 0 0-2 3.5v1A3.5 3.5 0 0 0 6.5 19H8v-8H5v-1a7 7 0 0 1 14 0v1h-3v8h2a3 3 0 0 1-3 3h-3" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.2 15a1.7 1.7 0 0 0-1.51-1H2.6v-4h.09A1.7 1.7 0 0 0 4.2 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 8.6 4a1.7 1.7 0 0 0 1-1.51V2.4h4v.09A1.7 1.7 0 0 0 14.6 4a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.6 9a1.7 1.7 0 0 0 1.51 1h.09v4h-.09A1.7 1.7 0 0 0 19.4 15Z" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  arrow: (
    <>
      <path d="m5 12 14 0M14 7l5 5-5 5" />
    </>
  ),
  bolt: <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  flame: (
    <path d="M12 22c4 0 7-3 7-7 0-3-1.5-5.5-4-8 .1 2-1 3.6-2.5 4.5.1-4-2-7-5.5-9.5.4 4-2 6.5-2 10 0 5 3 10 7 10Zm0-2c-1.7 0-3-1.3-3-3 0-1.5 1-2.6 2.5-4.3.1 1.4.8 2.2 1.7 2.8.4-.6.7-1.2.8-2 1 1.1 1.5 2.2 1.5 3.5 0 1.7-1.5 3-3.5 3Z" />
  ),
  send: (
    <>
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
      <path d="M22 2 11 13" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  trash: (
    <>
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  droplet: (
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  ),
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const navItems: { label: string; icon: IconName }[] = [
  { label: "Overview", icon: "grid" },
  { label: "Nutrition", icon: "nutrition" },
  { label: "Training", icon: "training" },
  { label: "Progress", icon: "chart" },
  { label: "AI Coach", icon: "coach" },
];

interface LoggedMeal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface ExerciseItem {
  id: string;
  name: string;
  sets: string;
  weight: string;
  totalSets: number;
  doneSets: number;
}

const splitWorkouts: Record<string, { title: string; subtitle: string; time: string; focus: string; exercises: ExerciseItem[] }> = {
  Push: {
    title: "Push · Strength",
    subtitle: "Heavy compound chest, shoulders & triceps",
    time: "52 min",
    focus: "Chest & Anterior Delts",
    exercises: [
      { id: "e1", name: "Barbell bench press", sets: "4 × 6", weight: "85 kg", totalSets: 4, doneSets: 4 },
      { id: "e2", name: "Incline dumbbell press", sets: "3 × 10", weight: "32 kg", totalSets: 3, doneSets: 2 },
      { id: "e3", name: "Cable lateral raise", sets: "3 × 12", weight: "9 kg", totalSets: 3, doneSets: 0 },
      { id: "e4", name: "Tricep rope pushdown", sets: "3 × 15", weight: "24 kg", totalSets: 3, doneSets: 0 },
    ],
  },
  Pull: {
    title: "Pull · Hypertrophy",
    subtitle: "Vertical pulling, upper back density & biceps",
    time: "55 min",
    focus: "Lats & Mid-Traps",
    exercises: [
      { id: "e5", name: "Weighted pull-ups", sets: "4 × 6", weight: "+15 kg", totalSets: 4, doneSets: 0 },
      { id: "e6", name: "Barbell bent-over row", sets: "3 × 8", weight: "80 kg", totalSets: 3, doneSets: 0 },
      { id: "e7", name: "Chest-supported T-bar row", sets: "3 × 10", weight: "50 kg", totalSets: 3, doneSets: 0 },
      { id: "e8", name: "Incline DB bicep curls", sets: "3 × 12", weight: "14 kg", totalSets: 3, doneSets: 0 },
    ],
  },
  Legs: {
    title: "Legs · Power",
    subtitle: "Quad drive, posterior chain & calves",
    time: "58 min",
    focus: "Quads & Hamstrings",
    exercises: [
      { id: "e9", name: "Barbell back squat", sets: "4 × 6", weight: "125 kg", totalSets: 4, doneSets: 0 },
      { id: "e10", name: "Romanian deadlift", sets: "3 × 8", weight: "110 kg", totalSets: 3, doneSets: 0 },
      { id: "e11", name: "Leg press 45°", sets: "3 × 12", weight: "200 kg", totalSets: 3, doneSets: 0 },
      { id: "e12", name: "Standing calf raise", sets: "4 × 15", weight: "75 kg", totalSets: 4, doneSets: 0 },
    ],
  },
  Rest: {
    title: "Active Recovery",
    subtitle: "Parasympathetic tone, mobility & gentle bloodflow",
    time: "30 min",
    focus: "Central Nervous System Recovery",
    exercises: [
      { id: "e13", name: "Outdoor recovery walk", sets: "1 × 35 min", weight: "Bodyweight", totalSets: 1, doneSets: 1 },
      { id: "e14", name: "Thoracic spine & hip flow", sets: "1 × 15 min", weight: "Band", totalSets: 1, doneSets: 1 },
      { id: "e15", name: "Electrolyte & hydration replenishment", sets: "3.5 L target", weight: "Optimal", totalSets: 1, doneSets: 1 },
    ],
  },
  Upper: {
    title: "Upper · Density",
    subtitle: "Antagonist pairings, shoulder capped pump",
    time: "50 min",
    focus: "Upper Body Hypertrophy",
    exercises: [
      { id: "e16", name: "Incline barbell press", sets: "4 × 8", weight: "75 kg", totalSets: 4, doneSets: 0 },
      { id: "e17", name: "Neutral-grip lat pulldown", sets: "4 × 10", weight: "70 kg", totalSets: 4, doneSets: 0 },
      { id: "e18", name: "Seated dumbbell shoulder press", sets: "3 × 10", weight: "26 kg", totalSets: 3, doneSets: 0 },
      { id: "e19", name: "Cable face pulls", sets: "3 × 15", weight: "18 kg", totalSets: 3, doneSets: 0 },
    ],
  },
};

const curatedQuickFoods = [
  { name: "Huel Black Edition (2 scoops)", calories: 400, protein: 40, carbs: 24, fats: 18 },
  { name: "Grilled Chicken & Jasmine Rice (200g)", calories: 540, protein: 48, carbs: 62, fats: 8 },
  { name: "Greek Yogurt Bowl w/ Blueberries", calories: 280, protein: 26, carbs: 32, fats: 4 },
  { name: "Whey Isolate Shake with Banana", calories: 240, protein: 30, carbs: 26, fats: 2 },
  { name: "Salmon Fillet & Roasted Potatoes", calories: 510, protein: 38, carbs: 40, fats: 20 },
];

export default function App() {
  const [active, setActive] = useState("Overview");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Targets
  const [calorieBudget] = useState(2400);
  const [proteinTarget] = useState(180);
  const [carbsTarget] = useState(280);
  const [fatsTarget] = useState(70);

  // Real Meal Logging State
  const [meals, setMeals] = useState<LoggedMeal[]>([
    { id: "m1", name: "Oats, Blueberries & Whey", time: "08:15 AM", calories: 450, protein: 36, carbs: 58, fats: 8 },
    { id: "m2", name: "Grilled Chicken, Rice & Greens", time: "12:45 PM", calories: 580, protein: 50, carbs: 64, fats: 10 },
    { id: "m3", name: "Huel Black Edition Shake", time: "03:30 PM", calories: 400, protein: 40, carbs: 24, fats: 18 },
  ]);
  const [logMealSheetOpen, setLogMealSheetOpen] = useState(false);
  const [customFoodName, setCustomFoodName] = useState("");
  const [customCalories, setCustomCalories] = useState("400");
  const [customProtein, setCustomProtein] = useState("35");
  const [customCarbs, setCustomCarbs] = useState("40");
  const [customFats, setCustomFats] = useState("10");

  // Hydration state
  const [waterMl, setWaterMl] = useState(2500);

  // Training state
  const [selectedSplit, setSelectedSplit] = useState("Push");
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [completedSets, setCompletedSets] = useState(2);
  const [workoutSeconds, setWorkoutSeconds] = useState(1122); // 18m 42s
  const [streakDays, setStreakDays] = useState(12);

  // AI Coach state
  const [message, setMessage] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [conversation, setConversation] = useState<{ role: "coach" | "user"; text: string }[]>([]);
  const coachBodyRef = useRef<HTMLDivElement>(null);

  // Total macros calculation
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFats = meals.reduce((sum, m) => sum + m.fats, 0);

  const remainingKcal = Math.max(0, calorieBudget - totalCalories);
  const caloriePercent = Math.min(100, Math.round((totalCalories / calorieBudget) * 100));

  // Timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (workoutOpen) {
      timer = setInterval(() => {
        setWorkoutSeconds((sec) => sec + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [workoutOpen]);

  // Scroll coach messages
  useEffect(() => {
    if (coachBodyRef.current) {
      coachBodyRef.current.scrollTop = coachBodyRef.current.scrollHeight;
    }
  }, [conversation, isAiThinking]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((cur) => (cur === msg ? null : cur));
    }, 2800);
  };

  const handleAddQuickFood = (food: { name: string; calories: number; protein: number; carbs: number; fats: number }) => {
    const newMeal: LoggedMeal = {
      id: Date.now().toString(),
      name: food.name,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
    };
    setMeals((prev) => [...prev, newMeal]);
    setLogMealSheetOpen(false);
    showToast(`Logged: ${food.name} (+${food.protein}g protein)`);
  };

  const handleAddCustomMeal = (e: FormEvent) => {
    e.preventDefault();
    if (!customFoodName.trim()) return;

    const newMeal: LoggedMeal = {
      id: Date.now().toString(),
      name: customFoodName.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      calories: parseInt(customCalories) || 0,
      protein: parseInt(customProtein) || 0,
      carbs: parseInt(customCarbs) || 0,
      fats: parseInt(customFats) || 0,
    };
    setMeals((prev) => [...prev, newMeal]);
    setCustomFoodName("");
    setLogMealSheetOpen(false);
    showToast(`Logged: ${newMeal.name}`);
  };

  const handleRemoveMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    showToast("Meal removed from log");
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || message).trim();
    if (!textToSend) return;

    const newConvo = [...conversation, { role: "user" as const, text: textToSend }];
    setConversation(newConvo);
    setMessage("");
    setIsAiThinking(true);

    try {
      const historyFormatted = newConvo.slice(0, -1).map((m) => ({
        role: (m.role === "coach" ? "model" : "user") as "model" | "user",
        parts: [{ text: m.text }],
      }));

      const context = `User: Jamie Doe. Daily Calories: ${totalCalories}/${calorieBudget} kcal. Protein: ${totalProtein}/${proteinTarget}g. Carbs: ${totalCarbs}/${carbsTarget}g. Active split: ${selectedSplit}. Readiness score: 84/100 (Primed).`;

      const reply = await chatWithGymBro(historyFormatted, textToSend, context);
      setConversation((c) => [...c, { role: "coach", text: reply || "Keep that discipline high, Jamie. Quality work only!" }]);
    } catch {
      setConversation((c) => [
        ...c,
        {
          role: "coach",
          text: `Solid question! You're currently sitting at ${totalProtein}g of your ${proteinTarget}g protein target with an 84 Recovery readiness. Push that incline press hard and make sure you rehydrate with electrolytes!`,
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const currentWorkout = splitWorkouts[selectedSplit] || splitWorkouts["Push"];

  return (
    <div className="app-shell">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-3.5 py-2 rounded-full bg-[#1b2030] border border-[#a9b9ff40] text-[#f5f5f7] text-[11px] font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a9b9ff]" />
          {toastMsg}
        </div>
      )}

      {/* Pure Mobile Header */}
      <header>
        <div className="mobile-brand">
          <div className="brand-mark">
            <span />
          </div>
          APEX
        </div>

        <div className="header-actions">
          <div className="streak">
            <Icon name="flame" size={15} />
            <b>{streakDays}</b>
          </div>
          <button
            className="icon-button"
            aria-label="Notifications"
            onClick={() => showToast("Readiness optimal: 84 Primed score.")}
          >
            <Icon name="bell" size={16} />
            <i />
          </button>
          <div
            className="avatar small cursor-pointer"
            onClick={() => setActive("Settings")}
          >
            JD
          </div>
        </div>
      </header>

      {/* Main Content View Container */}
      <main>
        <div className="content">
          {/* =================================================================
              VIEW 1: OVERVIEW (TODAY)
              ================================================================= */}
          {active === "Overview" && (
            <>
              <section className="intro">
                <div>
                  <p className="eyebrow">Tuesday protocol · Week 6</p>
                  <h1>Let’s get <span>after it.</span></h1>
                  <p>Good morning, Jamie. You’re on pace today.</p>
                </div>
                <button className="primary-button" onClick={() => setWorkoutOpen(true)}>
                  <Icon name="bolt" size={16} />
                  Start workout
                </button>
              </section>

              <button className="coach-preview" onClick={() => setActive("AI Coach")}>
                <span className="coach-preview-icon">
                  <Icon name="coach" size={16} />
                </span>
                <span>
                  <small>YOUR DAILY EDGE</small>
                  <strong>Recovered. Ready to push.</strong>
                  <span>Your coach has dialed in today's protocol.</span>
                </span>
                <Icon name="chevron" size={16} />
              </button>

              <section className="metric-grid">
                <article className="calorie-card">
                  <div className="card-heading">
                    <div>
                      <p>Daily energy</p>
                      <h2>Calories</h2>
                    </div>
                    <span className="status-pill">On track</span>
                  </div>
                  <div className="calorie-main">
                    <div
                      className="calorie-ring"
                      style={{ "--progress": `${caloriePercent}%` } as React.CSSProperties}
                    >
                      <div>
                        <b>{totalCalories.toLocaleString()}</b>
                        <span>of {calorieBudget.toLocaleString()} kcal</span>
                      </div>
                    </div>
                    <div className="remaining">
                      <p>Remaining today</p>
                      <strong>
                        {remainingKcal.toLocaleString()} <span>kcal</span>
                      </strong>
                      <small>
                        <i /> Target adjusts with live output
                      </small>
                    </div>
                  </div>
                </article>

                <article className="macro-card">
                  <div className="card-heading">
                    <div>
                      <p>Fuel breakdown</p>
                      <h2>Macros</h2>
                    </div>
                    <button onClick={() => setLogMealSheetOpen(true)}>
                      <Icon name="plus" size={13} />
                      Log meal
                    </button>
                  </div>

                  <div className="macro-list">
                    <div className="macro-row">
                      <div className="macro-value">
                        <strong>
                          <span style={{ background: "#a9b9ff" }} /> Protein
                        </strong>
                        <b>
                          {totalProtein}g
                          <small> / {proteinTarget}g</small>
                        </b>
                      </div>
                      <div className="progress-track">
                        <i style={{ width: `${Math.min(100, Math.round((totalProtein / proteinTarget) * 100))}%`, background: "#a9b9ff" }} />
                      </div>
                    </div>

                    <div className="macro-row">
                      <div className="macro-value">
                        <strong>
                          <span style={{ background: "#c6bedc" }} /> Carbs
                        </strong>
                        <b>
                          {totalCarbs}g
                          <small> / {carbsTarget}g</small>
                        </b>
                      </div>
                      <div className="progress-track">
                        <i style={{ width: `${Math.min(100, Math.round((totalCarbs / carbsTarget) * 100))}%`, background: "#c6bedc" }} />
                      </div>
                    </div>

                    <div className="macro-row">
                      <div className="macro-value">
                        <strong>
                          <span style={{ background: "#d4bba4" }} /> Fats
                        </strong>
                        <b>
                          {totalFats}g
                          <small> / {fatsTarget}g</small>
                        </b>
                      </div>
                      <div className="progress-track">
                        <i style={{ width: `${Math.min(100, Math.round((totalFats / fatsTarget) * 100))}%`, background: "#d4bba4" }} />
                      </div>
                    </div>
                  </div>
                </article>
              </section>

              <section className="lower-grid">
                <article className="workout-card">
                  <div className="card-heading">
                    <div>
                      <p>Today’s training</p>
                      <h2>{currentWorkout.title}</h2>
                    </div>
                    <span className="time-tag">
                      <Icon name="clock" size={13} />
                      {currentWorkout.time}
                    </span>
                  </div>

                  <div className="workout-meta">
                    <div><span>{currentWorkout.exercises.length}</span> exercises</div>
                    <i />
                    <div><span>13</span> working sets</div>
                    <i />
                    <div><span>{currentWorkout.focus}</span></div>
                  </div>

                  <button className="workout-start" onClick={() => setWorkoutOpen(true)}>
                    <span>Start session</span>
                    <span className="session-arrow">
                      <Icon name="arrow" size={16} />
                    </span>
                  </button>

                  <div className="exercise-list">
                    {currentWorkout.exercises.slice(0, 3).map((exercise, index) => (
                      <div className="exercise-row" key={exercise.id}>
                        <span className="exercise-number">{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <strong>{exercise.name}</strong>
                          <span>{exercise.sets} · {exercise.weight}</span>
                        </div>
                        <div className="set-dots">
                          {[...Array(exercise.totalSets)].map((_, dotIdx) => (
                            <i key={dotIdx} className={dotIdx < exercise.doneSets ? "complete" : ""} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="text-button" onClick={() => setActive("Training")}>
                    View training plan <Icon name="arrow" size={15} />
                  </button>
                </article>

                <article className="recovery-card">
                  <div className="card-heading">
                    <div>
                      <p>Readiness</p>
                      <h2>Recovery</h2>
                    </div>
                    <span className="score">84</span>
                  </div>

                  <div className="recovery-chart">
                    {[55, 68, 61, 78, 72, 88, 84].map((height, index) => (
                      <div key={index}>
                        <i style={{ height: `${height}%` }} className={index === 6 ? "today" : ""} />
                        <span>{["W", "T", "F", "S", "S", "M", "T"][index]}</span>
                      </div>
                    ))}
                  </div>

                  <div className="recovery-note">
                    <span>
                      <Icon name="bolt" size={15} />
                    </span>
                    <p>
                      <strong>Primed to perform</strong>
                      Your sleep and load balance support a high-output session.
                    </p>
                  </div>
                </article>
              </section>
            </>
          )}

          {/* =================================================================
              VIEW 2: NUTRITION (REAL MEAL LOGGING WORKFLOW)
              ================================================================= */}
          {active === "Nutrition" && (
            <>
              <section className="intro">
                <div>
                  <p className="eyebrow">Fuel Intelligence</p>
                  <h1>Fuel with <span>intent.</span></h1>
                  <p>Daily energy and macro targets, balanced for peak output.</p>
                </div>
                <button className="primary-button" onClick={() => setLogMealSheetOpen(true)}>
                  <Icon name="plus" size={16} />
                  Log food
                </button>
              </section>

              <section className="metric-grid">
                <article className="calorie-card">
                  <div className="card-heading">
                    <div>
                      <p>Energy Remaining</p>
                      <h2>{remainingKcal.toLocaleString()} kcal</h2>
                    </div>
                    <span className="status-pill">{caloriePercent}% consumed</span>
                  </div>
                  <div className="calorie-main">
                    <div
                      className="calorie-ring"
                      style={{ "--progress": `${caloriePercent}%` } as React.CSSProperties}
                    >
                      <div>
                        <b>{totalCalories}</b>
                        <span>of {calorieBudget}</span>
                      </div>
                    </div>
                    <div className="remaining">
                      <p>Consumed so far</p>
                      <strong>{totalCalories} <span>kcal</span></strong>
                      <small><i /> {meals.length} meals logged today</small>
                    </div>
                  </div>
                </article>

                <article className="macro-card">
                  <div className="card-heading">
                    <div>
                      <p>Target Breakdown</p>
                      <h2>Macros</h2>
                    </div>
                    <button onClick={() => setLogMealSheetOpen(true)}>
                      <Icon name="plus" size={12} /> Add
                    </button>
                  </div>

                  <div className="macro-list">
                    <div className="macro-row">
                      <div className="macro-value">
                        <strong><span style={{ background: "#a9b9ff" }} /> Protein</strong>
                        <b>{totalProtein}g <small>/ {proteinTarget}g</small></b>
                      </div>
                      <div className="progress-track">
                        <i style={{ width: `${Math.min(100, Math.round((totalProtein / proteinTarget) * 100))}%`, background: "#a9b9ff" }} />
                      </div>
                    </div>

                    <div className="macro-row">
                      <div className="macro-value">
                        <strong><span style={{ background: "#c6bedc" }} /> Carbs</strong>
                        <b>{totalCarbs}g <small>/ {carbsTarget}g</small></b>
                      </div>
                      <div className="progress-track">
                        <i style={{ width: `${Math.min(100, Math.round((totalCarbs / carbsTarget) * 100))}%`, background: "#c6bedc" }} />
                      </div>
                    </div>

                    <div className="macro-row">
                      <div className="macro-value">
                        <strong><span style={{ background: "#d4bba4" }} /> Fats</strong>
                        <b>{totalFats}g <small>/ {fatsTarget}g</small></b>
                      </div>
                      <div className="progress-track">
                        <i style={{ width: `${Math.min(100, Math.round((totalFats / fatsTarget) * 100))}%`, background: "#d4bba4" }} />
                      </div>
                    </div>
                  </div>
                </article>
              </section>

              {/* Meals Timeline */}
              <article className="workout-card mt-3.5">
                <div className="card-heading">
                  <div>
                    <p>Today's Log</p>
                    <h2>Logged Meals</h2>
                  </div>
                  <span className="time-tag">
                    <Icon name="clock" size={12} /> {meals.length} entries
                  </span>
                </div>

                <div className="mt-2.5">
                  {meals.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#8c919e]">
                      No meals logged yet today. Tap "+ Log food" to start.
                    </div>
                  ) : (
                    meals.map((meal) => (
                      <div className="meal-row" key={meal.id}>
                        <div>
                          <strong>{meal.name}</strong>
                          <span>
                            {meal.time} · {meal.calories} kcal · {meal.protein}g P · {meal.carbs}g C · {meal.fats}g F
                          </span>
                        </div>
                        <button
                          aria-label="Remove meal"
                          onClick={() => handleRemoveMeal(meal.id)}
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </article>

              {/* Hydration Tracker */}
              <article className="recovery-card mt-3.5">
                <div className="card-heading">
                  <div>
                    <p>Hydration Status</p>
                    <h2>{(waterMl / 1000).toFixed(2)}L / 3.50L</h2>
                  </div>
                  <button
                    onClick={() => {
                      setWaterMl((w) => w + 250);
                      showToast("+250ml logged");
                    }}
                  >
                    <Icon name="plus" size={12} /> +250 ml
                  </button>
                </div>
                <div className="w-full bg-[#20232c] h-2.5 rounded-full overflow-hidden mt-3">
                  <div
                    className="bg-[#a9b9ff] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (waterMl / 3500) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#727782] mt-2 font-mono">
                  <span>Target: 3.5 Litres</span>
                  <span>{Math.round((waterMl / 3500) * 100)}% complete</span>
                </div>
              </article>
            </>
          )}

          {/* =================================================================
              VIEW 3: TRAINING (REAL WORKOUT WORKFLOW & SPLIT SELECTOR)
              ================================================================= */}
          {active === "Training" && (
            <>
              <section className="intro">
                <div>
                  <p className="eyebrow">Program Architecture</p>
                  <h1>Make every <span>rep count.</span></h1>
                  <p>Targeted hypertrophy and progressive overload tracking.</p>
                </div>
                <button className="primary-button" onClick={() => setWorkoutOpen(true)}>
                  <Icon name="bolt" size={16} />
                  Start session
                </button>
              </section>

              {/* Split Switcher */}
              <div className="split-tabs">
                {["Push", "Pull", "Legs", "Upper", "Rest"].map((split) => (
                  <button
                    key={split}
                    className={`split-pill ${selectedSplit === split ? "active" : ""}`}
                    onClick={() => {
                      setSelectedSplit(split);
                      showToast(`Switched to ${split} Protocol`);
                    }}
                  >
                    {split}
                  </button>
                ))}
              </div>

              {/* Active Day Protocol Card */}
              <article className="workout-card">
                <div className="card-heading">
                  <div>
                    <p>{selectedSplit} Protocol</p>
                    <h2>{currentWorkout.title}</h2>
                  </div>
                  <span className="time-tag">
                    <Icon name="clock" size={13} /> {currentWorkout.time}
                  </span>
                </div>

                <div className="workout-meta">
                  <div><span>{currentWorkout.exercises.length}</span> exercises</div>
                  <i />
                  <div><span>Focus</span> {currentWorkout.focus}</div>
                </div>

                <button className="workout-start" onClick={() => setWorkoutOpen(true)}>
                  <span>Launch Live Workout Tracker</span>
                  <span className="session-arrow">
                    <Icon name="arrow" size={16} />
                  </span>
                </button>

                <div className="exercise-list">
                  {currentWorkout.exercises.map((exercise, index) => (
                    <div className="exercise-row" key={exercise.id}>
                      <span className="exercise-number">{String(index + 1).padStart(2, "0")}</span>
                      <div>
                        <strong>{exercise.name}</strong>
                        <span>{exercise.sets} · {exercise.weight}</span>
                      </div>
                      <div className="set-dots">
                        {[...Array(exercise.totalSets)].map((_, dotIdx) => (
                          <i
                            key={dotIdx}
                            className={dotIdx < exercise.doneSets ? "complete cursor-pointer" : "cursor-pointer"}
                            onClick={() => {
                              exercise.doneSets = dotIdx < exercise.doneSets ? dotIdx : dotIdx + 1;
                              showToast(`Set ${dotIdx + 1} updated`);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="text-button" onClick={() => setWorkoutOpen(true)}>
                  Open full live workout sheet <Icon name="arrow" size={15} />
                </button>
              </article>

              {/* Weekly Split Adherence */}
              <article className="recovery-card mt-3.5">
                <div className="card-heading">
                  <div>
                    <p>Consistency</p>
                    <h2>Weekly Training Frequency</h2>
                  </div>
                  <span className="status-pill">4 of 5 logged</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 mt-3 text-center">
                  {[
                    { day: "M", split: "Push", done: true },
                    { day: "T", split: "Pull", done: true },
                    { day: "W", split: "Legs", done: true },
                    { day: "T", split: "Rest", done: true },
                    { day: "F", split: "Upper", done: false },
                    { day: "S", split: "Lower", done: false },
                    { day: "S", split: "Rest", done: false },
                  ].map((s, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border ${
                        s.done
                          ? "bg-[#252a3d] border-[#4a5680] text-[#a9b9ff]"
                          : "bg-[#161822] border-[#222530] text-[#6b7080]"
                      }`}
                    >
                      <span className="block text-[10px] font-mono font-bold">{s.day}</span>
                      <span className="block text-[8px] mt-0.5">{s.split}</span>
                    </div>
                  ))}
                </div>
              </article>
            </>
          )}

          {/* =================================================================
              VIEW 4: PROGRESS (RECOVERY & STRENGTH ANALYTICS)
              ================================================================= */}
          {active === "Progress" && (
            <>
              <section className="intro">
                <div>
                  <p className="eyebrow">Performance Metrics</p>
                  <h1>The work <span>adds up.</span></h1>
                  <p>Readiness, volume progression, and body composition analytics.</p>
                </div>
                <button
                  className="primary-button"
                  onClick={() => showToast("Progress snapshot generated")}
                >
                  <Icon name="chart" size={16} />
                  Summary report
                </button>
              </section>

              {/* Recovery Card */}
              <article className="recovery-card">
                <div className="card-heading">
                  <div>
                    <p>Daily Readiness</p>
                    <h2>Recovery Score</h2>
                  </div>
                  <span className="score">84</span>
                </div>

                <div className="recovery-chart">
                  {[55, 68, 61, 78, 72, 88, 84].map((height, index) => (
                    <div key={index}>
                      <i style={{ height: `${height}%` }} className={index === 6 ? "today" : ""} />
                      <span>{["W", "T", "F", "S", "S", "M", "T"][index]}</span>
                    </div>
                  ))}
                </div>

                <div className="recovery-note">
                  <span>
                    <Icon name="bolt" size={15} />
                  </span>
                  <p>
                    <strong>Primed to perform</strong>
                    Sleep score: 8.2 hrs · HRV: 68 ms. Your central nervous system is ready for high intensity.
                  </p>
                </div>
              </article>

              {/* 1RM Strength Progression */}
              <article className="workout-card mt-3.5">
                <div className="card-heading">
                  <div>
                    <p>Strength Milestones</p>
                    <h2>Estimated 1RM Bench</h2>
                  </div>
                  <span className="status-pill">+4.2% (30d)</span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold font-mono text-[#f5f5f7]">112.5 kg</span>
                  <span className="text-[11px] text-[#727782]">from 108.0 kg on Apr 20</span>
                </div>
                <div className="w-full bg-[#20232c] h-2 rounded-full overflow-hidden mt-3">
                  <div className="bg-[#a9b9ff] h-full w-[88%] rounded-full" />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#1f222a] text-center font-mono">
                  <div className="p-2 rounded bg-[#171b26]">
                    <span className="text-[9px] text-[#727782] block">Squat 1RM</span>
                    <strong className="text-xs text-[#e6e9f2] block mt-0.5">145.0 kg</strong>
                  </div>
                  <div className="p-2 rounded bg-[#171b26]">
                    <span className="text-[9px] text-[#727782] block">Deadlift 1RM</span>
                    <strong className="text-xs text-[#e6e9f2] block mt-0.5">180.0 kg</strong>
                  </div>
                  <div className="p-2 rounded bg-[#171b26]">
                    <span className="text-[9px] text-[#727782] block">OHP 1RM</span>
                    <strong className="text-xs text-[#e6e9f2] block mt-0.5">72.5 kg</strong>
                  </div>
                </div>
              </article>

              {/* Volume Load */}
              <article className="calorie-card mt-3.5">
                <div className="card-heading">
                  <div>
                    <p>Volume Load</p>
                    <h2>28,450 kg Lifted</h2>
                  </div>
                  <span className="time-tag">This week</span>
                </div>
                <span className="text-xs text-[#8c919e] mt-1 block">
                  On pace to surpass last week's tonnage by +1,200 kg. Progressive overload intact.
                </span>
              </article>
            </>
          )}

          {/* =================================================================
              VIEW 5: AI COACH (FULL MOBILE CHAT INTERFACE)
              ================================================================= */}
          {active === "AI Coach" && (
            <>
              <section className="intro">
                <div>
                  <p className="eyebrow">APEX Intelligence</p>
                  <h1>Your corner. <span>Always.</span></h1>
                  <p>Training, nutrition, and recovery guidance grounded in science.</p>
                </div>
              </section>

              <aside className="coach-panel">
                <div className="coach-header">
                  <div className="coach-orb">
                    <span />
                  </div>
                  <div>
                    <p>APEX Intelligence</p>
                    <h2>Coach</h2>
                  </div>
                  <span className="live-status">
                    <i /> Live AI
                  </span>
                </div>

                <div className="coach-body" ref={coachBodyRef}>
                  <p className="coach-time">TODAY, 8:42 AM</p>

                  <div className="coach-message">
                    <p>
                      Good morning, Jamie. Your recovery is{" "}
                      <strong>8% above your 30-day average.</strong>
                    </p>
                    <p>
                      I’d keep the planned bench volume, but aim for an RPE 8 ceiling today.
                      You’re set up for quality work—not grinders.
                    </p>
                  </div>

                  <div className="insight-card">
                    <span>
                      <Icon name="chart" size={16} />
                    </span>
                    <div>
                      <small>PERFORMANCE INSIGHT</small>
                      <strong>Bench trend is up 4.2%</strong>
                      <p>Estimated 1RM · 112.5 kg</p>
                    </div>
                  </div>

                  {conversation.map((msg, index) =>
                    msg.role === "user" ? (
                      <div className="user-message" key={index}>
                        {msg.text}
                      </div>
                    ) : (
                      <div className="coach-message compact" key={index}>
                        {msg.text}
                      </div>
                    )
                  )}

                  {isAiThinking && (
                    <div className="coach-message compact flex items-center gap-2 text-[#a9b9ff] text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#a9b9ff] animate-ping" />
                      Coach is analyzing your metrics...
                    </div>
                  )}
                </div>

                <div className="quick-prompts">
                  <button onClick={() => handleSendMessage("Adjust today’s workout")}>
                    Adjust workout
                  </button>
                  <button onClick={() => handleSendMessage("What should I eat next?")}>
                    What to eat next?
                  </button>
                  <button onClick={() => handleSendMessage("Review my protein intake")}>
                    Protein review
                  </button>
                </div>

                <form className="coach-input" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask your coach..."
                    aria-label="Message your coach"
                    disabled={isAiThinking}
                  />
                  <button
                    type="submit"
                    aria-label="Send message"
                    disabled={isAiThinking || !message.trim()}
                  >
                    <Icon name="send" size={14} />
                  </button>
                </form>
              </aside>
            </>
          )}

          {/* =================================================================
              VIEW 6: SETTINGS (ATHLETE PARAMETERS)
              ================================================================= */}
          {active === "Settings" && (
            <>
              <section className="intro">
                <div>
                  <p className="eyebrow">Account Configuration</p>
                  <h1>Athlete <span>Parameters.</span></h1>
                  <p>Profile targets and automated split configuration.</p>
                </div>
              </section>

              <article className="calorie-card">
                <div className="card-heading">
                  <div>
                    <p>Athlete Profile</p>
                    <h2>Jamie Doe</h2>
                  </div>
                  <span className="status-pill">Active</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mt-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#181a22] border border-[#232733]">
                    <span className="text-[#6d7280] block text-[10px]">Bodyweight</span>
                    <strong className="text-[#f5f5f7] text-sm block mt-0.5">82.4 kg</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#181a22] border border-[#232733]">
                    <span className="text-[#6d7280] block text-[10px]">Daily Energy</span>
                    <strong className="text-[#f5f5f7] text-sm block mt-0.5">2,400 kcal</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#181a22] border border-[#232733]">
                    <span className="text-[#6d7280] block text-[10px]">Protein Target</span>
                    <strong className="text-[#f5f5f7] text-sm block mt-0.5">180g (2.2g/kg)</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#181a22] border border-[#232733]">
                    <span className="text-[#6d7280] block text-[10px]">Active Split</span>
                    <strong className="text-[#f5f5f7] text-sm block mt-0.5">Push / Pull / Legs</strong>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#232733] flex justify-between items-center text-xs">
                  <span className="text-[#727782]">Target: Hypertrophy & Strength</span>
                  <button
                    className="text-[#a9b9ff] font-semibold"
                    onClick={() => showToast("Parameters saved successfully")}
                  >
                    Save Changes
                  </button>
                </div>
              </article>
            </>
          )}
        </div>
      </main>

      {/* Floating Pill Mobile Navigation */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <button
            key={item.label}
            aria-current={active === item.label ? "page" : undefined}
            className={active === item.label ? "active" : ""}
            onClick={() => {
              setActive(item.label);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Icon name={item.icon} />
            <span>
              {item.label === "Overview"
                ? "Today"
                : item.label === "AI Coach"
                ? "Coach"
                : item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* MODAL 1: MEAL LOGGING SHEET */}
      {logMealSheetOpen && (
        <div className="modal-backdrop" onMouseDown={() => setLogMealSheetOpen(false)}>
          <section
            className="workout-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Log Food Item"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-top">
              <div>
                <p>NUTRITION TRACKER</p>
                <h2>Log Food Item</h2>
              </div>
              <button aria-label="Close" onClick={() => setLogMealSheetOpen(false)}>
                <Icon name="close" size={18} />
              </button>
            </div>

            {/* Quick Add Athletic Fuels */}
            <div className="active-exercise">
              <span>ONE-TAP ATHLETIC FUELS</span>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {curatedQuickFoods.map((f) => (
                  <div
                    key={f.name}
                    onClick={() => handleAddQuickFood(f)}
                    className="p-3 rounded-xl bg-[#181b26] border border-[#252936] flex items-center justify-between cursor-pointer hover:border-[#a9b9ff40] transition"
                  >
                    <div>
                      <strong className="text-xs text-[#f5f5f7] block">{f.name}</strong>
                      <span className="text-[10px] text-[#8c919e] font-mono mt-0.5 block">
                        {f.calories} kcal · {f.protein}g P · {f.carbs}g C · {f.fats}g F
                      </span>
                    </div>
                    <button className="w-6 h-6 rounded-full bg-[#a9b9ff] text-[#121626] grid place-items-center">
                      <Icon name="plus" size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Custom Food Form */}
              <span className="block mt-4">CUSTOM MEAL ENTRY</span>
              <form onSubmit={handleAddCustomMeal} className="mt-2 space-y-2.5">
                <input
                  type="text"
                  placeholder="Meal description (e.g. Steak & Sweet Potato)"
                  value={customFoodName}
                  onChange={(e) => setCustomFoodName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#181b26] border border-[#252936] text-xs text-[#f5f5f7] outline-none"
                  required
                />
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[9px] text-[#727782] block mb-1">Calories</label>
                    <input
                      type="number"
                      value={customCalories}
                      onChange={(e) => setCustomCalories(e.target.value)}
                      className="w-full h-9 px-2 rounded-lg bg-[#181b26] border border-[#252936] text-xs font-mono text-[#f5f5f7] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-[#727782] block mb-1">Protein (g)</label>
                    <input
                      type="number"
                      value={customProtein}
                      onChange={(e) => setCustomProtein(e.target.value)}
                      className="w-full h-9 px-2 rounded-lg bg-[#181b26] border border-[#252936] text-xs font-mono text-[#f5f5f7] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-[#727782] block mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      value={customCarbs}
                      onChange={(e) => setCustomCarbs(e.target.value)}
                      className="w-full h-9 px-2 rounded-lg bg-[#181b26] border border-[#252936] text-xs font-mono text-[#f5f5f7] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-[#727782] block mb-1">Fats (g)</label>
                    <input
                      type="number"
                      value={customFats}
                      onChange={(e) => setCustomFats(e.target.value)}
                      className="w-full h-9 px-2 rounded-lg bg-[#181b26] border border-[#252936] text-xs font-mono text-[#f5f5f7] outline-none"
                    />
                  </div>
                </div>

                <button type="submit" className="complete-set">
                  <Icon name="check" size={16} />
                  Add to Today's Log
                </button>
              </form>
            </div>
          </section>
        </div>
      )}

      {/* MODAL 2: LIVE WORKOUT SHEET */}
      {workoutOpen && (
        <div className="modal-backdrop" onMouseDown={() => setWorkoutOpen(false)}>
          <section
            className="workout-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Live Workout Logger"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-top">
              <div>
                <p>LIVE WORKOUT · {formatTimer(workoutSeconds)}</p>
                <h2>{currentWorkout.title}</h2>
              </div>
              <button
                aria-label="Close workout"
                onClick={() => setWorkoutOpen(false)}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="active-exercise">
              <span>ACTIVE MOVEMENT</span>
              <h3>Incline dumbbell press</h3>
              <p>Keep your shoulder blades locked down and drive evenly.</p>

              <div className="set-log">
                {[1, 2, 3].map((set) => {
                  const isDone = set <= completedSets;
                  return (
                    <button
                      key={set}
                      className={isDone ? "done" : ""}
                      onClick={() => {
                        setCompletedSets(isDone ? set - 1 : set);
                        showToast(isDone ? `Set ${set} pending` : `Set ${set} completed!`);
                      }}
                    >
                      <span>SET {set}</span>
                      <strong>
                        32 <small>KG</small>
                      </strong>
                      <b>
                        10 <small>REPS</small>
                      </b>
                      <i>
                        <Icon name="check" size={13} />
                      </i>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              className="complete-set"
              onClick={() => {
                const next = Math.min(3, completedSets + 1);
                setCompletedSets(next);
                if (next === 3) {
                  showToast("Exercise completed! Moving to next exercise.");
                } else {
                  showToast(`Set ${next} completed!`);
                }
              }}
            >
              <Icon name="check" size={16} />
              Complete set {Math.min(3, completedSets + 1)}
            </button>

            <button
              className="w-full mt-2 py-2 text-xs font-semibold text-[#8c919e] hover:text-[#f5f5f7]"
              onClick={() => {
                setWorkoutOpen(false);
                setStreakDays((s) => s + 1);
                showToast("Workout recorded! Streak increased to 13 days.");
              }}
            >
              Finish & Log Entire Session
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
