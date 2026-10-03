export type Exercise = {
  id: string;
  name: string;
  note: string;
  sets: string;
  rpe: string;
  pills: { text: string; type: 'rest' | 'rpe' | 'failure' | 'dropset' | 'tip' }[];
};

export type Section = {
  id: string;
  label: string;
  exercises: Exercise[];
};

export type DayPlan = {
  id: string;
  dayLabel: string;
  title: string;
  focus: string;
  type: 'push' | 'pull' | 'legs' | 'rest';
  sections: Section[];
  tips: string[];
};

export type WorkoutPlan = Record<string, DayPlan>;

export const defaultPlan: WorkoutPlan = {
  mon: {
    id: 'mon',
    dayLabel: 'Monday',
    title: 'Push — strength',
    focus: 'Chest, triceps, shoulders. Heaviest session of the week. Every set close to failure.',
    type: 'push',
    sections: [
      {
        id: 'mon-chest',
        label: 'Chest',
        exercises: [
          {
            id: 'mon-ex1',
            name: 'Incline dumbbell press',
            note: '30–45° incline. Main chest compound. Full stretch at bottom, drive hard. Treat it like a max effort lift.',
            sets: '4 × 6–8',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 3 min', type: 'rest' },
              { text: '1 rep left in tank', type: 'rpe' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          },
          {
            id: 'mon-ex2',
            name: 'Cable flys',
            note: 'Full stretch, hard squeeze at centre. No momentum — feel the chest working every rep.',
            sets: '3 × 10–12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set drop set', type: 'dropset' }
            ]
          }
        ]
      },
      {
        id: 'mon-triceps',
        label: 'Triceps',
        exercises: [
          {
            id: 'mon-ex3',
            name: 'Tricep pushdown (normal)',
            note: 'Elbows pinned to sides, full extension at bottom, squeeze hard',
            sets: '3 × 10–12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          },
          {
            id: 'mon-ex4',
            name: 'Reverse tricep pushdown',
            note: 'Underhand grip, elbows pinned, full extension — hits lateral and medial head',
            sets: '3 × 10–12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          },
          {
            id: 'mon-ex5',
            name: 'Overhead cable extension',
            note: 'Arms behind head, full stretch on long head — biggest portion of tricep, most important for arm size',
            sets: '3 × 10–12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set rest pause', type: 'failure' }
            ]
          }
        ]
      },
      {
        id: 'mon-shoulders',
        label: 'Shoulders',
        exercises: [
          {
            id: 'mon-ex6',
            name: 'Seated dumbbell shoulder press',
            note: 'Full range, don\'t lock out at top, control the descent',
            sets: '4 × 6–8',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 3 min', type: 'rest' },
              { text: '1 rep left in tank', type: 'rpe' }
            ]
          },
          {
            id: 'mon-ex7',
            name: 'Cable lateral raises (single arm)',
            note: 'Lead with elbow, slight forward lean, constant cable tension. Builds the wide shoulder look.',
            sets: '4 × 12–15',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 60 sec', type: 'rest' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          }
        ]
      }
    ],
    tips: ['Log every weight and rep. If you hit the top of the range on all sets with 1 rep still in the tank, add 2.5kg next Monday. Chest and triceps are priorities — attack them.']
  },
  tue: {
    id: 'tue',
    dayLabel: 'Tuesday',
    title: 'Pull — strength',
    focus: 'Back and biceps. Heavy rows. Lats are a weak point — feel every rep stretching and contracting.',
    type: 'pull',
    sections: [
      {
        id: 'tue-back-thick',
        label: 'Back — thickness',
        exercises: [
          {
            id: 'tue-ex1',
            name: 'Barbell row (overhand)',
            note: 'Chest up, pull to lower chest, controlled — no momentum. Main back compound.',
            sets: '4 × 5–7',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 3 min', type: 'rest' },
              { text: '1 rep left in tank', type: 'rpe' }
            ]
          },
          {
            id: 'tue-ex2',
            name: 'Seated row machine',
            note: 'Full stretch forward every rep, drive elbows back hard, 1s hold at peak contraction',
            sets: '4 × 8–10',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 2 min', type: 'rest' },
              { text: 'Last set rest pause', type: 'failure' }
            ]
          }
        ]
      },
      {
        id: 'tue-back-width',
        label: 'Back — width',
        exercises: [
          {
            id: 'tue-ex3',
            name: 'Lat pulldown machine',
            note: 'Full dead stretch at top, drive elbows down to lats — not your biceps',
            sets: '4 × 8–10',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 2 min', type: 'rest' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          },
          {
            id: 'tue-ex4',
            name: 'Single arm dumbbell row',
            note: 'Pull to hip not chest — that\'s what hits the lat. Big range of motion, full stretch at bottom.',
            sets: '3 × 10–12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set to failure each arm', type: 'failure' }
            ]
          }
        ]
      },
      {
        id: 'tue-biceps',
        label: 'Biceps',
        exercises: [
          {
            id: 'tue-ex5',
            name: 'Barbell curl',
            note: 'Slow 3s negative, full extension at bottom, no swinging',
            sets: '3 × 8–10',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          }
        ]
      },
      {
        id: 'tue-traps',
        label: 'Traps',
        exercises: [
          {
            id: 'tue-ex6',
            name: 'Dumbbell shrugs',
            note: 'Hold dumbbells at sides, shrug straight up, hold squeeze at top for 1 second. No rolling the shoulders — straight up and down only.',
            sets: '3 × 12–15',
            rpe: 'RPE 8',
            pills: [
              { text: 'Rest 60 sec', type: 'rest' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          }
        ]
      },
      {
        id: 'tue-forearms',
        label: 'Forearms',
        exercises: [
          {
            id: 'tue-ex7',
            name: 'Cable wrist extension (single arm)',
            note: 'Cable set at top, overhand grip, curl wrist downward toward floor — hits forearm extensors. Control the movement, slow on the way back up.',
            sets: '3 × 15',
            rpe: 'RPE 7',
            pills: [
              { text: 'Rest 60 sec', type: 'rest' }
            ]
          },
          {
            id: 'tue-ex8',
            name: 'Wrist curl',
            note: 'Forearms on thighs, underhand grip, curl wrists upward — hits inner forearm flexors',
            sets: '3 × 15',
            rpe: 'RPE 7',
            pills: [
              { text: 'Rest 60 sec', type: 'rest' }
            ]
          }
        ]
      }
    ],
    tips: ['On every pulldown and row, think about initiating with your lat — not your bicep. If your bicep is pumped but your back isn\'t, you\'re doing it wrong.']
  },
  wed: {
    id: 'wed',
    dayLabel: 'Wednesday',
    title: 'Rest day',
    focus: 'You\'ve trained two days in a row. Your body needs this to recover properly before Thursday and Friday.',
    type: 'rest',
    sections: [
      {
        id: 'wed-priority',
        label: 'Priority',
        exercises: [
          {
            id: 'wed-ex1',
            name: 'Eat your full calories',
            note: 'Rest days still need 2,400+ cal and 150g protein — muscle repairs on rest days not gym days',
            sets: 'required',
            rpe: '',
            pills: []
          },
          {
            id: 'wed-ex2',
            name: 'Sleep 8 hours',
            note: 'Growth hormone releases during deep sleep — this is literally when you grow',
            sets: 'required',
            rpe: '',
            pills: []
          },
          {
            id: 'wed-ex3',
            name: 'Light walk (optional)',
            note: '20–30 mins easy walking only. No gym.',
            sets: 'optional',
            rpe: '',
            pills: []
          }
        ]
      }
    ],
    tips: ['Do not add a gym session here. Your muscles need 48hrs to repair. Going in will slow your progress, not speed it up.']
  },
  thu: {
    id: 'thu',
    dayLabel: 'Thursday',
    title: 'Push — hypertrophy',
    focus: 'Chest first, then triceps while fresh, shoulders last. Higher reps, more pump. Feel every rep.',
    type: 'push',
    sections: [
      {
        id: 'thu-chest',
        label: 'Chest',
        exercises: [
          {
            id: 'thu-ex1',
            name: 'High to low cable fly',
            note: 'Cable set high, pull down and across. Hits lower chest. Squeeze hard at the bottom of each rep.',
            sets: '4 × 12–15',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set drop set', type: 'dropset' }
            ]
          },
          {
            id: 'thu-ex2',
            name: 'Cable flys (mid height)',
            note: 'Cables at chest height. Full stretch, squeeze hard at centre. Different angle to Monday.',
            sets: '3 × 12–15',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          }
        ]
      },
      {
        id: 'thu-triceps',
        label: 'Triceps',
        exercises: [
          {
            id: 'thu-ex3',
            name: 'Tricep pushdown (normal)',
            note: 'Elbows pinned, full extension, squeeze at bottom',
            sets: '3 × 12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          },
          {
            id: 'thu-ex4',
            name: 'Reverse tricep pushdown',
            note: 'Underhand grip, elbows pinned, full extension',
            sets: '3 × 12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          },
          {
            id: 'thu-ex5',
            name: 'Overhead cable extension',
            note: 'Arms behind head, full stretch on long head of tricep. Most important tricep exercise for arm size.',
            sets: '3 × 12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set rest pause', type: 'failure' }
            ]
          }
        ]
      },
      {
        id: 'thu-shoulders',
        label: 'Shoulders',
        exercises: [
          {
            id: 'thu-ex6',
            name: 'Seated dumbbell shoulder press',
            note: 'Higher reps than Monday — lighter weight, feel the burn throughout',
            sets: '3 × 10–12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 2 min', type: 'rest' }
            ]
          },
          {
            id: 'thu-ex7',
            name: 'Cable lateral raises (single arm)',
            note: 'Constant tension. Lead with elbow. Never skip this — it\'s what builds shoulder width.',
            sets: '4 × 15',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 60 sec', type: 'rest' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          }
        ]
      }
    ],
    tips: ['Thursday push hits triceps while you\'re still relatively fresh — that\'s intentional since they\'re a weak point. Shoulders come last because they\'re already your stronger push muscle.']
  },
  fri: {
    id: 'fri',
    dayLabel: 'Friday',
    title: 'Pull — hypertrophy',
    focus: 'Back and biceps. Higher volume on lats. Stretch and squeeze every single rep.',
    type: 'pull',
    sections: [
      {
        id: 'fri-back',
        label: 'Back — lat focus',
        exercises: [
          {
            id: 'fri-ex1',
            name: 'Lat pulldown machine (wide grip)',
            note: 'Full dead stretch at top, drive elbows down. Think pulling your elbows to your hips.',
            sets: '4 × 10–12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 2 min', type: 'rest' },
              { text: 'Last set drop set', type: 'dropset' }
            ]
          },
          {
            id: 'fri-ex2',
            name: 'Single arm dumbbell row',
            note: 'Pull to hip, big range of motion, full stretch at bottom. Feel the lat loading.',
            sets: '4 × 10–12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set to failure each arm', type: 'failure' }
            ]
          },
          {
            id: 'fri-ex3',
            name: 'Seated row machine (close grip)',
            note: 'Full stretch, drive elbows back hard, 1s hold at peak. Mid back and lats.',
            sets: '3 × 10–12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set rest pause', type: 'failure' }
            ]
          }
        ]
      },
      {
        id: 'fri-biceps',
        label: 'Biceps',
        exercises: [
          {
            id: 'fri-ex4',
            name: 'Bayesian curl',
            note: 'Cable behind you, arm slightly back, full stretch at bottom. Best exercise for bicep growth.',
            sets: '3 × 10–12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          },
          {
            id: 'fri-ex5',
            name: 'Seated dumbbell bicep curl',
            note: 'Supinate at top, slow 3s negative, full extension at bottom',
            sets: '3 × 10–12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          },
          {
            id: 'fri-ex6',
            name: 'Barbell curl',
            note: 'Slow negative, full extension, no swinging — push to failure on last set',
            sets: '3 × 10',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          },
          {
            id: 'fri-ex7',
            name: 'Rope hammer curl',
            note: 'Neutral grip, slow negative — hits brachialis for arm thickness',
            sets: '3 × 12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          }
        ]
      },
      {
        id: 'fri-rear-delts',
        label: 'Rear delts',
        exercises: [
          {
            id: 'fri-ex8',
            name: 'Rear delt fly (pec deck)',
            note: 'Sit facing the machine, arms out wide, pull handles back in a wide arc. Light weight — feel the rear delt contracting, not your traps. Slow on the way back in.',
            sets: '3 × 15',
            rpe: 'RPE 8',
            pills: [
              { text: 'Rest 60 sec', type: 'rest' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          }
        ]
      },
      {
        id: 'fri-forearms',
        label: 'Forearms',
        exercises: [
          {
            id: 'fri-ex9',
            name: 'Cable wrist extension (single arm)',
            note: 'Cable set at top, overhand grip, curl wrist downward toward floor. Slow and controlled back up. Hits forearm extensors.',
            sets: '3 × 15',
            rpe: 'RPE 7',
            pills: [
              { text: 'Rest 60 sec', type: 'rest' }
            ]
          },
          {
            id: 'fri-ex10',
            name: 'Wrist curl',
            note: 'Forearms on thighs, underhand grip, curl wrists upward — inner forearm flexors',
            sets: '3 × 15',
            rpe: 'RPE 7',
            pills: [
              { text: 'Rest 60 sec', type: 'rest' }
            ]
          }
        ]
      }
    ],
    tips: ['Friday is your highest bicep volume day. Your arms should be thoroughly exhausted by the end. If they\'re not, you\'re not pushing hard enough on the last sets.']
  },
  sat: {
    id: 'sat',
    dayLabel: 'Saturday',
    title: 'Legs',
    focus: 'Legs are a weak point. One session per week — maximum effort on every set. No skipping exercises.',
    type: 'legs',
    sections: [
      {
        id: 'sat-main',
        label: 'Main lifts',
        exercises: [
          {
            id: 'sat-ex1',
            name: 'Barbell back squat',
            note: 'Parallel or below, chest up, knees tracking over toes. No half reps — full depth every time.',
            sets: '4 × 5–7',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 3 min', type: 'rest' },
              { text: '1 rep left in tank', type: 'rpe' }
            ]
          },
          {
            id: 'sat-ex2',
            name: 'Conventional deadlift',
            note: 'Bar over mid-foot, big brace, push floor away. Learn form before going heavy — watch Alan Thrall on YouTube.',
            sets: '3 × 4–5',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 3 min', type: 'rest' },
              { text: 'Learn form first', type: 'tip' }
            ]
          }
        ]
      },
      {
        id: 'sat-quads',
        label: 'Quad focus',
        exercises: [
          {
            id: 'sat-ex3',
            name: 'Leg press',
            note: 'Full range, high foot placement for more glute involvement',
            sets: '4 × 10–12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 2 min', type: 'rest' },
              { text: 'Last set drop set', type: 'dropset' }
            ]
          }
        ]
      },
      {
        id: 'sat-hamstrings',
        label: 'Hamstring focus',
        exercises: [
          {
            id: 'sat-ex4',
            name: 'Romanian deadlift',
            note: 'Hip hinge, feel the hamstring stretch fully, soft knee bend throughout',
            sets: '3 × 10–12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 2 min', type: 'rest' }
            ]
          },
          {
            id: 'sat-ex5',
            name: 'Leg curl (machine)',
            note: '3 second negative on every rep — slow and controlled',
            sets: '3 × 12',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 90 sec', type: 'rest' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          }
        ]
      },
      {
        id: 'sat-calves-abs',
        label: 'Calves + abs',
        exercises: [
          {
            id: 'sat-ex6',
            name: 'Calf raises',
            note: 'Full stretch at bottom, 1s pause at top. Calves need high reps and full range to grow.',
            sets: '4 × 15–20',
            rpe: 'RPE 9',
            pills: [
              { text: 'Rest 60 sec', type: 'rest' },
              { text: 'Last set to failure', type: 'failure' }
            ]
          },
          {
            id: 'sat-ex7',
            name: 'Cable crunch',
            note: 'Round your spine downward — don\'t just hip flex. Feel your abs contracting.',
            sets: '3 × 15',
            rpe: 'RPE 8',
            pills: [
              { text: 'Rest 60 sec', type: 'rest' }
            ]
          },
          {
            id: 'sat-ex8',
            name: 'Hanging leg raise',
            note: 'Controlled, no swinging, slow negative on every rep',
            sets: '3 × 12',
            rpe: 'RPE 8',
            pills: [
              { text: 'Rest 60 sec', type: 'rest' }
            ]
          }
        ]
      }
    ],
    tips: ['Squats and deadlifts release more testosterone and growth hormone than any other exercise. Your upper body grows faster because of this session. Never skip legs.']
  },
  sun: {
    id: 'sun',
    dayLabel: 'Sunday',
    title: 'Full rest day',
    focus: 'You\'ve trained 5 days. Your body needs this. Recovery is part of the process — not a gap in it.',
    type: 'rest',
    sections: [
      {
        id: 'sun-priority',
        label: 'Priority',
        exercises: [
          {
            id: 'sun-ex1',
            name: 'Eat your full calories',
            note: 'Rest days still need 2,400+ cal and 150g protein',
            sets: 'required',
            rpe: '',
            pills: []
          },
          {
            id: 'sun-ex2',
            name: 'Sleep 8 hours',
            note: 'Growth hormone releases during deep sleep — the whole week\'s work pays off tonight',
            sets: 'required',
            rpe: '',
            pills: []
          },
          {
            id: 'sun-ex3',
            name: 'Meal prep for the week',
            note: 'Cook 600–700g chicken + big pot of rice. College food sorted for the whole week in 30 mins.',
            sets: 'key habit',
            rpe: '',
            pills: []
          }
        ]
      }
    ],
    tips: ['Sunday meal prep is what determines how well you eat Monday through Friday. 30 minutes today = hitting your protein target every day this week.']
  }
};

