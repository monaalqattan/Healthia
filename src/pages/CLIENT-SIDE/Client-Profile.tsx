import React, { useState } from "react";
import { 
  Share2, 
  Flag, 
  TrendingDown, 
  Target, 
  Activity, 
  FileText,
  Check,
  Pencil
} from "lucide-react";

export default function ClientProfile() {
  // 1. حالة التحكم في وضع التعديل للحقول (Edit Mode)
  const [isEditing, setIsEditing] = useState(false);

  // 2. حالة حفظ بيانات الحقول الشخصية (Form State)
  const [formData, setFormData] = useState({
    fullName: "Sarah Jenkins",
    email: "s.jenkins@example.com",
    phone: "+1 (555) 892-4412",
    age: "34 years",
    address: "1224 Oakwood Drive, Seattle, WA 98101"
  });

  // 3. حالة حفظ الصورة الشخصية (صورة افتراضية في الأول)
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
  );

  // دالة التعامل مع رفع الصورة من الجهاز وتحويلها لرابط مؤقت للعرض لايف
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localImageUrl = URL.createObjectURL(file);
      setProfileImage(localImageUrl);
      // هنا مستقبلاً بيتم إرسال الفايل للباك إند لحفظه في قاعدة البيانات
    }
  };

  // دالة لتحديث نصوص الحقول الشخصية أثناء الكتابة
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // دالة تبديل زر التعديل والحفظ
  const handleEditToggle = () => {
    if (isEditing) {
      console.log("Saved Data:", formData);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen w-full font-sans overflow-x-hidden">
      
      {/* 1. كارت الملف الشخصي العلوي بالكامل (Top Profile Card) */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div className="flex items-center gap-5">
          
          {/* دائرة الصورة الشخصية الذكية قابلة للضغط لتغيير الصورة */}
          <div className="relative group w-20 h-20 rounded-full border-4 border-emerald-50/50 p-0.5 overflow-hidden bg-white shrink-0 shadow-sm">
            <img 
              src={profileImage} 
              alt="Patient Profile" 
              className="w-full h-full rounded-full object-cover"
            />
            
            {/* طبقة تظهر باللون الأسود الخفيف والشفاف عند الوقوف بالماوس فوق الصورة للتوجيه */}
            <label 
              htmlFor="avatar-upload" 
              className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-center px-1"
            >
              Change Photo
            </label>
            
            {/* الـ input المخفي لفتح ملفات الجهاز */}
            <input 
              type="file" 
              id="avatar-upload" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="hidden" 
            />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-950 tracking-tight">{formData.fullName}</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="bg-emerald-800 text-white text-[10px] font-extrabold px-3 py-1 rounded-full  tracking-wider">
                Goal: Lose 5 kg
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Active Patient
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full px-6 py-3 text-sm font-bold transition-all cursor-pointer">
            Export Record
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-700 text-white rounded-full px-6 py-3 text-sm font-bold hover:bg-emerald-900 transition-all cursor-pointer shadow-sm shadow-green-900/10">
            <Share2 size={16} />
            Share Report
          </button>
        </div>
      </div>

      {/* 2. شبكة كروت البيانات (Main Content Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* العمود الأيسر (البيانات الشخصية والتقدم للأهداف) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* كارت البيانات الشخصية القابل للتعديل بحواف متناسقة مع السايد بار */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Personal Information</h2>
              
              <button 
                onClick={handleEditToggle}
                className={`text-sm font-bold flex items-center gap-1.5 cursor-pointer px-4 py-1.5 rounded-full transition-all ${
                  isEditing 
                    ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100" 
                    : "text-emerald-800 hover:underline"
                }`}
              >
                {isEditing ? (
                  <>
                    <Check size={14} />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Pencil size={12} />
                    Edit Fields
                  </>
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400  tracking-wider mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-emerald-700 focus:border-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-800/10 rounded-xl p-3 text-sm font-semibold text-gray-800 shadow-sm transition-all"
                  />
                ) : (
                  <div className="bg-[#F4F4F5] rounded-xl p-3.5 text-sm font-semibold text-gray-800">{formData.fullName}</div>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400  tracking-wider mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-emerald-700 focus:border-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-800/10 rounded-xl p-3 text-sm font-semibold text-gray-800 shadow-sm transition-all"
                  />
                ) : (
                  <div className="bg-[#F4F4F5] rounded-xl p-3.5 text-sm font-semibold text-gray-800">{formData.email}</div>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400  tracking-wider mb-2">Phone Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-emerald-700 focus:border-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-800/10 rounded-xl p-3 text-sm font-semibold text-gray-800 shadow-sm transition-all"
                  />
                ) : (
                  <div className="bg-[#F4F4F5] rounded-xl p-3.5 text-sm font-semibold text-gray-800">{formData.phone}</div>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 tracking-wider mb-2">Age</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-emerald-700 focus:border-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-800/10 rounded-xl p-3 text-sm font-semibold text-gray-800 shadow-sm transition-all"
                  />
                ) : (
                  <div className="bg-[#F4F4F5] rounded-xl p-3.5 text-sm font-semibold text-gray-800">{formData.age}</div>
                )}
              </div>

              {/* Residential Address */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-extrabold text-gray-400  tracking-wider mb-2">Residential Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-emerald-700 focus:border-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-800/10 rounded-xl p-3 text-sm font-semibold text-gray-800 shadow-sm transition-all"
                  />
                ) : (
                  <div className="bg-[#F4F4F5] rounded-xl p-3.5 text-sm font-semibold text-gray-800">{formData.address}</div>
                )}
              </div>
            </div>

            
          </div>

          {/* كارت شريط تقدم الأهداف (Goal Progress) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Goal Progress</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Journey towards losing 5 kg</p>
              </div>
              <span className="text-4xl font-black text-[#016333] tracking-tight">70%</span>
            </div>
            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-8 p-0.5 border border-gray-50">
              <div className="bg-[#016333] h-full rounded-full transition-all duration-500" style={{ width: "70%" }}></div>
            </div>
            <div className="grid grid-cols-3 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-[#016333] shrink-0">
                  <Flag size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-extrabold  tracking-wider">Start</p>
                  <p className="text-base font-bold text-gray-900">73.5 kg</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border-x border-gray-200/60 px-2 md:px-4">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-[#016333] shrink-0">
                  <TrendingDown size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-extrabold  tracking-wider">Current</p>
                  <p className="text-base font-bold text-gray-950">68.5 kg</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-1">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-[#016333] shrink-0">
                  <Target size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-extrabold  tracking-wider">Target</p>
                  <p className="text-base font-bold text-gray-900">65.0 kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* العمود الأيمن (المؤشرات الصحية والنظرة السريرية) */}
        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5 tracking-tight">
              <div className="p-1.5 bg-green-50 rounded-lg text-[#016333]">
                <Activity size={16} />
              </div>
              Health Metrics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50/70 border border-gray-100/50 rounded-2xl p-4">
                <p className="text-[10px] text-gray-400 font-extrabold  tracking-wider mb-1">Weight</p>
                <p className="text-lg font-black text-[#016333]">68.5 kg</p>
              </div>
              <div className="bg-gray-50/70 border border-gray-100/50 rounded-2xl p-4">
                <p className="text-[10px] text-gray-400 font-extrabold  tracking-wider mb-1">Height</p>
                <p className="text-lg font-black text-gray-900">168 cm</p>
              </div>
              <div className="bg-gray-50/70 border border-gray-100/50 rounded-2xl p-4">
                <p className="text-[10px] text-gray-400 font-extrabold  tracking-wider mb-1">Goal Type</p>
                <p className="text-sm font-bold text-gray-900 mt-1">Weight Loss</p>
              </div>
              <div className="bg-gray-50/70 border border-gray-100/50 rounded-2xl p-4">
                <p className="text-[10px] text-gray-400 font-extrabold  tracking-wider mb-1">Activity</p>
                <p className="text-sm font-bold text-gray-900 mt-1">Moderate</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5 tracking-tight">
              <div className="p-1.5 bg-green-50 rounded-lg text-[#016333]">
                <FileText size={16} />
              </div>
              Clinical Overview
            </h2>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-extrabold text-gray-400  tracking-wider mb-2">Chronic Diseases</p>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-100/50 inline-block">
                  None Recorded
                </span>
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-gray-400  tracking-wider mb-2">Allergies</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-red-50 text-red-600 text-[10px] font-extrabold px-3 py-1.5 rounded-xl border border-red-100/50 tracking-wide ">
                    Peanuts
                  </span>
                  <span className="bg-red-50 text-red-600 text-[10px] font-extrabold px-3 py-1.5 rounded-xl border border-red-100/50 tracking-wide ">
                    Penicillin
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-gray-400  tracking-wider mb-2">Clinical Notes</p>
                <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-100/50 inline-block">
                  "Patient is highly motivated. Progressing well on the Mediterranean diet plan. Regular sleep cycles reported."
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}