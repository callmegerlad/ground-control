import { Button, Space } from 'antd'
import Icon from '../../components/Icon'
import dayjs from '../../lib/dayjs'

const formatDate = (isoValue) => dayjs(isoValue).format('DD MMM YYYY')

/**
 * Create cafe table column definitions
 * @param {Object} options
 * @param {Function} options.navigate - React Router navigate function
 * @param {Function} options.onDelete - Delete handler callback
 * @returns {Array} Column definitions for AG Grid
 */
export function createCafeColumnDefs({ navigate, onDelete }) {
  return [
    {
      headerName: 'Brand',
      field: 'logo_path',
      width: 100,
      sortable: false,
      filter: false,
      cellRenderer: (params) => {
        const hasLogo = Boolean(params.value)
        if (hasLogo) {
          return (
            <img
              src={params.value}
              alt={`${params.data.name} logo`}
              className="h-12 w-12 rounded-lg object-cover"
            />
          )
        }

        return (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-high text-xs font-bold text-on-surface-variant">
            {params.data.name.slice(0, 2).toUpperCase()}
          </div>
        )
      },
    },
    {
      headerName: 'Cafe Name',
      field: 'name',
      minWidth: 190,
      wrapText: true,
      cellRenderer: (params) => (
        <div className="flex flex-col gap-4">
          <span className="font-semibold text-on-surface">{params.value}</span>
          <span className="text-xs text-on-surface-variant">Created {formatDate(params.data.created_at)}</span>
        </div>
      ),
    },
    {
      headerName: 'Description',
      field: 'description',
      flex: 1,
      minWidth: 240,
      autoHeight: true,
      cellClass: 'text-on-surface-variant',
      wrapText: true,
      cellStyle: {
        alignItems: 'flex-start',
      },
    },
    {
      headerName: 'Employees',
      field: 'employees',
      width: 140,
      cellRenderer: (params) => (
        <Button
          type="link"
          className="px-0! font-semibold! text-primary!"
          onClick={() => navigate(`/employees?cafeId=${params.data.id}&cafeName=${encodeURIComponent(params.data.name)}`)}
        >
          <Icon name="Users" size="16" className="inline-block" />
          {params.value}
        </Button>
      ),
    },
    {
      headerName: 'Location',
      field: 'location',
      width: 180,
      cellClass: 'text-on-surface-variant',
      wrapText: true,
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
            onClick={() => navigate(`/cafes/edit/${params.data.id}`)}
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
