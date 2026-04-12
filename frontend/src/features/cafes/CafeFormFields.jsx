import { useEffect, useState } from 'react'
import { Controller, useWatch } from 'react-hook-form'
import { Input, message, Segmented, Spin, Typography, Upload } from 'antd'
import { CloudUploadOutlined, DeleteOutlined, LinkOutlined, ReloadOutlined } from '@ant-design/icons'
import { uploadMedia } from '../../api/media'
import LogoPreviewCard from '../../components/LogoPreviewCard'

const { Text } = Typography

const MAX_FILE_SIZE_MB = 2
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
const MEDIA_PUBLIC_URL_PATH = import.meta.env.VITE_MEDIA_PUBLIC_URL_PATH || '/static/uploads'

function FieldLabel({ children }) {
  return (
    <Text className="mb-2 block text-xs! uppercase tracking-wider text-on-surface-variant! font-semibold!">
      {children}
    </Text>
  )
}

function LogoUploadMode({ logoPath, isUploading, uploadProps, onRemove }) {
  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-outline-variant bg-surface-container-low py-8">
        <Spin size="large" />
        <Text className="text-sm text-on-surface-variant!">Uploading image…</Text>
      </div>
    )
  }

  if (logoPath) {
    return (
      <LogoPreviewCard
        logoPath={logoPath}
        alt="Cafe logo preview"
        title="Uploaded Logo Preview"
        subtitle="This image will be saved with the cafe"
        actions={(
          <>
            <Upload {...uploadProps}>
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high"
              >
                <ReloadOutlined style={{ fontSize: 10 }} />
                Replace
              </button>
            </Upload>
            <button
              type="button"
              onClick={onRemove}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
            >
              <DeleteOutlined style={{ fontSize: 10 }} />
              Remove
            </button>
          </>
        )}
      />
    )
  }

  return (
    <div>
    <Upload.Dragger
      {...uploadProps}
      style={{ background: 'transparent', borderRadius: '0.75rem' }}
    >
      <div className="flex flex-col items-center gap-2 py-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <CloudUploadOutlined className="text-2xl text-primary!" />
        </div>
        <Text className="text-sm font-medium text-on-surface!">
          Click or drag image here to upload (max. {MAX_FILE_SIZE_MB} MB)
        </Text>
        <Text className="text-xs text-on-surface-variant!">
          JPG, PNG, GIF, WebP, SVG
        </Text>
      </div>
    </Upload.Dragger>
    </div>
  )
}

function LogoUrlMode({ control, errors, logoPath }) {
  return (
    <div className="space-y-3">
      <Controller
        name="logo_path"
        control={control}
        rules={{
          pattern: {
            value: /^(https?:\/\/)?[\w.-]+(?:\.[\w.-]+)+(?:[\w\-._~:/?#[\]@!$&'()*+,;=.]+)?$/,
            message: 'Please enter a valid URL',
          },
        }}
        render={({ field }) => (
          <Input
            {...field}
            prefix={<LinkOutlined className="text-on-surface-variant" />}
            placeholder="https://example.com/logo.png"
            className="bg-surface-container-lowest! text-on-surface!"
            status={errors.logo_path ? 'error' : ''}
            allowClear
          />
        )}
      />
      {errors.logo_path && (
        <Text className="block text-red-500!">{errors.logo_path.message}</Text>
      )}
      {logoPath && !errors.logo_path && (
        <LogoPreviewCard
          logoPath={logoPath}
          alt="Logo preview"
          title="Logo URL Preview"
          showPath
          hideImageOnError
        />
      )}
    </div>
  )
}

export default function CafeFormFields({ control, errors, setValue }) {
  const logoPath = useWatch({ control, name: 'logo_path' })
  const [logoMode, setLogoMode] = useState('upload')
  const [isUploading, setIsUploading] = useState(false)
  const [modeInitialized, setModeInitialized] = useState(false)

  // On edit page load, detect the appropriate mode from the existing logo_path
  useEffect(() => {
    if (logoPath && !modeInitialized) {
      setModeInitialized(true)
      setLogoMode(logoPath.includes(MEDIA_PUBLIC_URL_PATH) ? 'upload' : 'url')
    }
  }, [logoPath, modeInitialized])

  const handleModeChange = (mode) => {
    setLogoMode(mode)
    setValue('logo_path', '', { shouldDirty: true })
  }

  const beforeUpload = (file) => {
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      message.error('Only image files (JPG, PNG, GIF, WebP, SVG) are accepted.')
      return Upload.LIST_IGNORE
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      message.error(`Image exceeds ${MAX_FILE_SIZE_MB} MB! Please upload a smaller image.`)
      return Upload.LIST_IGNORE
    }
    return true
  }

  const customRequest = async ({ file, onSuccess, onError }) => {
    setIsUploading(true)
    try {
      const result = await uploadMedia(file)
      setValue('logo_path', result.url, { shouldDirty: true })
      onSuccess(result)
    } catch {
      message.error('Upload failed. Please try again.')
      onError(new Error('Upload failed'))
    } finally {
      setIsUploading(false)
    }
  }

  const uploadProps = {
    accept: 'image/*',
    showUploadList: false,
    beforeUpload,
    customRequest,
    disabled: isUploading,
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div>
        <FieldLabel>Cafe Name</FieldLabel>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Cafe name is required' }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Blue Bean"
              className="bg-surface-container-lowest! text-on-surface!"
              status={errors.name ? 'error' : ''}
            />
          )}
        />
        {errors.name && (
          <Text className="mt-1 block text-red-500!">{errors.name.message}</Text>
        )}
      </div>

      <div>
        <FieldLabel>Location</FieldLabel>
        <Controller
          name="location"
          control={control}
          rules={{ required: 'Location is required' }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Singapore"
              className="bg-surface-container-lowest! text-on-surface!"
              status={errors.location ? 'error' : ''}
            />
          )}
        />
        {errors.location && (
          <Text className="mt-1 block text-red-500!">{errors.location.message}</Text>
        )}
      </div>

      <div className="md:col-span-2">
        <FieldLabel>Description</FieldLabel>
        <Controller
          name="description"
          control={control}
          rules={{ required: 'Description is required' }}
          render={({ field }) => (
            <Input.TextArea
              {...field}
              placeholder="Describe this cafe..."
              autoSize={{ minRows: 4, maxRows: 8 }}
              className="bg-surface-container-lowest! text-on-surface!"
              status={errors.description ? 'error' : ''}
            />
          )}
        />
        {errors.description && (
          <Text className="mt-1 block text-red-500!">{errors.description.message}</Text>
        )}
      </div>

      <div className="md:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Logo (optional)
          </span>
          <Segmented
            size="small"
            value={logoMode}
            onChange={handleModeChange}
            options={[
              { label: 'Upload', value: 'upload', icon: <CloudUploadOutlined /> },
              { label: 'URL', value: 'url', icon: <LinkOutlined /> },
            ]}
          />
        </div>

        {logoMode === 'upload' ? (
          <LogoUploadMode
            logoPath={logoPath}
            isUploading={isUploading}
            uploadProps={uploadProps}
            onRemove={() => setValue('logo_path', '', { shouldDirty: true })}
          />
        ) : (
          <LogoUrlMode control={control} errors={errors} logoPath={logoPath} />
        )}
      </div>
    </div>
  )
}
