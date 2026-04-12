import { Button, Space, Tag } from 'antd'
import Icon from '../../components/Icon'
import dayjs from '../../lib/dayjs'

function formatDaysWorked(daysWorked) {
  const days = Number(daysWorked)

  if (!Number.isFinite(days) || days <= 0) {
    return '0 days'
  }

  if (days < 30) {
    const roundedDays = Math.floor(days)
    return `${roundedDays} ${roundedDays === 1 ? 'day' : 'days'}`
  }

  return dayjs().subtract(Math.floor(days), 'day').fromNow(true)
}

/**
 * Create employee table column definitions
 * @param {Object} options
 * @param {Function} options.navigate - React Router navigate function
 * @param {Function} options.onDelete - Delete handler callback
 * @returns {Array} Column definitions for AG Grid
 */
export function createEmployeeColumnDefs({ navigate, onDelete }) {
  return [
    {
      headerName: 'Employee ID',
      field: 'id',
      width: 150,
      cellClass: 'font-semibold text-on-surface',
    },
    {
      headerName: 'Name',
      field: 'name',
      minWidth: 150,
    },
    {
      headerName: 'Email',
      field: 'email_address',
      minWidth: 220,
      flex: 1,
      cellRenderer: (params) => (
        <a href={`mailto:${params.value}`} className="text-primary! underline!">
          {params.value}
        </a>
      ),
    },
    {
      headerName: 'Phone',
      field: 'phone_number',
      width: 120,
    },
    {
      headerName: 'Time Worked',
      field: 'days_worked',
      width: 180,
      sort: 'desc',
      cellRenderer: (params) => (
        <Tag className="bg-secondary-container! text-on-secondary-container!">
          {formatDaysWorked(params.value)}
        </Tag>
      ),
    },
    {
      headerName: 'Cafe',
      field: 'cafe',
      minWidth: 180,
      valueFormatter: (params) => params.value || '-',
    },
    {
      headerName: 'Actions',
      width: 160,
      sortable: false,
      filter: false,
      cellRenderer: (params) => (
        <Space>
          <Button
            size="medium"
            className="shadow-none! bg-transparent! hover:opacity-75"
            onClick={() => navigate(`/employees/edit/${params.data.id}`)}
          >
            <Icon name="Edit" size="18" className="inline-block stroke-primary" />
          </Button>
          <Button
            size="medium"
            className="shadow-none! bg-transparent! hover:opacity-75"
            danger
            onClick={() => onDelete(params.data)}
          >
            <Icon name="Trash2" size="18" className="inline-block" />
          </Button>
        </Space>
      ),
    },
  ]
}
