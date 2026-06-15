import { useState } from "react"
import { useNavigate } from "react-router"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const links = [
    "Features",
    "For Patients",
    "For Doctors",
    "Pricing",
    "About Us",
    "Blog",
    "Contact",
  ]

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <span className="text-xl font-bold tracking-tight text-[#1a6b3a]">
          Healthia
        </span>

        <ul className="hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex">
          {links.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="transition-colors hover:text-[#1a6b3a]"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="hidden text-sm font-medium text-gray-700 hover:text-[#1a6b3a] md:block"
          >
            Login
          </button>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-6 py-4 md:hidden">
          {links.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="block py-2 text-sm font-medium text-gray-600 hover:text-[#1a6b3a]"
              onClick={() => setOpen(false)}
            >
              {item}
            </a>
          ))}
          <button
            onClick={() => navigate("/login")}
            className="mt-3 w-full rounded-full bg-[#1a6b3a] py-2 text-sm font-semibold text-white"
          >
            Login / Sign Up
          </button>
        </div>
      )}
    </nav>
  )
}
