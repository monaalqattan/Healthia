import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/footer/Footer';
import newpassImg from "../../assets/newpass-img.png";
// import logoImg from "../../assets/logoRemovebg.png";
import AuthNav from "../../components/AuthNav.tsx"

const EyeOpen = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosed = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12A18.45 18.45 0 0 1 5.06 5.06"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4C19 4 23 12 23 12A18.5 18.5 0 0 1 20.54 15.9"/>
    <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const NewPassword = () => {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleUpdatePassword = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate('/login');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#EEF0EC] flex flex-col font-sans">
      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-white text-[#1B7A4B] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-semibold z-[1000] border-l-4 border-[#1B7A4B] animate-bounce">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Password updated successfully!
        </div>
      )}

      {/* Navbar */}
      <AuthNav />

      {/* Main Content */}
      <main className="flex-1 max-w-[1050px] w-full mx-auto px-6 py-10 flex flex-col md:flex-row gap-7 items-start">
        
        {/* Left Card */}
        <div className="bg-white rounded-[24px] p-10 flex-1 shadow-sm w-full">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">Secure Your Sanctuary</h1>
          <p className="text-sm text-gray-500 mb-8">
            Choose a strong, new password to ensure your <span className="text-[#1B7A4B] font-medium">health journey</span> remains private and secure.
          </p>

          <div className="space-y-5">
            {/* New Pass */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-semibold text-gray-600 tracking-wide uppercase">New Password</label>
              <div className="relative flex items-center">
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className="w-full p-3.5 pr-12 bg-[#F4F5F4] border border-[#EBEBEB] rounded-xl text-sm outline-none focus:border-[#1B7A4B] focus:bg-white transition-all"
                />
                <button onClick={() => setShowNew(!showNew)} className="absolute right-3 text-gray-400 hover:text-gray-600">
                  {showNew ? <EyeOpen /> : <EyeClosed />}
                </button>
              </div>
            </div>

            {/* Confirm Pass */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-semibold text-gray-600 tracking-wide uppercase">Confirm New Password</label>
              <div className="relative flex items-center">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className="w-full p-3.5 pr-12 bg-[#F4F5F4] border border-[#EBEBEB] rounded-xl text-sm outline-none focus:border-[#1B7A4B] focus:bg-white transition-all"
                />
                <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOpen /> : <EyeClosed />}
                </button>
              </div>
            </div>

            <button onClick={handleUpdatePassword} className="w-full p-4 bg-[#1B7A4B] text-white rounded-xl font-semibold hover:bg-[#155e39] transform active:scale-95 transition-all">
              Update Password
            </button>
            <Link to="/login" className="block text-center text-sm text-[#1B7A4B] font-medium hover:opacity-70">Back to Login</Link>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-[260px] flex flex-col gap-4">
          <div className="bg-[#1B7A4B] text-white p-6 rounded-[20px] shadow-sm">
            <h3 className="font-bold mb-4">Security Standards</h3>
            <ul className="text-xs space-y-3 opacity-90">
              <li className="flex items-center gap-2"> At least 12 characters</li>
              <li className="flex items-center gap-2"> Upper & numbers</li>
              <li className="flex items-center gap-2 opacity-50">Special characters</li>
              <li className="flex items-center gap-2 opacity-50"> Unique from last 3</li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-[20px] shadow-sm flex gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0"></div>
            <div>
              <h4 className="text-sm font-bold">Pro Tip</h4>
              <p className="text-[11px] text-gray-500">Use a "passphrase" like 3-4 random words.</p>
            </div>
          </div>

          <img src={newpassImg} alt="Meditation" className="w-full h-40 object-cover rounded-[20px]" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewPassword;