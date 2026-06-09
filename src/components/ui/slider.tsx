import * as React from "react"

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number[]
  onValueChange?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ value = [0], onValueChange, min = 0, max = 100, step = 1, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={(e) => onValueChange?.([Number(e.target.value)])}
        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 ${className || ''}`}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"
