// src/features/diet-plan/components/MealBlock.tsx
// يعتمد على: types → MealBlockProps | logic/calculations → getMealTotal

import { useState } from "react";
import type { MealBlockProps } from "../types";
import { getMealTotal } from "../logic/calculations";

export default function MealBlock({
  icon, name, suggested, foods, onAddFood, defaultOpen = false,
}: MealBlockProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const total = getMealTotal(foods);

  return (
    <div className="meal-block">
      <div
        className="meal-block-header"
        onClick={() => setOpen(p => !p)}
        role="button" aria-expanded={open}
      >
        <div className="meal-left">
          <div className="meal-icon">{icon}</div>
          <div>
            <div className="meal-name">{name}</div>
            <div className="meal-sub">Suggested {suggested}</div>
          </div>
        </div>
        <div className="meal-right">
          <span className="meal-badge">{total} kcal</span>
          <span className={`chevron ${open ? "open" : ""}`}>▼</span>
        </div>
      </div>

      {open && (
        <div className="meal-body">
          {foods.map((food, i) => (
            <div key={i} className="food-item">
              <span className="food-name">{food.name}</span>
              <span className="food-kcal">{food.kcal} kcal</span>
            </div>
          ))}
          <button className="add-food-btn" onClick={onAddFood}>
            <span style={{ fontSize: 16, fontWeight: 700 }}>＋</span> Add ingredient
          </button>
        </div>
      )}
    </div>
  );
}