import * as Icons from 'lucide-react'
import clsx from 'clsx'

/**
 * Custom Icon component that wraps lucide-react icons
 * @param {string} name - The icon name from lucide-react (e.g., 'ChevronDown', 'AlertCircle', 'Trash2')
 * @param {number} size - Icon size in pixels (default: 24)
 * @param {string} color - Icon color (default: 'currentColor')
 * @param {string} strokeWidth - Stroke width (default: 2)
 * @param {string} className - Additional CSS classes
 */
export default function Icon({
  name,
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className,
  ...props
}) {
  const IconComponent = Icons[name]

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`)
    return null
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={clsx(className)}
      {...props}
    />
  )
}
