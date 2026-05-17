// src/components/ui/book-appointment/DoctorCard.tsx
import { MapPin, Stethoscope } from "lucide-react"

interface DoctorCardProps {
  name: string
  title: string
  clinic: string
  clinicAddress: string
  specialty: string
  image: string
  // ✅ شلنا award من الـ interface خالص
}

export default function DoctorCard({
  name, title, clinic, clinicAddress, specialty, image
  // ✅ شلناها من الـ destructuring
}: DoctorCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm w-full">

      <div className="relative mb-3">
        <img
          src={image}
          alt={name}
          className="w-full h-36 object-cover rounded-xl"
        />
        <span className="absolute bottom-2 left-2 bg-green-700 text-white text-[10px] font-bold px-2 py-1 rounded-full">
          ✦ Clinical Excellence Award 2022
        </span>
      </div>

      <p className="font-bold text-gray-800 text-sm">{name}</p>
      <p className="text-xs text-gray-400 mb-3">{title}</p>

      <div className="flex items-start gap-2 mb-2">
        <MapPin className="w-3.5 h-3.5 text-green-700 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-gray-700">{clinic}</p>
          <p className="text-[10px] text-gray-400">{clinicAddress}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Stethoscope className="w-3.5 h-3.5 text-green-700 shrink-0" />
        <p className="text-xs text-gray-600">{specialty}</p>
      </div>
    </div>
  )
}