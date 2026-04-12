import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons';
import { Alert, Modal, Space, Tag } from 'antd'
import { useCafes, useDeleteCafe } from '../hooks/use-cafes'
import { useEmployees } from '../hooks/use-employees'
import PageHeader from '../components/PageHeader'
import DataGridPanel from '../components/DataGridPanel'
import FilterSearchActions from '../components/FilterSearchActions'
import CafesGrid from '../features/cafes/CafesGrid'
import { LIST_REFETCH_INTERVAL_MS } from '../lib/query-client'
import { useSyncLabel } from '../hooks/use-sync-label'

function buildLocationOptions(cafes) {
  const allLocations = new Set((cafes ?? []).map((item) => item.location))
  return ['All Locations', ...Array.from(allLocations).sort()]
}

export default function CafesPage() {
  const navigate = useNavigate()
  const [locationFilter, setLocationFilter] = useState('All Locations')
  const [searchText, setSearchText] = useState('')

  const selectedLocation = locationFilter === 'All Locations' ? undefined : locationFilter

  const cafesQuery = useCafes(selectedLocation, {
    refetchInterval: LIST_REFETCH_INTERVAL_MS,
  })
  const employeesQuery = useEmployees(undefined, {
    refetchInterval: LIST_REFETCH_INTERVAL_MS,
  })
  const deleteCafeMutation = useDeleteCafe()

  const locationOptions = useMemo(
    () => buildLocationOptions(cafesQuery.data),
    [cafesQuery.data],
  )

  const lastSyncedAt = Math.max(cafesQuery.dataUpdatedAt ?? 0, employeesQuery.dataUpdatedAt ?? 0)
  const syncLabel = useSyncLabel(lastSyncedAt)
  const totalCafeCount = cafesQuery.data?.length ?? 0
  const hasSearchFilter = searchText.trim().length > 0
  const hasLocationFilter = Boolean(selectedLocation)

  const employeeCountMap = useMemo(() => {
    const counts = new Map()
    for (const employee of employeesQuery.data ?? []) {
      if (!employee.cafe) {
        continue
      }
      const existing = counts.get(employee.cafe) ?? 0
      counts.set(employee.cafe, existing + 1)
    }
    return counts
  }, [employeesQuery.data])

  const rowData = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase()

    return (cafesQuery.data ?? [])
      .map((cafe) => ({
        ...cafe,
        employees: employeeCountMap.get(cafe.name) ?? 0,
      }))
      .filter((cafe) => {
        if (!normalizedSearch) {
          return true
        }
        return (
          cafe.name.toLowerCase().includes(normalizedSearch) ||
          cafe.description.toLowerCase().includes(normalizedSearch) ||
          cafe.location.toLowerCase().includes(normalizedSearch)
        )
      })
      .sort((a, b) => b.employees - a.employees || a.name.localeCompare(b.name))
  }, [cafesQuery.data, employeeCountMap, searchText])

  const onDeleteCafe = (cafe) => {
    Modal.confirm({
      title: 'Delete cafe?',
      content: `This will permanently remove ${cafe.name} and all related employee assignments.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        await deleteCafeMutation.mutateAsync(cafe.id)
      },
    })
  }

  return (
    <section className="space-y-8">
      {cafesQuery.isError ? (
        <div>
          <Alert type="error" message="Sorry! We are currently unable to load cafe entries. Please try again later." showIcon />
        </div>
      ) : null}

      <PageHeader
        title="Cafe Network"
        description="Manage roastery locations and employee assignments."
        actions={
          <FilterSearchActions
            filterLabel="Filter by location"
            filterProps={{
              value: locationFilter,
              onChange: setLocationFilter,
              options: locationOptions.map((item) => ({ label: item, value: item })),
            }}
            searchPlaceholder="Search cafes"
            searchProps={{
              value: searchText,
              onChange: (event) => setSearchText(event.target.value),
              prefix: <SearchOutlined />,
            }}
            addButtonLabel="Add Cafe"
            onAddClick={() => navigate('/cafes/new')}
          />
        }
      />

      <DataGridPanel
        footerText={(hasLocationFilter || hasSearchFilter) ? (
          `Showing ${rowData.length}/${totalCafeCount} cafes`
        ) : (
          `Showing ${rowData.length} cafes`
        )}
        footerTag={(
          <Space size={8} wrap>
            {cafesQuery.isFetching || employeesQuery.isFetching ? (
              <Tag color="neutral">Fetching...</Tag>
            ) : cafesQuery.isError ? (
              <Tag color="error">Error</Tag>
            ) : (
              <Tag color="green">Synced {syncLabel}</Tag>
            )}
            {hasLocationFilter ? <Tag color="blue">Location filtered</Tag> : null}
            {hasSearchFilter ? <Tag color="gold">Search active</Tag> : null}
          </Space>
        )}
      >
        <CafesGrid
          rowData={rowData}
          navigate={navigate}
          onDelete={onDeleteCafe}
          loading={cafesQuery.isLoading || employeesQuery.isLoading}
        />
      </DataGridPanel>
    </section>
  )
}
