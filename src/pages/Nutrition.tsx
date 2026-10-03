import React, { useState, useRef, useMemo } from 'react';
import { useAppContext, FoodLog, DailyNutrition } from '../context/AppContext';
import { analyzeFoodImage, searchFoodDatabase } from '../lib/gemini';
import {
  Camera,
  Loader2,
  Trash2,
  Image as ImageIcon,
  Droplets,
  ScanBarcode,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  Plus,
  X,
  Sparkles,
  Check,
  Flame,
  Zap,
  Leaf,
  Coffee,
  Apple
} from 'lucide-react';

type HistoryFilter = 'today' | 'yesterday' | 'week' | 'month' | 'all';
type FoodCategory = 'all' | 'huel' | 'high-protein' | 'meals' | 'plant' | 'snacks';

// Verified, realistic nutritional food library with balanced, accurate protein and macro splits
const VERIFIED_FOOD_CATALOG = [
  // Huel / Complete Nutrition
  { name: 'Huel Black Edition Shake (Salted Caramel)', category: 'huel', cals: 400, p: 40, c: 24, f: 17, serving: '90g powder + 500ml water' },
  { name: 'Huel Daily Greens Superfood Drink', category: 'huel', cals: 50, p: 3, c: 8, f: 1, serving: '1 scoop (15g)' },
  { name: 'Huel Ready-to-Drink (Vanilla)', category: 'huel', cals: 400, p: 35, c: 34, f: 15, serving: '500ml bottle' },
  { name: 'Huel Complete Protein Snack Bar', category: 'huel', cals: 200, p: 20, c: 14, f: 7, serving: '1 bar (52g)' },
  { name: 'Huel Hot & Savoury (Mexican Chilli)', category: 'huel', cals: 400, p: 25, c: 54, f: 9, serving: '2 scoops (95g)' },

  // Lean Proteins & Whole Foods
  { name: 'Grilled Chicken Breast Fillet', category: 'high-protein', cals: 230, p: 44, c: 0, f: 5, serving: '160g cooked' },
  { name: 'Wild Atlantic Salmon Fillet', category: 'high-protein', cals: 340, p: 34, c: 0, f: 22, serving: '170g cooked' },
  { name: 'Extra Lean Grass-fed Minced Beef (5%)', category: 'high-protein', cals: 260, p: 42, c: 0, f: 10, serving: '180g cooked' },
  { name: 'Steamed Cod Loin with Lemon', category: 'high-protein', cals: 150, p: 32, c: 0, f: 1, serving: '180g cooked' },
  { name: 'Whole Free-Range Eggs (2 Large)', category: 'high-protein', cals: 144, p: 13, c: 1, f: 10, serving: '2 large eggs' },
  { name: 'Pure Liquid Egg Whites', category: 'high-protein', cals: 75, p: 16, c: 1, f: 0, serving: '150ml' },
  { name: 'Whey Protein Isolate Shake', category: 'high-protein', cals: 120, p: 25, c: 2, f: 1, serving: '1 scoop (30g) in water' },

  // Complete Athletic Meals
  { name: 'Chicken, Roasted Sweet Potato & Broccoli', category: 'meals', cals: 520, p: 46, c: 58, f: 9, serving: '1 plate meal' },
  { name: 'Salmon & Teriyaki Jasmine Rice Bowl', category: 'meals', cals: 610, p: 38, c: 68, f: 18, serving: '1 large bowl' },
  { name: 'Turkey Breast Avocado & Hummus Wrap', category: 'meals', cals: 480, p: 38, c: 42, f: 16, serving: '1 tortilla wrap' },
  { name: 'Lean Beef Chilli Con Carne & Brown Rice', category: 'meals', cals: 560, p: 44, c: 62, f: 13, serving: '1 bowl' },
  { name: 'Grilled Halloumi & Mediterranean Grain Salad', category: 'meals', cals: 460, p: 22, c: 45, f: 22, serving: '1 plate' },

  // Plant-Based Power
  { name: 'Crispy Organic Tofu & Edamame Soba', category: 'plant', cals: 480, p: 32, c: 56, f: 14, serving: '1 stir-fry bowl' },
  { name: 'Red Lentil Dahl with Basmati Rice', category: 'plant', cals: 440, p: 22, c: 72, f: 6, serving: '1 medium bowl' },
  { name: 'Chickpea & Quinoa Superfood Salad', category: 'plant', cals: 410, p: 18, c: 58, f: 12, serving: '1 meal bowl' },
  { name: 'Plant-Based Pea & Fava Protein Shake', category: 'plant', cals: 130, p: 24, c: 3, f: 2, serving: '1 scoop (32g)' },
  { name: 'Steamed Edamame Pods with Sea Salt', category: 'plant', cals: 150, p: 14, c: 10, f: 6, serving: '1 bowl (120g beans)' },

  // Snacks & Functional Fuel
  { name: 'Icelandic Skyr Greek Yogurt (0% Fat)', category: 'snacks', cals: 110, p: 20, c: 6, f: 0, serving: '170g pot' },
  { name: 'Overnight Rolled Oats with Chia & Berries', category: 'snacks', cals: 310, p: 14, c: 48, f: 7, serving: '1 jar (80g dry)' },
  { name: 'Raw Whole Almonds & Walnuts', category: 'snacks', cals: 190, p: 6, c: 6, f: 16, serving: 'Handful (30g)' },
  { name: 'Toasted Sourdough with Smashed Avocado', category: 'snacks', cals: 280, p: 8, c: 32, f: 14, serving: '1 large slice' },
  { name: 'Cottage Cheese with Honey & Walnuts', category: 'snacks', cals: 210, p: 22, c: 14, f: 6, serving: '200g serving' },
  { name: 'Fresh Banana & Natural Peanut Butter', category: 'snacks', cals: 250, p: 7, c: 34, f: 11, serving: '1 medium fruit + 1 tbsp' }
];

