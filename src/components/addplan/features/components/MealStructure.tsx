// src/features/diet-plan/components/MealStructure.tsx
// يعتمد على: types | constants | logic/calculations | logic/selectors | MealBlock

import { useState } from "react";
import MealBlock from "./MealBlock";
import type { MealStructureProps } from "../types";
import { DAYS_OF_WEEK } from "../constants";
import { getDeficitType } from "../logic/calculations";
import { selectNutritionGaps } from "../logic/selectors";

export default function MealStructure({
  meals, onAddFood, onAddMeal, targets, totalEaten,
}: MealStructureProps) {
  const [activeDay, setActiveDay] = useState<string>("Sun");
  const { calGap, proGap, carbGap } = selectNutritionGaps(meals, targets);

  return (
    <div className="meal-section">
      <div className="meal-section-header">
        <div className="section-title">Daily Meal Structure</div>
      </div>

      {/* Days */}
      <div className="days-row">
        {DAYS_OF_WEEK.map((d) => (
          <button key={d} className={`day-btn ${activeDay === d ? "active" : ""}`}
            onClick={() => setActiveDay(d)}>{d}</button>
        ))}
      </div>

      {/* Meals */}
      {meals.map((meal, i) => (
        <MealBlock key={meal.id} icon={meal.icon} name={meal.name}
          suggested={meal.suggested} foods={meal.foods}
          onAddFood={() => onAddFood(meal.id)} defaultOpen={i === 0} />
      ))}

      {/* Deficit Bar */}
      <div className="deficit-bar">
        <div className="def-item ok">
          <div className="def-label">Protein Gap</div>
          <div className="def-val">-{proGap}g</div>
        </div>
        <div className="def-item warn">
          <div className="def-label">Carb Gap</div>
          <div className="def-val">{carbGap >= 0 ? "+" : ""}{carbGap}g</div>
        </div>
        <div className={`def-item ${getDeficitType(calGap)}`}>
          <div className="def-label">Calorie Gap</div>
          <div className="def-val">{calGap >= 0 ? "+" : ""}{calGap} kcal</div>
        </div>
      </div>

      {/* Actions */}
      <div className="bottom-actions">
        <button className="btn-outline" onClick={onAddMeal}>＋ Add New Meal</button>
        <button className="btn-primary" onClick={() => alert("Diet plan saved! ✓")}>
          💾 Save Diet
        </button>
      </div>
    </div>
  );
}