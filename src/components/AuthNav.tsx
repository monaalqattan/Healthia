import { Link } from 'react-router-dom';
import logoImg from "../assets/logoRemovebg.png";

const AuthNav = () => {
  return (
    // استخدمنا w-full مع max-w عشان يفضل متناسق مع محتوى الصفحة
    <nav className=" max-w-300 mx-auto flex w-full items-center justify-between bg-transparent px-10 py-8">
      <Link to="/" className="flex items-center">
        {/* Logo size increased further per user request */}
        <img src={logoImg} alt="Logo" className="h-32 w-auto object-contain" />
      </Link>

      <div className="flex items-center gap-10">
        <Link
          to="/login"
          className="font-manrope text-[15px] font-bold text-gray-700 transition-colors hover:text-[#1B7A4B]"
        >
          Login
        </Link>
        <Link
          to="/support"
          className="font-manrope text-[15px] font-bold text-gray-700 transition-colors hover:text-[#1B7A4B]"
        >
          Support
        </Link>
        <button className="font-manrope flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1B7A4B] font-bold text-[#1B7A4B] transition-all hover:bg-[#1B7A4B] hover:text-white">
          ?
        </button>
      </div>
    </nav>
  )
};

export default AuthNav;