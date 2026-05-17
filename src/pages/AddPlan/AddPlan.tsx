// src/pages/AddPlan.tsx
// الصفحة الرئيسية — تجمع كل حاجة وتدير الـ state

import { useState, useCallback } from "react";
import "./styles/Addplan.css";
import { PatientBar, DietCalculator, MealStructure } from "../../components/addplan/features/components";
import type { PatientForm, DietTargets, Meal, Equation } from "../../components/addplan/features/types";
import { PAGE_TABS } from "../../components/addplan/features/constants";
import { INITIAL_FORM, INITIAL_TARGETS, INITIAL_MEALS } from "../../components/addplan/features/data";
import { computeTargets } from "../../components/addplan/features/logic/calculations";
import { selectTotalEaten } from "../../components/addplan/features/logic/selectors";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/footer/Footer";

export default function AddPlan() {
  const [activeTab, setActiveTab] = useState<string>("Nutritional Goals");
  const [equation,  setEquation]  = useState<Equation>("katch");
  const [form,      setForm]      = useState<PatientForm>(INITIAL_FORM);
  const [targets,   setTargets]   = useState<DietTargets>(INITIAL_TARGETS);
  const [meals,     setMeals]     = useState<Meal[]>(INITIAL_MEALS);

  const totalEaten = selectTotalEaten(meals);

  const handleFormChange = useCallback(
    (key: keyof PatientForm, value: string | number) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    []
  );

  const handleCalculate = useCallback(() => {
    setTargets(computeTargets({ ...form, equation }));
  }, [form, equation]);

  const handleAddFood = useCallback((mealId: string) => {
    const name = window.prompt("Food name:");
    if (!name) return;
    const kcal = parseInt(window.prompt("Calories (kcal):") ?? "0") || 0;
    setMeals((prev) =>
      prev.map((m) =>
        m.id === mealId ? { ...m, foods: [...m.foods, { name, kcal }] } : m
      )
    );
  }, []);

  const handleAddMeal = useCallback(() => {
    const name = window.prompt("Meal name:") || "New Meal";
    setMeals((prev) => [
      ...prev,
      { id: `meal_${Date.now()}`, name, icon: "🍽️", suggested: "custom", foods: [] },
    ]);
  }, []);

  return (
    <>
      <Navbar />
      <div className="addplan-page pt-6">
        {/* Topbar */}
        <div className="topbar">
          <span className="topbar-title">Clinical Diet Planner</span>
          <div className="topbar-tabs">
            {PAGE_TABS.map((t) => (
              <button
                key={t}
                className={`tab-btn ${activeTab === t ? "active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="topbar-actions">
            <button className="btn-outline">Export PDF</button>
            <button className="btn-primary">Save &amp; Publish</button>
          </div>
        </div>

        {/* Patient Bar */}
        <PatientBar
          firstName={form.firstName}
          lastName={form.lastName}
          weight={form.weight}
          height={form.height}
          goal={form.goal}
        />

        {/* Content */}
        <div className="content-grid">
          <DietCalculator
            form={form}
            onFormChange={handleFormChange}
            equation={equation}
            onEqChange={setEquation}
            onCalculate={handleCalculate}
            targets={targets}
          />

          <MealStructure
            meals={meals}
            onAddFood={handleAddFood}
            onAddMeal={handleAddMeal}
            targets={targets}
            totalEaten={totalEaten}
          />
        </div>
      </div>
      <Footer />
    </>
  )
}

