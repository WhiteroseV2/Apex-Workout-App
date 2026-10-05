export type Exercise = {
  id: string;
  name: string;
  note: string;
  sets: string;
  rpe: string;
  pills: {text: string; type: 'rest' | 'rpe' | 'failure' | 'dropset' | 'tip'}[];
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
