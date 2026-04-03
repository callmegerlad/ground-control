import { Input, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const { Text } = Typography

export default function SearchControl({ placeholder = 'Search', ...inputProps }) {
  return (
    <div className="w-full sm:w-auto">
      <Text className="mb-2 block text-xs! uppercase tracking-wider text-on-surface-variant! font-semibold!">
        Search
      </Text>
      <Input
        allowClear
        placeholder={placeholder}
        prefix={<SearchOutlined />}
        className="w-full sm:min-w-52 bg-surface-container-lowest! text-on-surface!"
        {...inputProps}
      />
    </div>
  )
}
