import { useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { groundControlGridTheme } from '../../styles/ag-grid-theme'
import { createCafeColumnDefs } from './cafe-columns.jsx'

/**
 * CafesGrid Component
 * Reusable AG Grid table for displaying cafes
 * @param {Object} props
 * @param {Array} props.rowData - Cafe data
 * @param {Function} props.navigate - React Router navigate function
 * @param {Function} props.onDelete - Delete handler callback
 * @param {boolean} props.loading - Loading state
 */
export default function CafesGrid({ rowData, navigate, onDelete, loading }) {
  const columnDefs = useMemo(
    () => createCafeColumnDefs({ navigate, onDelete }),
    [navigate, onDelete],
  )

  return (
    <div className="ground-control-grid h-[560px] w-full">
      <AgGridReact
        theme={groundControlGridTheme}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          floatingFilter: false,
        }}
        animateRows
        rowHeight={76}
        suppressCellFocus
        loading={loading}
      />
    </div>
  )
}
