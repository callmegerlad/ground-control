import { Button, Space, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from './PageHeader'
import ActionButton from './ActionButton'
import { SaveOutlined } from '@ant-design/icons'

const { Text } = Typography

export default function EntityFormTemplate({
  title,
  description,
  cancelTo,
  submitLabel,
  submitIcon = <SaveOutlined />,
  submitButtonClassName,
  onSubmit,
  isSubmitting,
  children,
  errorMessage,
  isDirty = false,
}) {
  const navigate = useNavigate()

  const handleCancel = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return
    }
    navigate(cancelTo)
  }

  return (
    <section className="space-y-8">
      <PageHeader
        title={title}
        description={description}
        actions={
          <Space>
            <ActionButton
              label="Cancel"
              icon={null}
              type="default"
              className="shadow-none! font-semibold! h-auto px-4!"
              onClick={handleCancel}
            />
            <ActionButton
              label={submitLabel}
              icon={submitIcon}
              onClick={onSubmit}
              loading={isSubmitting}
              className={submitButtonClassName ?? 'bg-secondary! shadow-none! font-semibold! hover:opacity-90!'}
            />
          </Space>
        }
      />

      <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-ambient lg:p-8">
        <div>
          <Text className="text-on-surface-variant!"></Text>
        </div>
        <div className="space-y-6">{children}</div>
        {errorMessage ? (
          <Text className="block pt-4 text-red-500!">{errorMessage}</Text>
        ) : null}
      </div>
    </section>
  )
}