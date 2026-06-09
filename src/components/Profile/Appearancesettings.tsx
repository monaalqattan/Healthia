import React, { useState, useEffect } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

type Theme = 'light' | 'dark' | 'system'

export default function AppearanceSettings() {
  const [theme, setTheme] = useState<Theme>('light')

  // تحميل الـ theme المحفوز
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved) {
      setTheme(saved)
      applyTheme(saved)
    }
  }, [])

  const applyTheme = (t: Theme) => {
    const root = document.documentElement
    if (t === 'dark') {
      root.classList.add('dark')
    } else if (t === 'light') {
      root.classList.remove('dark')
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      prefersDark ? root.classList.add('dark') : root.classList.remove('dark')
    }
  }

  const handleTheme = (t: Theme) => {
    setTheme(t)
    localStorage.setItem('theme', t)
    applyTheme(t)
  }

  const options = [
    { key: 'light'  as Theme, label: 'Light',  icon: <Sun  size={16}/>, desc: 'Default light interface'         },
    { key: 'dark'   as Theme, label: 'Dark',   icon: <Moon size={16}/>, desc: 'Easier on the eyes at night'     },
    { key: 'system' as Theme, label: 'System', icon: <Monitor size={16}/>, desc: 'Follow device preference'     },
  ]

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sun className="w-4 h-4 text-[#065F46]"/>
        <h2 className="text-sm font-bold text-gray-800">Appearance</h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {options.map(opt => (
          <button key={opt.key} onClick={() => handleTheme(opt.key)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              theme === opt.key
                ? 'border-[#065F46] bg-[#f0fdf4]'
                : 'border-gray-100 hover:border-gray-200 bg-gray-50'
            }`}>
            <div className={`${theme === opt.key ? 'text-[#065F46]' : 'text-gray-400'}`}>
              {opt.icon}
            </div>
            <span className={`text-xs font-bold ${theme === opt.key ? 'text-[#065F46]' : 'text-gray-600'}`}>
              {opt.label}
            </span>
            <span className="text-[10px] text-gray-400 text-center leading-tight">{opt.desc}</span>
            {theme === opt.key && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#065F46]"/>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}