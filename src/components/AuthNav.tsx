import { Link } from 'react-router-dom';
import logoImg from "../assets/logoRemovebg.png";

const AuthNav = () => {
  return (
    // استخدمنا w-full مع max-w عشان يفضل متناسق مع محتوى الصفحة
    <nav className="w-full max-w-[1200px] mx-auto px-10 py-8 flex justify-between items-center bg-transparent">
      <Link to="/" className="flex items-center">
        {/* كبرنا اللوجو شوية (h-20) عشان يبقى واضح */}
        <img src={logoImg} alt="Logo" className="h-20 w-auto object-contain" />
      </Link>
      
      <div className="flex items-center gap-10">
        <Link 
          to="/login" 
          className="text-[15px] font-bold text-gray-700 hover:text-[#1B7A4B] transition-colors font-manrope"
        >
          Login
        </Link>
        <Link 
          to="/support" 
          className="text-[15px] font-bold text-gray-700 hover:text-[#1B7A4B] transition-colors font-manrope"
        >
          Support
        </Link>
        <button className="w-10 h-10 rounded-full border-2 border-[#1B7A4B] flex items-center justify-center text-[#1B7A4B] font-bold hover:bg-[#1B7A4B] hover:text-white transition-all font-manrope">
          ?
        </button>
      </div>
    </nav>
  );
};

export default AuthNav;