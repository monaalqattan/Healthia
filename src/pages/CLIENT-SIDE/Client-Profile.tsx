import { useState, useEffect } from "react"
import {
  Share2, Flag, TrendingDown, Target, Activity,
  FileText, Check, Pencil, Plus, X, Download, Stethoscope
} from "lucide-react"
import { patientService } from "@/services/api"

export default function ClientProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [copied, setCopied] = useState(false)
  const [patient, setPatient] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "", phone: "", age: "" as string | number, address: "",
    weight: "" as string | number, height: "" as string | number,
    goals: [] as string[],
    allergies: [] as string[],
    chronicDiseases: [] as string[],
    activityLevel: "",
  })
  const [newGoal, setNewGoal] = useState("")
  const [newAllergy, setNewAllergy] = useState("")
  const [newDisease, setNewDisease] = useState("")

  useEffect(() => {
    patientService.getMyProfile()
      .then(res => {
        const p = res.data
        setPatient(p)
        setFormData({
          name: p.name || "",
          phone: p.phone || "",
          age: p.age || "",
          address: p.address || "",
          weight: p.weight || "",
          height: p.height || "",
          goals: p.goals || [],
          allergies: p.allergies || [],
          chronicDiseases: p.chronicDiseases || [],
          activityLevel: p.activityLevel || "",
        })
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addTag = (field: "goals" | "allergies" | "chronicDiseases", value: string) => {
    if (!value.trim()) return
    setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }))
    if (field === "goals") setNewGoal("")
    if (field === "allergies") setNewAllergy("")
    if (field === "chronicDiseases") setNewDisease("")
  }

  const removeTag = (field: "goals" | "allergies" | "chronicDiseases", index: number) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }))
  }

  const handleEditToggle = async () => {
    // لو مش في edit mode → ادخل edit mode بس من غير ما تحفظ
    if (!isEditing) {
      setIsEditing(true)
      return
    }

    // لو في edit mode → احفظ
    setIsSaving(true)
    setSaveError("")
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        age: formData.age ? Number(formData.age) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        goals: formData.goals,
        allergies: formData.allergies,
        chronicDiseases: formData.chronicDiseases,
        activityLevel: formData.activityLevel,
      }
      const res = await patientService.updateMyProfile(payload)
      setPatient(res.data.patient)
      setIsEditing(false)
    } catch (err: any) {
      setSaveError(err.response?.data?.message || "Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  // Export: فتح نافذة طباعة
  const handleExport = () => {
    window.print()
  }

  // Share: نسخ الـ URL
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const dummy = document.createElement("input")
      document.body.appendChild(dummy)
      dummy.value = window.location.href
      dummy.select()
      document.execCommand("copy")
      document.body.removeChild(dummy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center text-gray-400">Loading...</div>
  )

  const bmi = patient?.bmi || 0
  const currentWeight = Number(formData.weight) || patient?.weight || 0
  const targetWeight = Math.max(0, currentWeight - 5)
  const startWeight = patient?.weight || currentWeight
  const activityOptions = ["sedentary", "light", "moderate", "active", "very active"]

  // صورة افتراضية بالحرف الأول
  const avatarUrl = patient?.profileImage || null
  const avatarInitial = patient?.name ? patient.name[0].toUpperCase() : "P"

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen w-full font-sans overflow-x-hidden">

      {/* Top Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div className="flex items-center gap-5">
          {/* صورة أو default avatar */}
          <div className="relative w-20 h-20 rounded-full border-4 border-emerald-50 overflow-hidden bg-emerald-700 shrink-0 flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-white">{avatarInitial}</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-950">{patient?.name}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="bg-emerald-800 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                {patient?.category || "Nutrition & Wellness"}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Active Patient
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full px-6 py-3 text-sm font-bold transition-all"
          >
            <Download size={15} /> Export Record
          </button>
          <button
            onClick={handleShare}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-700 text-white rounded-full px-6 py-3 text-sm font-bold hover:bg-emerald-900 transition-all"
          >
            {copied ? <><Check size={15} /> Copied!</> : <><Share2 size={15} /> Share Report</>}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Personal Info */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
              <button
                onClick={handleEditToggle}
                disabled={isSaving}
                className={`text-sm font-bold flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all ${
                  isEditing ? "bg-emerald-50 text-emerald-800" : "text-emerald-800 hover:underline"
                } disabled:opacity-50`}
              >
                {isSaving ? "Saving..." : isEditing
                  ? <><Check size={14} /> Save Changes</>
                  : <><Pencil size={12} /> Edit Fields</>}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "Full Name",     name: "name",  type: "text" },
                { label: "Email Address", name: "email", type: "email" },
                { label: "Phone Number",  name: "phone", type: "text" },
                { label: "Age",           name: "age",   type: "number" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
                  {isEditing && name !== "email" ? (
                    <input
                      type={type} name={name}
                      value={(formData as any)[name]}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-emerald-700 rounded-xl p-3 text-sm font-semibold text-gray-800 outline-none"
                    />
                  ) : (
                    <div className="bg-[#F4F4F5] rounded-xl p-3.5 text-sm font-semibold text-gray-800">
                      {name === "email" ? patient?.email : (formData as any)[name] || "—"}
                    </div>
                  )}
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Address</label>
                {isEditing ? (
                  <input type="text" name="address" value={formData.address} onChange={handleChange}
                    className="w-full bg-white border-2 border-emerald-700 rounded-xl p-3 text-sm font-semibold text-gray-800 outline-none" />
                ) : (
                  <div className="bg-[#F4F4F5] rounded-xl p-3.5 text-sm font-semibold text-gray-800">{formData.address || "—"}</div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Activity Level</label>
                {isEditing ? (
                  <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}
                    className="w-full bg-white border-2 border-emerald-700 rounded-xl p-3 text-sm font-semibold text-gray-800 outline-none capitalize">
                    <option value="">Select level</option>
                    {activityOptions.map(o => <option key={o} value={o} className="capitalize">{o}</option>)}
                  </select>
                ) : (
                  <div className="bg-[#F4F4F5] rounded-xl p-3.5 text-sm font-semibold text-gray-800 capitalize">
                    {formData.activityLevel || "—"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Goal Progress */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Goal Progress</h2>
                <p className="text-xs text-gray-400 mt-0.5">{patient?.period || "Active Program"}</p>
              </div>
              <span className="text-4xl font-black text-[#016333]">{bmi > 0 ? bmi : "—"}</span>
            </div>
            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-8 p-0.5">
              <div className="bg-[#016333] h-full rounded-full" style={{ width: "70%" }}></div>
            </div>
            <div className="grid grid-cols-3 gap-4 bg-gray-50/50 p-4 rounded-2xl">
              {[
                { icon: <Flag size={18} />,        label: "Start",   value: `${startWeight} kg` },
                { icon: <TrendingDown size={18} />, label: "Current", value: `${currentWeight} kg` },
                { icon: <Target size={18} />,       label: "Target",  value: `${targetWeight} kg` },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 ${i === 1 ? "border-x border-gray-200/60 px-4" : ""}`}>
                  <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-[#016333]">{item.icon}</div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-extrabold uppercase">{item.label}</p>
                    <p className="text-base font-bold text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Doctor */}
          {patient?.doctor && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2.5">
                <div className="p-1.5 bg-green-50 rounded-lg text-[#016333]"><Stethoscope size={16} /></div>
                My Doctor
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {patient.doctor.name ? patient.doctor.name[0].toUpperCase() : "D"}
                </div>
                <div>
                  <p className="font-bold text-gray-900">Dr. {patient.doctor.name}</p>
                  {patient.doctor.specialization && (
                    <p className="text-xs text-gray-400 mt-0.5">{patient.doctor.specialization}</p>
                  )}
                  {patient.doctor.email && (
                    <p className="text-xs text-gray-400 mt-0.5">{patient.doctor.email}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">

          {/* Health Metrics */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5">
              <div className="p-1.5 bg-green-50 rounded-lg text-[#016333]"><Activity size={16} /></div>
              Health Metrics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Weight", name: "weight", value: `${formData.weight || "—"} kg` },
                { label: "Height", name: "height", value: `${formData.height || "—"} cm` },
                { label: "BMI",    name: null,     value: patient?.bmi || "—" },
                { label: "Activity", name: null,   value: formData.activityLevel || "—" },
              ].map(item => (
                <div key={item.label} className="bg-gray-50/70 border border-gray-100/50 rounded-2xl p-4">
                  <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-1">{item.label}</p>
                  {isEditing && item.name ? (
                    <input type="number" name={item.name}
                      value={(formData as any)[item.name]}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-emerald-700 rounded-lg p-1.5 text-sm font-bold text-[#016333] outline-none" />
                  ) : (
                    <p className="text-lg font-black text-[#016333] capitalize">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Overview */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5">
              <div className="p-1.5 bg-green-50 rounded-lg text-[#016333]"><FileText size={16} /></div>
              Clinical Overview
            </h2>
            <div className="space-y-5">

              {/* Goals */}
              <div>
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Goals</p>
                <div className="flex gap-2 flex-wrap">
                  {formData.goals.map((g, i) => (
                    <span key={i} className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-xl">
                      {g}
                      {isEditing && <button onClick={() => removeTag("goals", i)} className="ml-1 hover:text-red-500"><X size={10} /></button>}
                    </span>
                  ))}
                  {formData.goals.length === 0 && !isEditing && <span className="text-sm text-gray-400">No goals set</span>}
                </div>
                {isEditing && (
                  <div className="flex gap-2 mt-2">
                    <input value={newGoal} onChange={e => setNewGoal(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addTag("goals", newGoal)}
                      placeholder="Add goal..."
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-500" />
                    <button onClick={() => addTag("goals", newGoal)} className="p-1.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"><Plus size={14} /></button>
                  </div>
                )}
              </div>

              {/* Allergies */}
              <div>
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Allergies</p>
                <div className="flex gap-2 flex-wrap">
                  {formData.allergies.map((a, i) => (
                    <span key={i} className="flex items-center gap-1 bg-red-50 text-red-600 text-[10px] font-extrabold px-3 py-1.5 rounded-xl uppercase">
                      {a}
                      {isEditing && <button onClick={() => removeTag("allergies", i)} className="ml-1 hover:text-red-800"><X size={10} /></button>}
                    </span>
                  ))}
                  {formData.allergies.length === 0 && !isEditing && <span className="text-sm text-gray-400">None recorded</span>}
                </div>
                {isEditing && (
                  <div className="flex gap-2 mt-2">
                    <input value={newAllergy} onChange={e => setNewAllergy(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addTag("allergies", newAllergy)}
                      placeholder="Add allergy..."
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-500" />
                    <button onClick={() => addTag("allergies", newAllergy)} className="p-1.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"><Plus size={14} /></button>
                  </div>
                )}
              </div>

              {/* Chronic Diseases */}
              <div>
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Chronic Diseases</p>
                <div className="flex gap-2 flex-wrap">
                  {formData.chronicDiseases.map((d, i) => (
                    <span key={i} className="flex items-center gap-1 bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-xl">
                      {d}
                      {isEditing && <button onClick={() => removeTag("chronicDiseases", i)} className="ml-1 hover:text-red-500"><X size={10} /></button>}
                    </span>
                  ))}
                  {formData.chronicDiseases.length === 0 && !isEditing && (
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl">None Recorded</span>
                  )}
                </div>
                {isEditing && (
                  <div className="flex gap-2 mt-2">
                    <input value={newDisease} onChange={e => setNewDisease(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addTag("chronicDiseases", newDisease)}
                      placeholder="Add condition..."
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-500" />
                    <button onClick={() => addTag("chronicDiseases", newDisease)} className="p-1.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"><Plus size={14} /></button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}