// Helper for dynamic dates relative to today
const getRelativeDateStr = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

export const defaultUserProfile = {
  age: 26,
  weight: 78.5,
  height: 182,
  gender: 'male' as const,
  activityLevel: 'active' as const,
  goal: 'cut' as const,
  experienceLevel: 'Intermediate',
  daysPerWeek: '5',
  preferredSplit: 'Push / Pull / Legs',
  targetCalories: 2450,
  targetProtein: 175,
  targetCarbs: 230,
  targetFats: 65,
};

export const createDefaultNutritionHistory = () => [
  {
    date: getRelativeDateStr(0),
    water: 2250,
    foods: [
      {
        id: 'food-seed-1',
        name: 'Huel Black Edition (Salted Caramel)',
        calories: 400,
        protein: 40,
        carbs: 24,
        fats: 17,
        time: '08:30',
      },
      {
        id: 'food-seed-2',
        name: 'Grilled Herb Chicken & Quinoa Bowl',
        calories: 620,
        protein: 54,
        carbs: 58,
        fats: 14,
        time: '13:15',
      },
      {
        id: 'food-seed-3',
        name: 'Greek Skyr Yogurt & Wild Blueberries',
        calories: 220,
        protein: 26,
        carbs: 20,
        fats: 2,
        time: '16:45',
      },
      {
        id: 'food-seed-4',
        name: 'Wild Salmon Fillet, Sweet Potato & Asparagus',
        calories: 580,
        protein: 42,
        carbs: 46,
        fats: 18,
        time: '19:40',
      }
    ]
  },
  {
    date: getRelativeDateStr(1),
    water: 3000,
    foods: [
      {
        id: 'food-seed-y1',
        name: 'Huel Daily Greens & Protein Shake',
        calories: 380,
        protein: 38,
        carbs: 22,
        fats: 12,
        time: '08:15',
      },
      {
        id: 'food-seed-y2',
        name: 'Grass-fed Beef Steak & Roasted Potatoes',
        calories: 710,
        protein: 58,
        carbs: 60,
        fats: 22,
        time: '13:30',
      },
      {
        id: 'food-seed-y3',
        name: 'Whey Protein Isolate & Banana',
        calories: 240,
        protein: 30,
        carbs: 28,
        fats: 2,
        time: '17:00',
      },
      {
        id: 'food-seed-y4',
        name: 'Tofu & Edamame Soba Stir-fry',
        calories: 520,
        protein: 36,
        carbs: 55,
        fats: 14,
        time: '20:10',
      }
    ]
  },
  {
    date: getRelativeDateStr(2),
    water: 2750,
    foods: [
      {
        id: 'food-seed-d2-1',
        name: 'Huel Complete Protein Oat Bowl',
        calories: 440,
        protein: 42,
        carbs: 45,
        fats: 10,
        time: '09:00',
      },
      {
        id: 'food-seed-d2-2',
        name: 'Turkey Breast Avocado Wrap',
        calories: 540,
        protein: 46,
        carbs: 48,
        fats: 16,
        time: '14:00',
      },
      {
        id: 'food-seed-d2-3',
        name: 'Cod Loin & Jasmine Rice with Steamed Broccoli',
        calories: 510,
        protein: 48,
        carbs: 62,
        fats: 6,
        time: '19:30',
      }
    ]
  }
];

