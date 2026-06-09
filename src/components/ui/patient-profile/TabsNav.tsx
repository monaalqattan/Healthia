import { LayoutGrid, Utensils, Dumbbell, StickyNote, ClipboardList } from "lucide-react"

const tabs = [
  { id: "overview", label: "Overview",  icon: LayoutGrid },
  { id: "diet",     label: "Diet Plan", icon: Utensils   },
  { id: "body",     label: "Body",      icon: Dumbbell   },
  { id: "checkup",  label: "Check-up",  icon: ClipboardList },
  { id: "notes",    label: "Notes",     icon: StickyNote },
]

interface TabsNavProps {
  activeTab:   string
  onTabChange: (id: string) => void
}

export default function TabsNav({ activeTab, onTabChange }: TabsNavProps) {
  return (
    <div className="bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {tabs.map((tab) => {
          const Icon     = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium
                whitespace-nowrap transition-all duration-200 cursor-pointer
                ${isActive
                  ? "bg-green-700 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}>
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}