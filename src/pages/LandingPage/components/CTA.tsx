import { useNavigate } from "react-router"

export default function CTA() {
  const navigate = useNavigate()
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#e8f5ee] via-white to-[#d4eddf] px-10 py-16 shadow-inner">
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[#1a6b3a]/10 blur-3xl" />
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-[#1a6b3a]/10 blur-3xl" />
          <h2 className="mb-4 text-4xl leading-tight font-extrabold text-gray-900 md:text-5xl">
            Start your healthy journey today.
          </h2>
          <p className="mx-auto mb-8 max-w-sm text-sm text-gray-500">
            Join thousands of patients and practitioners already using Healthia
            to transform outcomes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="rounded-full bg-[#1a6b3a] px-8 py-3.5 font-semibold text-white shadow-md hover:bg-[#155730]"
            >
              Get Started — It's Free
            </button>
            <a
              href="#contact"
              className="rounded-full border border-[#1a6b3a] px-8 py-3.5 font-semibold text-[#1a6b3a] hover:bg-[#e8f5ee]"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
