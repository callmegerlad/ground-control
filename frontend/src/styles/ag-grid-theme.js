import { themeQuartz } from 'ag-grid-community'

export const groundControlGridTheme = themeQuartz.withParams({
  accentColor: 'var(--primary)',
  backgroundColor: 'var(--surface-container-lowest)',
  foregroundColor: 'var(--on-surface)',
  borderColor: 'transparent',
  headerBackgroundColor: 'var(--surface-container-high)',
  headerTextColor: 'var(--on-surface-variant)',
  evenRowBackgroundColor: 'var(--surface-container-low)',
  oddRowBackgroundColor: 'var(--surface-container-lowest)',
  rowHoverColor: 'color-mix(in srgb, var(--surface-container-low) 70%, transparent)',
  selectedRowBackgroundColor: 'color-mix(in srgb, var(--secondary) 12%, transparent)',
  fontFamily: 'var(--font-inter)',
  spacing: 10,
  wrapperBorder: false,
  cellHorizontalPadding: 20,
  headerHeight: 56,
})
