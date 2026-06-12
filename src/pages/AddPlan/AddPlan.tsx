// src/pages/AddPlan/AddPlan.tsx
import { useState, useCallback, useEffect } from "react";
import "./styles/Addplan.css";
import { PatientBar, DietCalculator } from "../../components/addplan/features/components";
import FoodPicker from "../../components/addplan/features/components/FoodPicker";
import MealBlock from "../../components/addplan/features/components/MealBlock";
import type { PatientForm, DietTargets, Meal, Equation, FoodItem } from "../../components/addplan/features/types";
import { DAYS_OF_WEEK } from "../../components/addplan/features/constants";
import { INITIAL_FORM, INITIAL_TARGETS } from "../../components/addplan/features/data";
import { computeTargets } from "../../components/addplan/features/logic/calculations";
import { savePlan, updatePlan, fetchMyPatients, fetchPatientPlans, type ApiPatient } from "@/lib/api";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/footer/Footer";

const MEAL_TYPE: Record<string, "BREAKFAST" | "LUNCH" | "DINNER" | "SNACKS"> = {
  bf: "BREAKFAST", lunch: "LUNCH", dinner: "DINNER", snack: "SNACKS",
};

// الوجبات الأساسية لكل يوم
const DEFAULT_MEALS = (): Meal[] => [
  { id: "bf",     name: "Breakfast", icon: "🌅", suggested: "450–500 kcal", foods: [] },
  { id: "lunch",  name: "Lunch",     icon: "🥗", suggested: "600–700 kcal", foods: [] },
  { id: "dinner", name: "Dinner",    icon: "🌙", suggested: "500–600 kcal", foods: [] },
  { id: "snack",  name: "Snacks",    icon: "🍎", suggested: "~200 kcal",    foods: [] },
];

// نبني الـ week state: كل يوم عنده meals منفصلة
const buildInitialWeek = (): Record<string, Meal[]> => {
  const week: Record<string, Meal[]> = {};
  DAYS_OF_WEEK.forEach(d => { week[d] = DEFAULT_MEALS(); });
  return week;
};