export const createDefaultGymHistory = () => [
  {
    id: 'session-seed-1',
    date: getRelativeDateStr(0),
    dayId: 'sat',
    name: 'Push — Strength & Hypertrophy',
    exercises: [
      {
        name: 'Incline Dumbbell Press',
        notes: 'Felt explosive on 34kg',
        sets: [
          { kg: '32', reps: '8', completed: true },
          { kg: '34', reps: '8', completed: true },
          { kg: '34', reps: '7', completed: true },
          { kg: '34', reps: '6', completed: true },
        ]
      },
      {
        name: 'Cable Flys',
        notes: 'Deep stretch at bottom',
        sets: [
          { kg: '18', reps: '12', completed: true },
          { kg: '21', reps: '10', completed: true },
          { kg: '21', reps: '10', completed: true },
        ]
      },
      {
        name: 'Overhead Tricep Extension',
        notes: 'Strict form, full elbow lockout',
        sets: [
          { kg: '25', reps: '12', completed: true },
          { kg: '30', reps: '10', completed: true },
          { kg: '30', reps: '9', completed: true },
        ]
      }
    ]
  },
  {
    id: 'session-seed-2',
    date: getRelativeDateStr(1),
    dayId: 'fri',
    name: 'Pull — Lats & Biceps Precision',
    exercises: [
      {
        name: 'Barbell Row',
        notes: 'Underhand grip, torso parallel',
        sets: [
          { kg: '70', reps: '8', completed: true },
          { kg: '75', reps: '8', completed: true },
          { kg: '75', reps: '8', completed: true },
        ]
      },
      {
        name: 'Lat Pulldown',
        notes: 'Squeeze shoulder blades down',
        sets: [
          { kg: '68', reps: '10', completed: true },
          { kg: '75', reps: '8', completed: true },
          { kg: '75', reps: '8', completed: true },
        ]
      },
      {
        name: 'Incline Dumbbell Curl',
        notes: 'Peak contraction',
        sets: [
          { kg: '14', reps: '12', completed: true },
          { kg: '16', reps: '10', completed: true },
          { kg: '16', reps: '9', completed: true },
        ]
      }
    ]
  },
  {
    id: 'session-seed-3',
    date: getRelativeDateStr(2),
    dayId: 'thu',
    name: 'Legs — Posterior Chain & Quads',
    exercises: [
      {
        name: 'Barbell Squat',
        notes: 'ATG depth, crisp ascent',
        sets: [
          { kg: '100', reps: '6', completed: true },
          { kg: '110', reps: '6', completed: true },
          { kg: '115', reps: '5', completed: true },
        ]
      },
      {
        name: 'Romanian Deadlift',
        notes: 'Hamstring stretch on every rep',
        sets: [
          { kg: '110', reps: '8', completed: true },
          { kg: '120', reps: '8', completed: true },
          { kg: '125', reps: '6', completed: true },
        ]
      },
      {
        name: 'Leg Press',
        notes: 'Continuous tension',
        sets: [
          { kg: '180', reps: '12', completed: true },
          { kg: '200', reps: '10', completed: true },
        ]
      }
    ]
  },
  {
    id: 'session-seed-4',
    date: getRelativeDateStr(3),
    dayId: 'wed',
    name: 'Upper Body Deload & Core',
    exercises: [
      {
        name: 'Overhead Press',
        notes: 'Military stance',
        sets: [
          { kg: '50', reps: '8', completed: true },
          { kg: '55', reps: '6', completed: true },
          { kg: '55', reps: '6', completed: true },
        ]
      },
      {
        name: 'Lateral Raises',
        notes: 'Controlled eccentric',
        sets: [
          { kg: '12', reps: '15', completed: true },
          { kg: '12', reps: '14', completed: true },
          { kg: '14', reps: '12', completed: true },
        ]
      }
    ]
  }
];