export default function Nutrition() {
  const { nutritionHistory, setNutritionHistory, userProfile, customPlan, showToast } = useAppContext();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('today');
  const [activeCategory, setActiveCategory] = useState<FoodCategory>('all');
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [showScannerOptions, setShowScannerOptions] = useState<{ show: boolean, isBarcode: boolean }>({ show: false, isBarcode: false });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [onlineResults, setOnlineResults] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const barcodeCameraInputRef = useRef<HTMLInputElement>(null);

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  const todayLog: DailyNutrition = nutritionHistory.find((h) => h.date === today) || { date: today, foods: [], water: 0 };

  const todayDayId = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
  const todaysPlan = customPlan[todayDayId] || customPlan['mon'];
  const targetCals = userProfile?.targetCalories || (todaysPlan?.type === 'rest' ? 2400 : 2800);
  const targetProtein = userProfile?.targetProtein || 150;
  const targetCarbs = userProfile?.targetCarbs || 250;
  const targetFats = userProfile?.targetFats || 75;
  const waterTarget = 3000; // ml

  const totalCals = todayLog.foods.reduce((s, f) => s + f.calories, 0);
  const totalProtein = todayLog.foods.reduce((s, f) => s + f.protein, 0);
  const totalCarbs = todayLog.foods.reduce((s, f) => s + f.carbs, 0);
  const totalFats = todayLog.foods.reduce((s, f) => s + f.fats, 0);
  const waterMl = todayLog.water || 0;
  const waterPercent = Math.min((waterMl / waterTarget) * 100, 100);

  // Filter local catalogue by category and search
  const filteredCatalog = useMemo(() => {
    return VERIFIED_FOOD_CATALOG.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesQuery = !searchQuery.trim() || item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  // Online search via Gemini if user wants broader external search
  const searchOnlineDatabase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchingOnline(true);
    setError(null);
    try {
      const results = await searchFoodDatabase(searchQuery);
      setOnlineResults(results || []);
    } catch (err: any) {
      setError(`Search offline or unavailable: ${err.message || err}`);
    } finally {
      setIsSearchingOnline(false);
    }
  };

  const addCatalogFood = (item: typeof VERIFIED_FOOD_CATALOG[0]) => {
    const newFood: FoodLog = {
      id: Date.now().toString(),
      name: item.name,
      calories: item.cals,
      protein: item.p,
      carbs: item.c,
      fats: item.f,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = { ...todayLog, foods: [newFood, ...todayLog.foods] };
    setNutritionHistory([updated, ...nutritionHistory.filter((h) => h.date !== today)]);
    showToast(`Logged ${item.name} (${item.p}g P)`);
  };

  const addOnlineFood = (product: any) => {
    const nutriments = product.nutriments || {};
    const newFood: FoodLog = {
      id: Date.now().toString(),
      name: product.product_name,
      calories: Math.round(nutriments['energy-kcal_100g'] || 0),
      protein: Math.round(nutriments['proteins_100g'] || 0),
      carbs: Math.round(nutriments['carbohydrates_100g'] || 0),
      fats: Math.round(nutriments['fat_100g'] || 0),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = { ...todayLog, foods: [newFood, ...todayLog.foods] };
    setNutritionHistory([updated, ...nutritionHistory.filter((h) => h.date !== today)]);
    showToast(`Added ${newFood.name}`);
    setOnlineResults(prev => prev.filter(p => p !== product));
  };

  // Image Upload / AI Scanner
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isBarcode = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);
    setShowScannerOptions({ show: false, isBarcode: false });
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        try {
          const result = await analyzeFoodImage(base64String, file.type);
          const newFood: FoodLog = {
            id: Date.now().toString(),
            name: isBarcode ? `[Barcode] ${result.name}` : result.name,
            calories: Math.round(result.calories),
            protein: Math.round(result.protein),
            carbs: Math.round(result.carbs),
            fats: Math.round(result.fats),
            imageUrl: reader.result as string,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          const updated = { ...todayLog, foods: [newFood, ...todayLog.foods] };
          setNutritionHistory([updated, ...nutritionHistory.filter((h) => h.date !== today)]);
          showToast(`Scanned: ${newFood.name}`);
        } catch {
          setError('AI scan could not parse image. Please try again or pick from catalogue.');
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setError('Could not process image file.');
      setIsAnalyzing(false);
    }
    e.target.value = '';
  };

  const removeFood = (id: string, name: string) => {
    const updated = { ...todayLog, foods: todayLog.foods.filter((f) => f.id !== id) };
    setNutritionHistory([updated, ...nutritionHistory.filter((h) => h.date !== today)]);
    showToast(`Removed ${name}`, 'info');
  };

  const addWater = (amount: number) => {
    const newTotal = (todayLog.water || 0) + amount;
    const updated = { ...todayLog, water: newTotal };
    setNutritionHistory([updated, ...nutritionHistory.filter((h) => h.date !== today)]);
    showToast(`+${amount}ml Hydration logged (${(newTotal / 1000).toFixed(2)}L total)`);
  };

  const resetWater = () => {
    const updated = { ...todayLog, water: 0 };
    setNutritionHistory([updated, ...nutritionHistory.filter((h) => h.date !== today)]);
    showToast('Hydration reset to 0L', 'info');
  };

  // Filter History Days
  const getFilteredHistory = (): DailyNutrition[] => {
    const now = new Date();
    const msPerDay = 86400000;
    return nutritionHistory.filter((log) => {
      if (log.date === today) return historyFilter === 'today';
      const logDate = new Date(log.date);
      const diffMs = now.getTime() - logDate.getTime();
      const diffDays = diffMs / msPerDay;
      if (historyFilter === 'yesterday') return diffDays >= 1 && diffDays < 2;
      if (historyFilter === 'week') return diffDays < 7;
      if (historyFilter === 'month') return diffDays < 31;
      return true;
    });
  };

  const filteredHistory = getFilteredHistory();

  const toggleExpanded = (date: string) => {
    setExpandedDates((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  const CATEGORY_TABS: { id: FoodCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Items', icon: null },
    { id: 'huel', label: 'Huel Fuel', icon: <Zap size={13} className="text-amber-400" /> },
    { id: 'high-protein', label: 'Lean Protein', icon: <Flame size={13} className="text-sky-400" /> },
    { id: 'meals', label: 'Full Meals', icon: <Coffee size={13} className="text-emerald-400" /> },
    { id: 'plant', label: 'Plant-Based', icon: <Leaf size={13} className="text-emerald-400" /> },
    { id: 'snacks', label: 'Snacks', icon: <Apple size={13} className="text-rose-400" /> },
  ];

  const FILTER_LABELS: { id: HistoryFilter; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'week', label: '7-Day History' },
    { id: 'all', label: 'All Logs' },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* ── Macro Dashboard Summary ─────────────────────────────────────────── */}
      <section className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Daily Target Status
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Macro Intelligence</h1>
          </div>
          <div className="text-right">
            <span className="text-2xl font-mono font-extrabold text-white">{totalCals}</span>
            <span className="text-xs font-mono text-zinc-400"> / {targetCals} kcal</span>
          </div>
        </div>

        {/* Calorie Progression Bar */}
        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              totalCals > targetCals + 150 ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${Math.min((totalCals / targetCals) * 100, 100)}%` }}
          />
        </div>

        {/* 3 Core Macronutrient Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Protein */}
          <div className="bg-zinc-950/70 border border-zinc-800/70 rounded-xl p-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold mb-1">
              Protein
            </div>
            <div className="text-lg font-mono font-extrabold text-white">{totalProtein}g</div>
            <div className="text-[11px] font-mono text-zinc-500 mb-2">/ {targetProtein}g</div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-400 rounded-full transition-all"
                style={{ width: `${Math.min((totalProtein / targetProtein) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-zinc-950/70 border border-zinc-800/70 rounded-xl p-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-1">
              Carbs
            </div>
            <div className="text-lg font-mono font-extrabold text-white">{totalCarbs}g</div>
            <div className="text-[11px] font-mono text-zinc-500 mb-2">/ {targetCarbs}g</div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all"
                style={{ width: `${Math.min((totalCarbs / targetCarbs) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Fats */}
          <div className="bg-zinc-950/70 border border-zinc-800/70 rounded-xl p-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold mb-1">
              Fats
            </div>
            <div className="text-lg font-mono font-extrabold text-white">{totalFats}g</div>
            <div className="text-[11px] font-mono text-zinc-500 mb-2">/ {targetFats}g</div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-400 rounded-full transition-all"
                style={{ width: `${Math.min((totalFats / targetFats) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Hydration Station ──────────────────────────────────────────────── */}
      <section className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Droplets size={16} />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-zinc-400 font-semibold">Hydration Tracker</div>
              <div className="text-sm font-mono font-bold text-white">
                {(waterMl / 1000).toFixed(2)}L <span className="text-zinc-500 font-normal">/ 3.0L Target</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addWater(250)}
              aria-label="Add 250ml water"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all press-scale"
            >
              +250ml
            </button>
            <button
              onClick={() => addWater(500)}
              aria-label="Add 500ml water"
              className="bg-sky-500 text-zinc-950 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all press-scale hover:bg-sky-400"
            >
              +500ml
            </button>
          </div>
        </div>

        {/* Water Level Bar */}
        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-400 rounded-full transition-all duration-500"
            style={{ width: `${waterPercent}%` }}
          />
        </div>
      </section>

      {/* ── AI Scanner Action Strip ────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-zinc-900 to-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between gap-3">
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => handleImageUpload(e, false)} />
        <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={(e) => handleImageUpload(e, false)} />
        <input type="file" accept="image/*" className="hidden" ref={barcodeInputRef} onChange={(e) => handleImageUpload(e, true)} />
        <input type="file" accept="image/*" capture="environment" className="hidden" ref={barcodeCameraInputRef} onChange={(e) => handleImageUpload(e, true)} />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          </div>
          <div>
            <div className="text-sm font-bold text-white">AI Vision Macro Scanner</div>
            <div className="text-xs text-zinc-400">Snap a meal or scan a nutrition label</div>
          </div>
        </div>

        <button
          onClick={() => setShowScannerOptions({ show: true, isBarcode: false })}
          disabled={isAnalyzing}
          className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-3.5 min-h-[40px] rounded-xl text-xs font-bold transition-all press-scale flex items-center gap-1.5 shrink-0"
        >
          <Camera size={14} /> Scan
        </button>
      </section>

      {error && (
        <div role="alert" className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* ── Verified Food Catalog & Quick Add ──────────────────────────────── */}
      <section className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Food Catalog & Fast Log
          </h2>
          <span className="text-[11px] font-mono text-zinc-400">{filteredCatalog.length} items</span>
        </div>

        {/* Live Search Input */}
        <form onSubmit={searchOnlineDatabase} className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search meals, Huel, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors font-sans"
            />
          </div>
          {searchQuery.trim().length > 0 && (
            <button
              type="submit"
              disabled={isSearchingOnline}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 px-3 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
            >
              {isSearchingOnline ? <Loader2 size={13} className="animate-spin" /> : 'Web Search'}
            </button>
          )}
        </form>

        {/* Category Pills/Tabs (Interactive Filters) */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all press-scale ${
                activeCategory === tab.id
                  ? 'bg-zinc-800 text-white border border-zinc-700 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-950/60 border border-zinc-800/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Food List Items */}
        <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1 divide-y divide-zinc-800/40">
          {filteredCatalog.map((item, idx) => (
            <div
              key={idx}
              className="pt-2 pb-1 first:pt-0 flex items-center justify-between gap-3 group"
            >
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-zinc-100 truncate group-hover:text-white">
                  {item.name}
                </div>
                <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-2 mt-0.5">
                  <span className="text-amber-400 font-semibold">{item.cals} kcal</span>
                  <span>·</span>
                  <span className="text-sky-400 font-semibold">{item.p}g P</span>
                  <span>·</span>
                  <span>{item.c}g C</span>
                  <span>·</span>
                  <span>{item.f}g F</span>
                </div>
                <div className="text-[10px] text-zinc-500 italic mt-0.5 truncate">{item.serving}</div>
              </div>

              <button
                onClick={() => addCatalogFood(item)}
                aria-label={`Log ${item.name}`}
                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-200 flex items-center justify-center transition-all press-scale shrink-0"
              >
                <Plus size={16} />
              </button>
            </div>
          ))}

          {filteredCatalog.length === 0 && (
            <div className="py-6 text-center text-xs text-zinc-500">
              No matching items found in local catalog. Try pressing "Web Search".
            </div>
          )}
        </div>

        {/* Gemini Online Results */}
        {onlineResults.length > 0 && (
          <div className="mt-4 pt-3 border-t border-zinc-800">
            <div className="text-xs font-mono uppercase text-sky-400 font-bold mb-2">Web Results</div>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {onlineResults.map((product, idx) => {
                const nut = product.nutriments || {};
                const cals = Math.round(nut['energy-kcal_100g'] || 0);
                const p = Math.round(nut['proteins_100g'] || 0);
                const c = Math.round(nut['carbohydrates_100g'] || 0);
                const f = Math.round(nut['fat_100g'] || 0);
                return (
                  <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">{product.product_name}</div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                        {cals} kcal · {p}g P · {c}g C · {f}g F
                      </div>
                    </div>
                    <button
                      onClick={() => addOnlineFood(product)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500 text-zinc-950 text-xs font-bold hover:bg-emerald-400 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ── Logged History Section ─────────────────────────────────────────── */}
      <section className="space-y-3">
        {/* Date Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {FILTER_LABELS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setHistoryFilter(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                historyFilter === id
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Entries Container */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-10 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl text-zinc-500 text-xs">
            {historyFilter === 'today' ? 'No food logged today yet. Log your first meal above!' : 'No entries found for this time range.'}
          </div>
        ) : (
          filteredHistory.map((dayLog) => {
            const dayCals = dayLog.foods.reduce((s, f) => s + f.calories, 0);
            const dayProtein = dayLog.foods.reduce((s, f) => s + f.protein, 0);
            const isToday = dayLog.date === today;
            const isExpanded = isToday || expandedDates.has(dayLog.date);

            return (
              <div key={dayLog.date} className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => !isToday && toggleExpanded(dayLog.date)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/40 transition-colors text-left"
                >
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{isToday ? 'Today' : dayLog.date}</span>
                      {isToday && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 font-mono mt-0.5 flex gap-2">
                      <span className="text-amber-400 font-semibold">{dayCals} kcal</span>
                      <span>·</span>
                      <span className="text-sky-400 font-semibold">{dayProtein}g protein</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-400">{dayLog.foods.length} items</span>
                    {!isToday && (isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                  </div>
                </button>

                {isExpanded && dayLog.foods.length > 0 && (
                  <div className="border-t border-zinc-800 divide-y divide-zinc-800/60 bg-zinc-950/40">
                    {dayLog.foods.map((food) => (
                      <div key={food.id} className="p-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {food.imageUrl ? (
                            <img src={food.imageUrl} alt={food.name} className="w-11 h-11 object-cover rounded-lg bg-zinc-900 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
                              <Zap size={16} className="text-amber-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">{food.name}</div>
                            <div className="text-[11px] font-mono text-zinc-400 mt-0.5 flex items-center gap-2">
                              <span>{food.calories} kcal</span>
                              <span>·</span>
                              <span className="text-sky-400">{food.protein}g P</span>
                              <span>·</span>
                              <span>{food.carbs}g C</span>
                              <span>·</span>
                              <span>{food.fats}g F</span>
                            </div>
                          </div>
                        </div>

                        {isToday && (
                          <button
                            onClick={() => removeFood(food.id, food.name)}
                            aria-label={`Delete ${food.name}`}
                            className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* ── Scanner Modal Sheet ────────────────────────────────────────────── */}
      {showScannerOptions.show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white">Scan Meal or Barcode</h3>
              <button
                onClick={() => setShowScannerOptions({ show: false, isBarcode: false })}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full bg-white text-zinc-950 h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors press-scale"
              >
                <Camera size={16} /> Open Camera
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-zinc-800 border border-zinc-700 text-white h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors press-scale"
              >
                <ImageIcon size={16} /> Choose from Photo Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
