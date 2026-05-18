// components/PatientDashboard/mockPatientDashboard.ts

export interface Ritual {
  id: string;
  label: string;
  completed: boolean;
}

export interface NourishmentMeal {
  id: string;
  type: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACKS';
  name: string;
  calories: number;
  completed: boolean;
}

export const mockRituals: Ritual[] = [
  { id: '1', label: 'Log morning weight',      completed: true  },
  { id: '2', label: 'Breakfast nutrition log', completed: true  },
  { id: '3', label: 'Drink 2L water (1.2L left)', completed: false },
  { id: '4', label: '30 min evening walk',     completed: false },
  { id: '5', label: 'Mindful meditation',      completed: false },
];

export const mockMeals: NourishmentMeal[] = [
  { id: '1', type: 'BREAKFAST', name: 'Oatmeal & Berries',        calories: 320, completed: true  },
  { id: '2', type: 'LUNCH',     name: 'Grilled Salmon & Asparagus', calories: 450, completed: false },
  { id: '3', type: 'DINNER',    name: 'Quinoa Power Bowl',         calories: 380, completed: false },
  { id: '4', type: 'SNACKS',    name: 'Greek Yogurt & Honey',      calories: 200, completed: false },
];