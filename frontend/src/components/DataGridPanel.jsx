import { Tag, Typography } from 'antd'

const { Text } = Typography

export default function DataGridPanel({ children, footerText, footerTag }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface-container-lowest shadow-ambient">
      {children}
      <div className="border-t border-surface-container-low! mt-4 flex flex-wrap items-center justify-between gap-2 p-4">
        <Text className="text-on-surface!">{footerText}</Text>
        {typeof footerTag === 'string' ? <Tag>{footerTag}</Tag> : footerTag}
      </div>
    </div>
  )
}
