// src/features/diet-plan/components/DietCalculator.tsx

import Ring from "./Ring";
import type { DietCalculatorProps } from "../types";
import { EQUATIONS, ACTIVITY_OPTIONS } from "../constants";
import { selectRingItems } from "../logic/selectors";

export default function DietCalculator({
  form, onFormChange, equation, onEqChange, onCalculate, targets,
}: DietCalculatorProps) {
  // Ring تتحسب بعد ما يضغط Calculate — قبلها كل حاجة 0%
  const ringItems = selectRingItems(targets, 0, 0, 0, 0);

  return (
    <div className="section">
      <div className="section-title">Diet Calculator</div>

      <div className="eq-row">
        {EQUATIONS.map((eq) => (
          <button
            key={eq.key}
            className={`eq-btn ${equation === eq.key ? "active" : ""}`}
            onClick={() => onEqChange(eq.key)}
          >
            {eq.label}
          </button>
        ))}
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>First Name</label>
          <input value={form.firstName} onChange={(e) => onFormChange("firstName", e.target.value)} />
        </div>
        <div className="field-group">
          <label>Last Name</label>
          <input value={form.lastName}  onChange={(e) => onFormChange("lastName",  e.target.value)} />
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>Gender</label>
          <select value={form.gender} onChange={(e) => onFormChange("gender", e.target.value)}>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
        <div className="field-group">
          <label>Goal</label>
          <select value={form.goal} onChange={(e) => onFormChange("goal", e.target.value)}>
            <option value="loss">Weight Loss</option>
            <option value="gain">Weight Gain</option>
            <option value="maintain">Maintain</option>
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>Weight (KG)</label>
          <input type="number" min={0} value={form.weight || ""}
            onChange={(e) => onFormChange("weight", parseFloat(e.target.value) || 0)} />
        </div>
        <div className="field-group">
          <label>Height (CM)</label>
          <input type="number" min={0} value={form.height || ""}
            onChange={(e) => onFormChange("height", parseFloat(e.target.value) || 0)} />
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>Age</label>
          <input type="number" min={0} value={form.age || ""}
            onChange={(e) => onFormChange("age", parseInt(e.target.value) || 0)} />
        </div>
        <div className="field-group">
          <label>Activity Level</label>
          <select value={form.activity} onChange={(e) => onFormChange("activity", parseFloat(e.target.value))}>
            {ACTIVITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>Calorie Deficit (KCAL)</label>
          <input type="number" min={0} value={form.deficit || ""}
            onChange={(e) => onFormChange("deficit", parseInt(e.target.value) || 0)} />
        </div>
        <div className="field-group">
          <label>Body Fat %</label>
          <input type="number" min={0} max={99} value={form.bodyfat || ""}
            onChange={(e) => onFormChange("bodyfat", parseFloat(e.target.value) || 0)} />
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label>Neck (CM)</label>
          <input type="number" min={0} value={form.neck || ""}
            onChange={(e) => onFormChange("neck", parseFloat(e.target.value) || 0)} />
        </div>
        <div className="field-group">
          <label>Waist (CM)</label>
          <input type="number" min={0} value={form.waist || ""}
            onChange={(e) => onFormChange("waist", parseFloat(e.target.value) || 0)} />
        </div>
      </div>

      <button className="calc-btn" onClick={onCalculate}>⚡ Calculate</button>

      {targets.cal > 0 && (
        <div style={{ marginTop: 20 }}>
          <div className="section-title">Calculated Targets</div>
          <div className="targets-grid">
            {ringItems.map((item) => (
              <div key={item.label} className="target-card">
                <Ring value={item.value} unit={item.unit} offset={item.offset} />
                <div className="target-label">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="lbm-info">
            LBM: <strong>{targets.lbm} kg</strong>
            &nbsp;|&nbsp;
            TDEE: <strong>{targets.tdee} kcal</strong>
          </div>
        </div>
      )}
    </div>
  );
}