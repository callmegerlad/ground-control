import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons';
import { Alert, Modal, Space, Tag } from 'antd'
import { useDeleteEmployee, useEmployees } from '../hooks/use-employees'
import { useCafes } from '../hooks/use-cafes'
import PageHeader from '../components/PageHeader'
import DataGridPanel from '../components/DataGridPanel'
import FilterSearchActions from '../components/FilterSearchActions'
import EmployeesGrid from '../features/employees/EmployeesGrid'
import { LIST_REFETCH_INTERVAL_MS } from '../lib/query-client'
import { useSyncLabel } from '../hooks/use-sync-label'

export default function EmployeesPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchText, setSearchText] = useState('')

  const cafeIdFromUrl = searchParams.get('cafeId')
  const selectedCafeId = cafeIdFromUrl || undefined

  const employeesQuery = useEmployees(selectedCafeId, {
    refetchInterval: LIST_REFETCH_INTERVAL_MS,
  })
  const cafesQuery = useCafes(undefined, {
    refetchInterval: LIST_REFETCH_INTERVAL_MS,
  })
  const deleteEmployeeMutation = useDeleteEmployee()

  const cafeOptions = useMemo(() => {
    const base = [{ label: 'All Cafes', value: 'all' }]
    const items = (cafesQuery.data ?? []).map((cafe) => ({
      label: cafe.name,
      value: cafe.id,
    }))
    return [...base, ...items]
  }, [cafesQuery.data])

  const lastSyncedAt = Math.max(employeesQuery.dataUpdatedAt ?? 0, cafesQuery.dataUpdatedAt ?? 0)
  const syncLabel = useSyncLabel(lastSyncedAt)
  const totalEmployeeCount = employeesQuery.data?.length ?? 0
  const hasSearchFilter = searchText.trim().length > 0
  const hasCafeFilter = Boolean(selectedCafeId)

  const rowData = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase()

    return (employeesQuery.data ?? [])
      .filter((employee) => {
        if (!normalizedSearch) {
          return true
        }

        return (
          employee.id.toLowerCase().includes(normalizedSearch) ||
          employee.name.toLowerCase().includes(normalizedSearch) ||
          employee.email_address.toLowerCase().includes(normalizedSearch) ||
          employee.phone_number.toLowerCase().includes(normalizedSearch) ||
          (employee.cafe ?? '').toLowerCase().includes(normalizedSearch)
        )
      })
      .sort((a, b) => b.days_worked - a.days_worked || a.name.localeCompare(b.name))
  }, [employeesQuery.data, searchText])

  const onDeleteEmployee = (employee) => {
    Modal.confirm({
      title: 'Delete employee?',
      content: `This will remove ${employee.name} (${employee.id}).`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        await deleteEmployeeMutation.mutateAsync(employee.id)
      },
    })
  }

  const onCafeFilterChange = (value) => {
    if (value === 'all') {
      searchParams.delete('cafeId')
      searchParams.delete('cafeName')
      setSearchParams(searchParams)
      return
    }

    const selectedCafe = cafesQuery.data?.find((cafe) => cafe.id === value)
    setSearchParams({
      cafeId: value,
      cafeName: selectedCafe?.name ?? '',
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
        title="Employees"
        description="View and manage employee assignments across all cafes."
        actions={
          <FilterSearchActions
            filterLabel="Filter by cafe"
            filterProps={{
              value: selectedCafeId ?? 'all',
              onChange: onCafeFilterChange,
              options: cafeOptions,
              loading: cafesQuery.isLoading,
            }}
            searchPlaceholder="Search employees"
            searchProps={{
              value: searchText,
              onChange: (event) => setSearchText(event.target.value),
              prefix: <SearchOutlined />,
            }}
            addButtonLabel="Add Employee"
            onAddClick={() => navigate('/employees/new')}
          />
        }
      />

      <DataGridPanel
        footerText={(hasCafeFilter || hasSearchFilter) ? (
          `Showing ${rowData.length}/${totalEmployeeCount} employees`
        ) : (
          `Showing ${rowData.length} employees`
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
            {hasCafeFilter ? <Tag color="blue">Cafe filter active</Tag> : null}
            {hasSearchFilter ? <Tag color="gold">Search active</Tag> : null}
          </Space>
        )}
      >
        <EmployeesGrid
          rowData={rowData}
          navigate={navigate}
          onDelete={onDeleteEmployee}
          loading={employeesQuery.isLoading}
        />
      </DataGridPanel>
    </section>
  )
}
