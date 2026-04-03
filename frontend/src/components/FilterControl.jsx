import { Select, Typography } from 'antd'

const { Text } = Typography

export default function FilterControl({ label, ...selectProps }) {
  if (!label) return null

  return (
    <div className="w-full sm:w-auto">
      <Text className="mb-2 block text-xs! uppercase tracking-wider text-on-surface-variant! font-semibold!">
        {label}
      </Text>
      <Select
        className="w-full sm:min-w-52 sm:max-w-52 bg-surface-container-lowest! text-on-surface!"
        {...selectProps}
      />
    </div>
  )
}
