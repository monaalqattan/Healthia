// src/components/addplan/features/components/MealStructure.tsx
import { useState } from "react";
import MealBlock from "./MealBlock";
import type { MealStructureProps } from "../types";
import { DAYS_OF_WEEK } from "../constants";
import { getDeficitType } from "../logic/calculations";
import { selectNutritionGaps } from "../logic/selectors";

export default function MealStructure({
  meals, onAddFood, onRemoveFood, onAddMeal, onSave, targets, totalEaten,
}: MealStructureProps) {
  const [activeDay, setActiveDay] = useState<string>("Sun");
  const { calGap, proGap, carbGap } = selectNutritionGaps(meals, targets);

  // ✅ المتبقي من السعرات = الهدف − اللي اتخصم (مجموع الأكل المختار)
  const remaining = targets.cal - totalEaten;
  const remainingClass = remaining < 0 ? "bad" : remaining < 200 ? "warn" : "ok";

  return (
    <div className="meal-section">
      <div className="meal-section-header">
        <div className="section-title">Daily Meal Structure</div>
      </div>

      {/* ✅ شريط السعرات: الهدف / المختار / المتبقي */}
      <div className="cal-tracker">
        <div className="cal-box">
          <div className="cal-label">الهدف اليومي</div>
          <div className="cal-val">{targets.cal || "—"} kcal</div>
        </div>
        <div className="cal-box">
          <div className="cal-label">المختار</div>
          <div className="cal-val">{totalEaten} kcal</div>
        </div>
        <div className={`cal-box ${remainingClass}`}>
          <div className="cal-label">المتبقي</div>
          <div className="cal-val">{targets.cal ? remaining : "—"} kcal</div>
        </div>
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
          onAddFood={() => onAddFood(meal.id)}
          onRemoveFood={onRemoveFood ? (idx) => onRemoveFood(meal.id, idx) : undefined}
          defaultOpen={i === 0} />
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
        <button className="btn-primary" onClick={onSave}>
          💾 Save Diet
        </button>
      </div>
    </div>
  );
}