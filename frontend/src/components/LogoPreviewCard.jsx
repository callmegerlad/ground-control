import { Typography } from 'antd'

const { Text } = Typography

export default function LogoPreviewCard({
  logoPath,
  alt,
  title,
  subtitle,
  showPath,
  hideImageOnError,
  actions,
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-4">
      <img
        src={logoPath}
        alt={alt}
        className="h-32 w-32 shrink-0 rounded-xl object-cover shadow-sm"
        onError={hideImageOnError ? (event) => {
          event.currentTarget.style.display = 'none'
        } : undefined}
      />
      <div className="flex min-w-0 flex-col gap-1.5">
        <Text className="text-sm font-semibold text-on-surface!">{title}</Text>
        {subtitle ? (
          <Text className="text-xs text-on-surface-variant!">{subtitle}</Text>
        ) : null}
        {showPath ? (
          <Text className="block truncate text-xs text-on-surface-variant! text-wrap">{logoPath}</Text>
        ) : null}
        {actions ? <div className="mt-1 flex gap-2">{actions}</div> : null}
      </div>
    </div>
  )
}