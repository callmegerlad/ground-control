import { Space } from 'antd'
import FilterControl from './FilterControl'
import SearchControl from './SearchControl'
import ActionButton from './ActionButton'

export default function FilterSearchActions({
  filterLabel,
  filterProps,
  searchPlaceholder = 'Search',
  searchProps,
  addButtonLabel,
  onAddClick,
}) {
  return (
    <Space wrap align="end" className="w-full sm:w-auto">
      <div className="w-full sm:w-auto">
        <FilterControl label={filterLabel} {...filterProps} />
      </div>
      <div className="w-full sm:w-auto">
        <SearchControl placeholder={searchPlaceholder} {...searchProps} />
      </div>
      <div className="w-full sm:w-auto">
        <ActionButton label={addButtonLabel} onClick={onAddClick} className="w-full sm:w-auto bg-secondary! shadow-none! font-semibold!" />
      </div>
    </Space>
  )
}