export const createDefaultProgressHistory = () => [
  {
    id: 'prog-seed-1',
    date: getRelativeDateStr(0),
    weight: 78.2,
    bodyFat: 12.8,
    notes: 'Feeling lean and conditioned. Energy levels peaked.',
    measurements: { chest: 104, waist: 79, arms: 38.5, shoulders: 122 }
  },
  {
    id: 'prog-seed-2',
    date: getRelativeDateStr(5),
    weight: 78.7,
    bodyFat: 13.0,
    notes: 'Consistent morning weigh-in post hydration.',
    measurements: { chest: 104, waist: 79.5, arms: 38.5, shoulders: 122 }
  },
  {
    id: 'prog-seed-3',
    date: getRelativeDateStr(12),
    weight: 79.3,
    bodyFat: 13.4,
    notes: 'Deficit week 3 holding strong.',
    measurements: { chest: 103.5, waist: 80.2, arms: 38.2, shoulders: 121.5 }
  },
  {
    id: 'prog-seed-4',
    date: getRelativeDateStr(19),
    weight: 80.1,
    bodyFat: 13.9,
    notes: 'Mid-cut checkpoint.',
    measurements: { chest: 103, waist: 81, arms: 38, shoulders: 121 }
  },
  {
    id: 'prog-seed-5',
    date: getRelativeDateStr(26),
    weight: 80.9,
    bodyFat: 14.5,
    notes: 'Initial weigh-in after maintenance phase.',
    measurements: { chest: 103, waist: 82, arms: 38, shoulders: 120.5 }
  }
];

