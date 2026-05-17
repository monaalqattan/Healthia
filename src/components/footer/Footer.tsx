import React from "react"

const Footer: React.FC = () => {
  return (
    <div className="relative z-10 mt-auto w-full rounded-[40px] bg-[#E8E8E8] py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-row flex-wrap items-center justify-between gap-5 px-5">
        <div className="flex flex-col items-start gap-2 text-left">
          <h4 className="m-0 text-[17px] font-semibold tracking-wide text-[#1a1a1a]">
            Healthia Vitality
          </h4>
          <p className="m-0 text-[13px] leading-relaxed text-[#6b7a90]">
            © 2024 Healthia Vitality. Cultivating wellness through
            <br />
            organic care.
          </p>
        </div>

        <div className="flex flex-row items-center gap-6 max-md:flex-col max-md:gap-3">
          <a
            href="#"
            className="text-[13px] font-normal tracking-wide text-[#6b7a90] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:text-[#1B7A4B] hover:underline"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-[13px] font-normal tracking-wide text-[#6b7a90] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:text-[#1B7A4B] hover:underline"
          >
            Terms of Service
          </a>
        </div>

        <div className="flex flex-row items-center gap-6 max-md:flex-col max-md:gap-3">
          <a
            href="#"
            className="text-[13px] font-normal tracking-wide text-[#6b7a90] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:text-[#1B7A4B] hover:underline"
          >
            Accessibility
          </a>
          <a
            href="#"
            className="text-[13px] font-normal tracking-wide text-[#6b7a90] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:text-[#1B7A4B] hover:underline"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}

export default Footer