export default function AddPlan() {
  const [activeDay, setActiveDay] = useState<string>("Sun");
  const [equation,  setEquation]  = useState<Equation>("katch");
  const [form,      setForm]      = useState<PatientForm>(INITIAL_FORM);
  const [targets,   setTargets]   = useState<DietTargets>(INITIAL_TARGETS);

  // ✅ كل يوم عنده meals منفصلة
  const [weekMeals, setWeekMeals] = useState<Record<string, Meal[]>>(buildInitialWeek());

  const [pickerMealId,  setPickerMealId]  = useState<string | null>(null);
  const [pickerDay,     setPickerDay]     = useState<string | null>(null);

  const [dbPatients,        setDbPatients]        = useState<ApiPatient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [editPlanId,        setEditPlanId]        = useState<string | null>(null);
  const [showPlansModal,    setShowPlansModal]    = useState(false);
  const [savedPlans,        setSavedPlans]        = useState<any[]>([]);
  const [loadingPlans,      setLoadingPlans]      = useState(false);
  // تاريخ بداية الخطة — default اليوم
  const todayStr = (() => { const t = new Date(); return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}` })();
  const [planStartDate, setPlanStartDate] = useState<string>(todayStr);

  // ─── جيب المرضى + افحص editPlanId ───
  useEffect(() => {
    const savedPatientId  = localStorage.getItem("selectedPatientId");
    const savedEditPlanId = localStorage.getItem("editPlanId");

    fetchMyPatients()
      .then((list) => {
        setDbPatients(list);
        if (savedPatientId && list.find((p) => p._id === savedPatientId)) {
          setSelectedPatientId(savedPatientId);
        } else if (list.length) {
          setSelectedPatientId(list[0]._id);
        }
      })
      .catch((e) => console.error("تعذّر تحميل المرضى:", e.message));

    if (savedEditPlanId) {
      setEditPlanId(savedEditPlanId);
      localStorage.removeItem("editPlanId");
    }
  }, []);

  // ─── حمّل الـ plan الموجودة لو editPlanId ───
  useEffect(() => {
    if (!editPlanId || !selectedPatientId) return;
    fetchPatientPlans(selectedPatientId)
      .then((plans: any[]) => {
        const plan = plans.find((p: any) => p._id === editPlanId);
        if (!plan) return;

        // استرجع الـ calculator data
        if (plan.calculatorData) {
          const cd = plan.calculatorData;
          if (cd.equation) setEquation(cd.equation as any);
          const fields = ['firstName','lastName','gender','goal','weight','height','age','activity','deficit','bodyfat','neck','waist'];
          fields.forEach(f => { if (cd[f] !== undefined) handleFormChange(f as keyof PatientForm, String(cd[f])); });
        }
        // استرجع startDate
        if (plan.startDate) {
          const d = new Date(plan.startDate);
          setPlanStartDate(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`);
        }

        setTargets({
          cal:  plan.caloriesTarget ?? 0,
          pro:  plan.protein ?? 0,
          fat:  plan.fats ?? 0,
          carb: plan.carbs ?? 0,
          lbm:  0, tdee: 0,
        });

        // ✅ لو عنده days structure جديدة
        if (plan.days && plan.days.length > 0) {
          const loaded = buildInitialWeek();
          plan.days.forEach((d: any) => {
            if (!loaded[d.day]) return;
            const mealMap: Record<string, any[]> = { bf: [], lunch: [], dinner: [], snack: [] };
            const typeToId: Record<string, string> = {
              BREAKFAST: "bf", LUNCH: "lunch", DINNER: "dinner", SNACKS: "snack",
            };
            d.meals.forEach((m: any) => {
              const key = typeToId[m.type] ?? "snack";
              mealMap[key].push({ name: m.name, kcal: m.calories ?? 0 });
            });
            loaded[d.day] = DEFAULT_MEALS().map(meal => ({
              ...meal, foods: mealMap[meal.id] ?? [],
            }));
          });
          setWeekMeals(loaded);
        }
      })
      .catch((e) => console.error("تعذّر تحميل الـ Plan:", e.message));
  }, [editPlanId, selectedPatientId]);

  // ✅ لما الدكتور يختار مريض، نعبي بياناته في الـ form تلقائي
  const selectedPatient = dbPatients.find(p => p._id === selectedPatientId);
  useEffect(() => {
    if (!selectedPatient) return;
    const nameParts = selectedPatient.name.trim().split(" ");
    setForm(prev => ({
      ...prev,
      firstName: nameParts[0] ?? "",
      lastName:  nameParts.slice(1).join(" ") || "",
      weight:    selectedPatient.weight  ?? prev.weight,
      height:    selectedPatient.height  ?? prev.height,
    }));
  }, [selectedPatientId]);

  // ─── الوجبات اللي شايفاها دلوقتي (اليوم النشط) ───
  const currentMeals = weekMeals[activeDay] ?? DEFAULT_MEALS();
  const totalEaten   = currentMeals.reduce((s, m) => s + m.foods.reduce((ss, f) => ss + f.kcal, 0), 0);
  const remaining    = targets.cal - totalEaten;

  const handleFormChange = useCallback(
    (key: keyof PatientForm, value: string | number) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    []
  );

  const handleCalculate = useCallback(() => {
    setTargets(computeTargets({ ...form, equation }));
  }, [form, equation]);

  const handleAddFood = useCallback((mealId: string) => {
    setPickerMealId(mealId);
    setPickerDay(activeDay);
  }, [activeDay]);

  const handlePickFood = useCallback((food: FoodItem) => {
    if (!pickerMealId || !pickerDay) return;
    setWeekMeals(prev => ({
      ...prev,
      [pickerDay]: prev[pickerDay].map(m =>
        m.id === pickerMealId ? { ...m, foods: [...m.foods, food] } : m
      ),
    }));
  }, [pickerMealId, pickerDay]);

  const handleRemoveFood = useCallback((mealId: string, index: number) => {
    setWeekMeals(prev => ({
      ...prev,
      [activeDay]: prev[activeDay].map(m =>
        m.id === mealId ? { ...m, foods: m.foods.filter((_, i) => i !== index) } : m
      ),
    }));
  }, [activeDay]);

  const handleAddMeal = useCallback(() => {
    const name = window.prompt("Meal name:") || "New Meal";
    setWeekMeals(prev => ({
      ...prev,
      [activeDay]: [
        ...prev[activeDay],
        { id: `meal_${Date.now()}`, name, icon: "🍽️", suggested: "custom", foods: [] },
      ],
    }));
  }, [activeDay]);

  // ─── حفظ / تعديل ───
  // ─── فتح modal الـ plans المحفوظة ───
  const handleOpenPlans = useCallback(async () => {
    if (!selectedPatientId) { alert("اختاري مريض الأول"); return; }
    setLoadingPlans(true);
    setShowPlansModal(true);
    try {
      const plans = await fetchPatientPlans(selectedPatientId);
      setSavedPlans(plans);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoadingPlans(false);
    }
  }, [selectedPatientId]);

  // ─── تحميل plan معينة في الصفحة ───
  const handleLoadPlan = useCallback((plan: any) => {
    setEditPlanId(plan._id);

    // استرجع الـ calculator data
    if (plan.calculatorData) {
      const cd = plan.calculatorData;
      if (cd.equation) setEquation(cd.equation as any);
      const fields = ['firstName','lastName','gender','goal','weight','height','age','activity','deficit','bodyfat','neck','waist'];
      fields.forEach((f: string) => { if (cd[f] !== undefined) handleFormChange(f as any, String(cd[f])); });
    }

    // استرجع startDate
    if (plan.startDate) {
      const d = new Date(plan.startDate);
      setPlanStartDate(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`);
    }

    // استرجع targets
    setTargets({
      cal:  plan.caloriesTarget ?? 0,
      pro:  plan.protein ?? 0,
      fat:  plan.fats ?? 0,
      carb: plan.carbs ?? 0,
      lbm:  0, tdee: 0,
    });

    // استرجع الوجبات
    if (plan.days && plan.days.length > 0) {
      const loaded = buildInitialWeek();
      const typeToId: Record<string, string> = {
        BREAKFAST: "bf", LUNCH: "lunch", DINNER: "dinner", SNACKS: "snack",
      };
      plan.days.forEach((d: any) => {
        if (!loaded[d.day]) return;
        const mealMap: Record<string, any[]> = { bf: [], lunch: [], dinner: [], snack: [] };
        d.meals.forEach((m: any) => {
          const key = typeToId[m.type] ?? "snack";
          mealMap[key].push({ name: m.name, kcal: m.calories ?? 0 });
        });
        loaded[d.day] = DEFAULT_MEALS().map(meal => ({
          ...meal, foods: mealMap[meal.id] ?? [],
        }));
      });
      setWeekMeals(loaded);
    }

    setShowPlansModal(false);
  }, [handleFormChange]);

  const handleSave = useCallback(async () => {
    if (!selectedPatientId) { alert("اختاري مريض من القائمة فوق الأول"); return; }
    if (!targets.cal)       { alert("احسبي الـ Target الأول من الـ Calculator"); return; }

    // نبني الـ days payload
    const daysPayload = DAYS_OF_WEEK.map(day => ({
      day,
      meals: weekMeals[day].flatMap(m =>
        m.foods.map(f => ({
          type:     MEAL_TYPE[m.id] ?? "SNACKS",
          name:     f.name,
          calories: f.kcal,
          protein:  f.protein  ?? 0,
          carbs:    f.carbs    ?? 0,
          fats:     f.fat      ?? 0,
        }))
      ),
    })).filter(d => d.meals.length > 0); // بس الأيام اللي فيها أكل

    const patientName = dbPatients.find((p) => p._id === selectedPatientId)?.name ?? "Patient";

    const payload = {
      patient:        selectedPatientId,
      title:          `${patientName} Diet Plan`,
      category:       "nutrition",
      caloriesTarget: targets.cal,
      protein:        targets.pro,
      carbs:          targets.carb,
      fats:           targets.fat,
      days:           daysPayload,
      startDate:      planStartDate,
      calculatorData: {
        equation:      equation,
        firstName:     form.firstName,
        lastName:      form.lastName,
        gender:        form.gender,
        goal:          form.goal,
        weight:        parseFloat(form.weight as any) || 0,
        height:        parseFloat(form.height as any) || 0,
        age:           parseFloat(form.age as any) || 0,
        activityLevel: form.activity,
        calorieDef:    parseFloat(form.deficit as any) || 0,
        bodyFat:       parseFloat(form.bodyfat as any) || 0,
        neck:          parseFloat(form.neck as any) || 0,
        waist:         parseFloat(form.waist as any) || 0,
      },
    };

    try {
      if (editPlanId) {
        await updatePlan(editPlanId, payload);
        alert("تم تعديل الخطة بنجاح ✓");
      } else {
        await savePlan(payload as any);
        alert("تم حفظ الخطة بنجاح ✓ هتظهر عند المريض");
      }
    } catch (e) {
      alert((e as Error).message);
    }
  }, [weekMeals, targets, selectedPatientId, dbPatients, editPlanId]);

  // ── Export PDF ──────────────────────────────────────────────
  const handleExportPDF = () => {
    const patient = dbPatients.find(p => p._id === selectedPatientId);
    const patientName = patient?.name || "Patient";

    // احسب تاريخ كل يوم من startDate
    const getWeekDates = () => {
      const result: Record<string, string> = {};
      const [y, m, d] = planStartDate ? planStartDate.split("-").map(Number) : [new Date().getFullYear(), new Date().getMonth()+1, new Date().getDate()];
      const start = new Date(y, m-1, d);
      const startDay = start.getDay();
      DAYS_OF_WEEK.forEach((day, i) => {
        const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        const idx = days.indexOf(day);
        const dt = new Date(start);
        dt.setDate(dt.getDate() - startDay + idx);
        result[day] = dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
      });
      return result;
    };
    const weekDates = getWeekDates();

    // بنبني كل يوم كـ section منفصل
    const daysSections = DAYS_OF_WEEK.map(day => {
      const meals = weekMeals[day] || [];
      const hasFoods = meals.some(m => m.foods.length > 0);
      if (!hasFoods) return "";

      // حساب إجمالي اليوم
      const dayTotalCal  = meals.reduce((s, m) => s + m.foods.reduce((fs, f) => fs + (f.kcal || 0), 0), 0);
      const dayTotalPro  = meals.reduce((s, m) => s + m.foods.reduce((fs, f) => fs + (f.protein || 0), 0), 0);
      const dayTotalCarb = meals.reduce((s, m) => s + m.foods.reduce((fs, f) => fs + (f.carbs || 0), 0), 0);
      const dayTotalFat  = meals.reduce((s, m) => s + m.foods.reduce((fs, f) => fs + (f.fat || 0), 0), 0);

      const mealBlocks = meals.filter(m => m.foods.length > 0).map(m => {
        const mealCal = m.foods.reduce((s, f) => s + (f.kcal || 0), 0);
        const foodRows = m.foods.map(f => `
          <tr>
            <td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;color:#374151">${f.name}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:right;color:#065F46;font-weight:600">${f.kcal} kcal</td>
            <td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:right;color:#6b7280">${f.protein ?? 0}g</td>
            <td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:right;color:#6b7280">${f.carbs ?? 0}g</td>
            <td style="padding:6px 10px;border-bottom:1px solid #f3f4f6;text-align:right;color:#6b7280">${f.fat ?? 0}g</td>
          </tr>`).join("");

        return `
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;align-items:center;background:#f0fdf4;border-left:3px solid #065F46;padding:6px 10px;border-radius:4px">
              <span style="font-size:13px;font-weight:700;color:#065F46">${m.icon || "🍽️"} ${m.name}</span>
              <span style="font-size:12px;color:#065F46;font-weight:600">${mealCal} kcal</span>
            </div>
            <table style="width:100%;border-collapse:collapse;margin-top:4px">
              <tr style="background:#f9fafb">
                <th style="padding:4px 10px;text-align:left;font-size:11px;color:#9ca3af;font-weight:600">FOOD</th>
                <th style="padding:4px 10px;text-align:right;font-size:11px;color:#9ca3af;font-weight:600">CALORIES</th>
                <th style="padding:4px 10px;text-align:right;font-size:11px;color:#9ca3af;font-weight:600">PROTEIN</th>
                <th style="padding:4px 10px;text-align:right;font-size:11px;color:#9ca3af;font-weight:600">CARBS</th>
                <th style="padding:4px 10px;text-align:right;font-size:11px;color:#9ca3af;font-weight:600">FATS</th>
              </tr>
              ${foodRows}
            </table>
          </div>`;
      }).join("");

      return `
        <div style="margin-bottom:28px;page-break-inside:avoid">
          <div style="display:flex;justify-content:space-between;align-items:center;background:#065F46;color:white;padding:10px 14px;border-radius:8px 8px 0 0">
            <div>
              <div style="font-size:16px;font-weight:700">${day}</div>
              <div style="font-size:11px;opacity:0.8">${weekDates[day]}</div>
            </div>
            <div style="display:flex;gap:16px;font-size:12px">
              <span>🔥 ${dayTotalCal} kcal</span>
              <span>💪 ${Math.round(dayTotalPro)}g protein</span>
              <span>🌾 ${Math.round(dayTotalCarb)}g carbs</span>
              <span>🥑 ${Math.round(dayTotalFat)}g fats</span>
            </div>
          </div>
          <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;padding:12px">
            ${mealBlocks}
          </div>
        </div>`;
    }).join("");

    const startDateLabel = planStartDate
      ? new Date(...(planStartDate.split("-").map(Number) as [number,number,number])).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "N/A";

    const html = `
      <html><head>
      <meta charset="utf-8"/>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; padding: 28px; color: #1a1a1a; background: white; }
        @media print {
          body { padding: 16px; }
          .no-print { display: none; }
        }
      </style>
      </head><body>
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #065F46">
          <div>
            <h1 style="color:#065F46;font-size:24px;font-weight:700;margin-bottom:4px">🥗 Weekly Diet Plan</h1>
            <p style="color:#374151;font-size:15px;font-weight:600">${patientName}</p>
            <p style="color:#9ca3af;font-size:12px;margin-top:2px">Start: ${startDateLabel} &nbsp;·&nbsp; Generated: ${new Date().toLocaleDateString("en-US")}</p>
          </div>
          <div style="text-align:right">
            <p style="font-size:11px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:1px">Daily Targets</p>
            <div style="display:flex;gap:10px;margin-top:6px">
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:8px 12px;text-align:center">
                <div style="font-size:18px;font-weight:700;color:#065F46">${targets.cal}</div>
                <div style="font-size:10px;color:#6b7280">kcal</div>
              </div>
              <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:8px 12px;text-align:center">
                <div style="font-size:18px;font-weight:700;color:#1d4ed8">${targets.pro}g</div>
                <div style="font-size:10px;color:#6b7280">protein</div>
              </div>
              <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:8px 12px;text-align:center">
                <div style="font-size:18px;font-weight:700;color:#92400e">${targets.carb}g</div>
                <div style="font-size:10px;color:#6b7280">carbs</div>
              </div>
              <div style="background:#fdf4ff;border:1px solid #e9d5ff;border-radius:8px;padding:8px 12px;text-align:center">
                <div style="font-size:18px;font-weight:700;color:#7c3aed">${targets.fat}g</div>
                <div style="font-size:10px;color:#6b7280">fats</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Days -->
        ${daysSections || "<p style='color:#9ca3af;text-align:center;padding:40px'>No meals added yet</p>"}

        <!-- Footer -->
        <div style="margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;text-align:center;color:#9ca3af;font-size:11px">
          Healthia — Clinical Diet Planner
        </div>
      </body></html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 600);
  };

  const pickerMeal = currentMeals.find((m) => m.id === pickerMealId);

  return (
    <>
      <Navbar />
      <div className="addplan-page pt-6">
        {/* Topbar */}
        <div className="topbar">
          <span className="topbar-title">Clinical Diet Planner</span>
          <div className="topbar-actions">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 11, color: "#666", whiteSpace: "nowrap" }}>Start Date:</label>
              <input type="date" value={planStartDate} onChange={e => setPlanStartDate(e.target.value)}
                style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: "4px 8px", fontSize: 12 }} />
            </div>
            <button className="btn-outline" onClick={handleOpenPlans}>📂 Load Plan</button>
            <button className="btn-outline" onClick={handleExportPDF}>Export PDF</button>
            <button className="btn-primary" onClick={handleSave}>
              {editPlanId ? "Update Plan" : "Save & Publish"}
            </button>
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

          {/* Meal Section مع Days */}
          <div className="meal-section">
            <div className="meal-section-header">
              <div className="section-title">Daily Meal Structure</div>
            </div>

            {/* شريط السعرات */}
            <div className="cal-tracker">
              <div className="cal-box">
                <div className="cal-label">Daily Target</div>
                <div className="cal-val">{targets.cal || "—"} kcal</div>
              </div>
              <div className="cal-box">
                <div className="cal-label">Selected</div>
                <div className="cal-val">{totalEaten} kcal</div>
              </div>
              <div className={`cal-box ${remaining < 0 ? "bad" : remaining < 200 ? "warn" : "ok"}`}>
                <div className="cal-label">Remaining</div>
                <div className="cal-val">{targets.cal ? remaining : "—"} kcal</div>
              </div>
            </div>

            {/* Days Row */}
            <div className="days-row">
              {DAYS_OF_WEEK.map((d) => {
                const dayMeals  = weekMeals[d] ?? [];
                const hasFoods  = dayMeals.some(m => m.foods.length > 0);
                return (
                  <button
                    key={d}
                    className={`day-btn ${activeDay === d ? "active" : ""}`}
                    onClick={() => setActiveDay(d)}
                    style={{ position: "relative" }}
                  >
                    {d}
                    {/* نقطة خضرا لو اليوم عنده أكل */}
                    {hasFoods && (
                      <span style={{
                        position: "absolute", top: 2, right: 4,
                        width: 6, height: 6, borderRadius: "50%",
                        background: activeDay === d ? "#fff" : "#065F46",
                        display: "block",
                      }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* وجبات اليوم النشط */}
            <div style={{ marginTop: 8 }}>
              {currentMeals.map((meal, i) => (
                <MealBlock
                  key={meal.id}
                  icon={meal.icon}
                  name={meal.name}
                  suggested={meal.suggested}
                  foods={meal.foods}
                  onAddFood={() => handleAddFood(meal.id)}
                  onRemoveFood={(index) => handleRemoveFood(meal.id, index)}
                  defaultOpen={i === 0}
                />
              ))}
              <button className="add-meal-btn" onClick={handleAddMeal}>+ Add Meal</button>
            </div>
          </div>
        </div>
      </div>

      {pickerMeal && (
        <FoodPicker
          mealName={pickerMeal.name}
          onPick={handlePickFood}
          onClose={() => { setPickerMealId(null); setPickerDay(null); }}
        />
      )}

      {/* ─── Modal: الـ Plans المحفوظة ─── */}
      {showPlansModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }}>
          <div style={{
            background: "#fff", borderRadius: 20, width: "100%", maxWidth: 560,
            maxHeight: "80vh", display: "flex", flexDirection: "column",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}>
            {/* Header */}
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>📂 Saved Plans</h2>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>
                  {dbPatients.find(p => p._id === selectedPatientId)?.name ?? ""}
                </p>
              </div>
              <button onClick={() => setShowPlansModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#9ca3af", lineHeight: 1 }}>
                ×
              </button>
            </div>

            {/* Body */}
            <div style={{ overflowY: "auto", padding: "16px 24px 24px", flex: 1 }}>
              {loadingPlans ? (
                <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>Loading...</p>
              ) : savedPlans.length === 0 ? (
                <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>No saved plans for this patient</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {savedPlans.map((plan: any) => {
                    const date = plan.startDate
                      ? new Date(plan.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "No date";
                    const daysWithFood = (plan.days ?? []).filter((d: any) => d.meals?.length > 0).length;
                    return (
                      <button key={plan._id} onClick={() => handleLoadPlan(plan)}
                        style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "14px 16px", border: "1.5px solid #e5e7eb", borderRadius: 12,
                          background: "#fafafa", cursor: "pointer", textAlign: "left",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#065F46"; (e.currentTarget as HTMLElement).style.background = "#f0fdf4"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a" }}>{plan.title}</div>
                          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>
                            📅 {date} &nbsp;·&nbsp; {daysWithFood} days with meals
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#065F46" }}>{plan.caloriesTarget} kcal</div>
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                            P:{plan.protein}g · C:{plan.carbs}g · F:{plan.fats}g
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}