import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Footer from "../../components/footer/Footer"
import resetImg from "../../assets/reset-img.png"
import AuthNav from "../../components/AuthNav.tsx"

const ResetPassword: React.FC = () => {
  const navigate = useNavigate()

  // States
  const [step, setStep] = useState<"email" | "code">("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")

  // Email Validation
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSendLink = () => {
    if (!email) {
      setError("Email address is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setError("")
    setStep("code")
  }

  const handleVerifyCode = () => {
    if (code === "123456") {
      navigate("/new-password")
    } else {
      setError("Invalid verification code. Try 123456")
    }
  }

  return (
    <div className="font-manrope relative flex min-h-screen w-full flex-col bg-[#EEF0EC]">
      <AuthNav />

      <main className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col items-center justify-between gap-10 px-5 pt-[100px] pb-[60px] lg:flex-row">
        
        {/* Left Side */}
        <div className="w-full max-w-[480px] flex-1">
          <h1 className="mb-6 text-[54px] leading-[1.1] font-[800] tracking-[-1px] text-[#1a1a1a]">
            Reclaim Your <br />
            <span className="text-[#1B7A4B]">Vitality.</span>
          </h1>

          <p className="mb-10 max-w-[400px] text-base leading-relaxed text-[#555]">
            Don't worry, we all lose our way sometimes. Enter your email
            address below and we'll send you a link to reset your journey.
          </p>

          <div className="flex flex-col gap-3 rounded-[20px] border-[1.5px] border-[#1B7A4B] bg-[#F1F4F2] p-6 shadow-sm">
            <div className="flex items-center gap-2.5 text-base font-bold text-[#1a1a1a]">
              <svg
                className="h-5 w-5 stroke-[#1B7A4B]"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>

              Need a hand?
            </div>

            <p className="text-[13.5px] leading-relaxed text-[#666]">
              Our support guides are standing by 24/7 to help you find your
              path back to wellness.
            </p>

            <a
              href="#"
              className="mt-1 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-[#1B7A4B] transition-opacity hover:opacity-80"
            >
              Contact Support

              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex w-full flex-1 justify-center lg:justify-end">
          <div className="flex w-full max-w-[460px] flex-col overflow-hidden rounded-[32px] bg-white pt-10 shadow-[0_12px_48px_rgba(0,0,0,0.05)]">

            <div className="flex flex-col gap-6 px-10 pb-8">

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label className="px-1 text-[11px] font-bold tracking-wider text-[#333]">
                  Email Address
                </label>

                <div className="relative flex items-center">
                  <svg
                    className="absolute left-4 text-[#aaa]"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>

                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError("")
                    }}
                    disabled={step === "code"}
                    placeholder="vitality@healthia.com"
                    dir="ltr"
                    className={`w-full rounded-2xl border bg-[#F4F5F4] py-4 pr-4 pl-11 text-left text-sm transition-all outline-none ${
                      error && step === "email"
                        ? "border-red-500"
                        : "border-[#EBEBEB] focus:border-[#1B7A4B] focus:bg-white"
                    } ${step === "code" ? "opacity-60" : ""}`}
                  />
                </div>

                {error && step === "email" && (
                  <p className="px-1 text-[10px] font-bold text-red-500">
                    {error}
                  </p>
                )}
              </div>

              {/* Code Field */}
              {step === "code" && (
                <div className="flex animate-in flex-col gap-2 duration-300 fade-in slide-in-from-top-2">
                  <label className="px-1 text-[11px] font-bold tracking-wider text-[#333]">
                    Verification Code
                  </label>

                  <div className="relative flex flex-col items-end">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value)
                        setError("")
                      }}
                      placeholder="0 0 0 0 0 0"
                      maxLength={6}
                      className={`w-full rounded-2xl border bg-[#F4F5F4] px-5 py-4 text-center text-lg font-bold tracking-[0.5em] outline-none ${
                        error
                          ? "border-red-500"
                          : "border-[#EBEBEB] focus:border-[#1B7A4B]"
                      }`}
                    />

                    <button
                      type="button"
                      className="mt-2 text-[11px] font-bold text-[#1B7A4B] hover:underline"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>
              )}

              {/* Main Button */}
              <button
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#156c40] py-4 text-[15px] font-bold text-white shadow-md transition-all hover:bg-[#115732] active:scale-[0.98]"
                onClick={
                  step === "email"
                    ? handleSendLink
                    : handleVerifyCode
                }
              >
                {step === "email"
                  ? "Send Reset Link"
                  : "Verify & Reset Password"}

                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>

                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>

              {/* Back Link */}
              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 text-center text-[13.5px] font-bold text-[#666] hover:text-[#1B7A4B]"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>

                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>

                Back to login
              </Link>
            </div>

            <img
              src={resetImg}
              alt="Reset decoration"
              className="mt-auto h-[200px] w-full rounded-t-[32px] object-cover"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ResetPassword