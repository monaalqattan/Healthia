import { useState, type FormEvent, type ChangeEvent } from "react"
import { Link } from "react-router-dom"
import Footer from "../../components/footer/Footer.tsx"
import leafImg from "../../assets/1.png"
import AuthNav from "../../components/AuthNav.tsx"

// --- أيقونات SVG نظيفة ---

const EyeOpenIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="opacity-70"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeClosedIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="opacity-70"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.06M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

// ---------------------------

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [rememberMe, setRememberMe] = useState<boolean>(false)

  // State للأخطاء
  const [error, setError] = useState<{ email?: string; password?: string }>({})

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors)
      return
    }

    setError({})
    console.log("Login Success:", email, password, rememberMe)
  }

  return (
    <div className="font-manrope flex min-h-screen w-full flex-col items-center overflow-x-hidden bg-[#EEF0EC]">
      {/* 1. الناف بار بقا فوق لوحده عشان ميتضغطش */}
      <AuthNav />

      {/* 2. الـ Main شايل المحتوى وفي نص الشاشة */}
      <main className="relative z-10 flex w-full flex-1 items-center justify-center px-5 py-12">
        {/* Decorative Leaves - خلف الكارت */}
        <div className="pointer-events-none absolute top-[10%] left-[5%] z-0 w-[250px] -rotate-[15deg] opacity-[0.08] blur-[1px] lg:w-[350px]">
          <img
            src={leafImg}
            alt="decorative leaf"
            className="h-full w-full object-contain"
          />
        </div>

        {/* Login Card */}
        <div className="relative z-10 flex w-full max-w-[400px] flex-col rounded-[32px] bg-white px-10 py-12 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
          <div className="mb-8">
            <h1 className="mb-2 text-[28px] leading-tight font-bold text-[#1a1a1a]">
              Welcome back
            </h1>
            <p className="text-[13px] leading-relaxed font-medium text-[#888]">
              Step into your personal sanctuary of wellness.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="px-1 text-[10px] font-bold tracking-[1.2px] text-[#aaa] uppercase">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                className={`w-full rounded-xl border bg-[#F4F5F4] px-4 py-3.5 text-[14px] text-[#333] transition-all outline-none placeholder:text-[#bbb] ${
                  error.email
                    ? "border-red-500 bg-red-50/10"
                    : "border-[#EBEBEB] focus:border-[#1B7A4B] focus:bg-white"
                }`}
                placeholder="hello@healthia.com"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value)
                  setError({ ...error, email: "" })
                }}
              />
              {error.email && (
                <p className="px-1 text-[11px] font-medium text-red-500 italic">
                  {error.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="px-1 text-[10px] font-bold tracking-[1.2px] text-[#aaa] uppercase">
                  PASSWORD
                </label>
                <Link
                  to="/reset-password"
                  className="text-[11px] font-bold text-[#1B7A4B] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full rounded-xl border bg-[#F4F5F4] px-4 py-3.5 pr-12 text-[14px] text-[#333] transition-all outline-none ${
                    error.password
                      ? "border-red-500 bg-red-50/10"
                      : "border-[#EBEBEB] focus:border-[#1B7A4B] focus:bg-white"
                  }`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value)
                    setError({ ...error, password: "" })
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 p-1.5 text-[#aaa] transition-colors hover:text-[#555]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {/* استدعاء الأيقونات بناءً على الحالة */}
                  {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              </div>
              {error.password && (
                <p className="px-1 text-[11px] font-medium text-red-500 italic">
                  {error.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="mt-1 flex items-center gap-2.5">
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <div className="peer h-5 w-9 rounded-full bg-gray-300 transition-colors peer-checked:bg-[#1B7A4B] after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4"></div>
              </label>
              <span className="text-[13px] font-medium text-[#666]">
                Remember me
              </span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B7A4B] py-4 text-[15px] font-bold text-white shadow-lg transition-all hover:bg-[#15613c] active:scale-[0.98]"
            >
              Login
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Login
