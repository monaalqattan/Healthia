import { useState, useEffect } from "react"
import type { Stats } from "./types"

import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import HowItWorks from "./components/HowItWorks"
import Features from "./components/Features"
import ForDoctors from "./components/ForDoctors"
import Testimonials from "./components/Testimonials"
import Pricing from "./components/Pricing"
import AboutUs from "./components/AboutUs"
import Blog from "./components/Blog"
import Contact from "./components/Contact"
import CTA from "./components/CTA"
import Footer from "./components/Footer"

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    totalPatients: 0,
    totalDoctors: 0,
    totalPlans: 0,
    totalAppointments: 0,
    satisfactionRate: 98,
  })

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/analytics/public-stats`
    )
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased">
      <Navbar />
      <main>
        <Hero stats={stats} />
        <HowItWorks />
        <Features />
        <ForDoctors stats={stats} />
        <Testimonials />
        <Pricing />
        <AboutUs />
        <Blog />
        <Contact />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
