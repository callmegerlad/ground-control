import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'

export default function ActionButton({
  label,
  onClick,
  icon = <PlusOutlined />,
  type = 'primary',
  size = 'large',
  className = 'bg-secondary! shadow-none! font-semibold!',
  ...buttonProps
}) {
  return (
    <div>
      <Button
        type={type}
        size={size}
        icon={icon}
        onClick={onClick}
        className={className}
        {...buttonProps}
      >
        {label}
      </Button>
    </div>
  )
}
