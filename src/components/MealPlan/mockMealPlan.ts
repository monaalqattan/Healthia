// components/MealPlan/mockMealPlan.ts

export const weekDays = [
  { day: 'MON', date: 12, active: true },
  { day: 'TUE', date: 13, active: false },
  { day: 'WED', date: 14, active: false },
  { day: 'THU', date: 15, active: false },
  { day: 'FRI', date: 16, active: false },
  { day: 'SAT', date: 17, active: false },
  { day: 'SUN', date: 18, active: false },
];

export interface Meal {
  id: string;
  type: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  name: string;
  description: string;
  time: string;
  completed: boolean;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

// كل يوم عنده وجباته
export const weeklyMeals: Record<string, Meal[]> = {
  MON: [
    {
      id: 'mon-1', type: 'BREAKFAST',
      name: 'Greek Yogurt & Berry Power Bowl',
      description: 'Low GI yogurt topped with organic blueberries and crushed walnuts.',
      time: '08:30 AM', completed: true,
      calories: 340, protein: 24, carbs: 28, fats: 12,
    },
    {
      id: 'mon-2', type: 'LUNCH',
      name: 'Atlantic Salmon & Quinoa Pilaf',
      description: 'Oven-roasted salmon with lemon herb crust and light quinoa medley.',
      time: '12:45 PM', completed: false,
      calories: 520, protein: 38, carbs: 32, fats: 18,
    },
    {
      id: 'mon-3', type: 'DINNER',
      name: 'Zesty Ginger Tofu Stir-fry',
      description: 'Wok-tossed organic tofu with seasonal greens and sesame ginger glaze.',
      time: '07:00 PM', completed: false,
      calories: 410, protein: 22, carbs: 45, fats: 9,
    },
  ],
  TUE: [
    {
      id: 'tue-1', type: 'BREAKFAST',
      name: 'Avocado Toast & Poached Eggs',
      description: 'Sourdough toast with smashed avocado and two poached eggs.',
      time: '08:00 AM', completed: true,
      calories: 380, protein: 18, carbs: 35, fats: 20,
    },
    {
      id: 'tue-2', type: 'LUNCH',
      name: 'Grilled Chicken Caesar Salad',
      description: 'Romaine lettuce with grilled chicken, parmesan and light caesar dressing.',
      time: '01:00 PM', completed: true,
      calories: 450, protein: 42, carbs: 18, fats: 22,
    },
    {
      id: 'tue-3', type: 'DINNER',
      name: 'Lemon Herb Baked Cod',
      description: 'Fresh cod fillet with herb crust served with steamed vegetables.',
      time: '07:30 PM', completed: false,
      calories: 390, protein: 35, carbs: 20, fats: 14,
    },
  ],
  WED: [
    {
      id: 'wed-1', type: 'BREAKFAST',
      name: 'Oatmeal with Banana & Honey',
      description: 'Rolled oats with sliced banana, honey and chia seeds.',
      time: '07:45 AM', completed: true,
      calories: 320, protein: 10, carbs: 55, fats: 6,
    },
    {
      id: 'wed-2', type: 'LUNCH',
      name: 'Turkey & Veggie Wrap',
      description: 'Whole wheat wrap with turkey breast, mixed veggies and hummus.',
      time: '12:30 PM', completed: false,
      calories: 480, protein: 32, carbs: 48, fats: 15,
    },
    {
      id: 'wed-3', type: 'DINNER',
      name: 'Beef & Broccoli Stir-fry',
      description: 'Lean beef strips with broccoli in light soy and ginger sauce.',
      time: '07:00 PM', completed: false,
      calories: 520, protein: 40, carbs: 30, fats: 18,
    },
  ],
  THU: [
    {
      id: 'thu-1', type: 'BREAKFAST',
      name: 'Smoothie Bowl',
      description: 'Blended açaí with granola, coconut flakes and mixed berries.',
      time: '08:15 AM', completed: true,
      calories: 360, protein: 12, carbs: 60, fats: 10,
    },
    {
      id: 'thu-2', type: 'LUNCH',
      name: 'Lentil Soup & Whole Grain Bread',
      description: 'Hearty red lentil soup with cumin and served with whole grain bread.',
      time: '01:15 PM', completed: true,
      calories: 430, protein: 22, carbs: 65, fats: 8,
    },
    {
      id: 'thu-3', type: 'DINNER',
      name: 'Grilled Salmon & Sweet Potato',
      description: 'Grilled salmon fillet with roasted sweet potato and green beans.',
      time: '07:00 PM', completed: false,
      calories: 580, protein: 42, carbs: 45, fats: 20,
    },
  ],
  FRI: [
    {
      id: 'fri-1', type: 'BREAKFAST',
      name: 'Protein Pancakes',
      description: 'Fluffy protein pancakes with fresh strawberries and maple syrup.',
      time: '08:30 AM', completed: false,
      calories: 400, protein: 28, carbs: 45, fats: 12,
    },
    {
      id: 'fri-2', type: 'LUNCH',
      name: 'Tuna Nicoise Salad',
      description: 'Classic nicoise with seared tuna, olives, eggs and french beans.',
      time: '12:45 PM', completed: false,
      calories: 460, protein: 38, carbs: 25, fats: 22,
    },
    {
      id: 'fri-3', type: 'DINNER',
      name: 'Chicken Tikka Masala',
      description: 'Tender chicken in aromatic tomato-based sauce with basmati rice.',
      time: '07:00 PM', completed: false,
      calories: 550, protein: 38, carbs: 55, fats: 16,
    },
  ],
  SAT: [
    {
      id: 'sat-1', type: 'BREAKFAST',
      name: 'French Toast & Berries',
      description: 'Brioche french toast with mixed berry compote and light cream.',
      time: '09:00 AM', completed: false,
      calories: 420, protein: 16, carbs: 58, fats: 14,
    },
    {
      id: 'sat-2', type: 'LUNCH',
      name: 'Margherita Pizza',
      description: 'Thin crust pizza with fresh mozzarella, tomato and basil.',
      time: '01:30 PM', completed: false,
      calories: 580, protein: 24, carbs: 72, fats: 20,
    },
    {
      id: 'sat-3', type: 'DINNER',
      name: 'BBQ Chicken & Corn',
      description: 'Grilled BBQ chicken thighs with corn on the cob and coleslaw.',
      time: '07:30 PM', completed: false,
      calories: 620, protein: 45, carbs: 48, fats: 24,
    },
  ],
  SUN: [
    {
      id: 'sun-1', type: 'BREAKFAST',
      name: 'Full English Breakfast',
      description: 'Eggs, turkey bacon, grilled tomatoes, mushrooms and whole wheat toast.',
      time: '09:30 AM', completed: false,
      calories: 480, protein: 32, carbs: 38, fats: 22,
    },
    {
      id: 'sun-2', type: 'LUNCH',
      name: 'Roast Chicken & Vegetables',
      description: 'Herb roasted chicken with seasonal root vegetables and gravy.',
      time: '02:00 PM', completed: false,
      calories: 620, protein: 48, carbs: 42, fats: 26,
    },
    {
      id: 'sun-3', type: 'DINNER',
      name: 'Vegetable Curry & Rice',
      description: 'Mixed vegetable curry with coconut milk served with basmati rice.',
      time: '07:00 PM', completed: false,
      calories: 440, protein: 14, carbs: 68, fats: 12,
    },
  ],
};

export interface CalorieTrend {
  day: string;
  calories: number;
  target: number;
}

export const mockCalorieTrends: CalorieTrend[] = [
  { day: 'MON', calories: 1850, target: 2000 },
  { day: 'TUE', calories: 2050, target: 2000 },
  { day: 'WED', calories: 1620, target: 2000 },
  { day: 'THU', calories: 2400, target: 2000 },
  { day: 'FRI', calories: 0,    target: 2000 },
];