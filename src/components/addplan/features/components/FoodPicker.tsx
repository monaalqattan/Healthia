// src/components/addplan/features/components/FoodPicker.tsx
import { useEffect, useMemo, useState } from "react";
import { fetchFoods, type ApiFood } from "@/lib/api";
import type { FoodItem } from "../types";

const CATEGORIES: { key: string; label: string }[] = [
  { key: "all",         label: "All" },
  { key: "carbs",       label: "Carbs" },
  { key: "protein",     label: "Protein" },
  { key: "fats",        label: "Fats" },
  { key: "vegetables",  label: "Vegetables" },
  { key: "fruits",      label: "Fruits" },
  { key: "snacks",      label: "Snacks" },
  { key: "drinks",      label: "Drinks" },
];

interface FoodPickerProps {
  mealName: string;
  onPick: (food: FoodItem) => void;
  onClose: () => void;
}

export default function FoodPicker({ mealName, onPick, onClose }: FoodPickerProps) {
  const [foods,    setFoods]    = useState<ApiFood[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    setLoading(true);
    fetchFoods()
      .then(setFoods)
      .catch(() => setError("Failed to load foods. Please make sure the server is running."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return foods.filter((f) => {
      const okCat = category === "all" || f.category === category;
      const okSearch = f.name.toLowerCase().includes(search.trim().toLowerCase());
      return okCat && okSearch;
    });
  }, [foods, category, search]);

  function choose(f: ApiFood) {
    onPick({
      foodId:   f._id,
      name:     f.name,
      kcal:     f.calories,
      protein:  f.protein,
      carbs:    f.carbs,
      fat:      f.fat,
      quantity: f.quantity,
    });
    onClose();
  }

  return (
    <div className="fp-overlay" onClick={onClose}>
      <div className="fp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fp-header">
          <div>
            <div className="fp-title">Add Food Item</div>
            <div className="fp-sub">Meal: {mealName}</div>
          </div>
          <button className="fp-close" onClick={onClose}>✕</button>
        </div>

        <input
          className="fp-search"
          placeholder="Search for a food… (e.g. chicken, rice, apple)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />

        <div className="fp-cats">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              className={`fp-cat ${category === c.key ? "active" : ""}`}
              onClick={() => setCategory(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="fp-list">
          {loading && <div className="fp-state">Loading…</div>}
          {error   && <div className="fp-state error">{error}</div>}
          {!loading && !error && filtered.length === 0 && (
            <div className="fp-state">No results found</div>
          )}
          {!loading && !error && filtered.map((f) => (
            <button key={f._id} className="fp-item" onClick={() => choose(f)}>
              <div className="fp-item-main">
                <span className="fp-item-name">{f.name}</span>
                <span className="fp-item-qty">{f.quantity}</span>
              </div>
              <div className="fp-item-macros">
                <span className="fp-kcal">{f.calories} kcal</span>
                <span className="fp-macro">P {f.protein}</span>
                <span className="fp-macro">C {f.carbs}</span>
                <span className="fp-macro">F {f.fat}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}