import { useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { groundControlGridTheme } from '../../styles/ag-grid-theme'
import { createEmployeeColumnDefs } from './employee-columns.jsx'

/**
 * EmployeesGrid Component
 * Reusable AG Grid table for displaying employees
 * @param {Object} props
 * @param {Array} props.rowData - Employee data
 * @param {Function} props.navigate - React Router navigate function
 * @param {Function} props.onDelete - Delete handler callback
 * @param {boolean} props.loading - Loading state
 */
export default function EmployeesGrid({ rowData, navigate, onDelete, loading }) {
  const columnDefs = useMemo(
    () => createEmployeeColumnDefs({ navigate, onDelete }),
    [navigate, onDelete],
  )

  return (
    <div className="ground-control-grid h-140 w-full rounded-xl">
      <AgGridReact
        theme={groundControlGridTheme}
        rowData={rowData}
        columnDefs={columnDefs}
        getRowId={(params) => String(params.data.id)}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
        }}
        rowHeight={66}
        suppressCellFocus
        animateRows
        suppressScrollOnNewData
        loading={loading}
      />
    </div>
  )
}
