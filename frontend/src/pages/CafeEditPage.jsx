import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Alert, Spin } from 'antd'
import EntityFormTemplate from '../components/FormTemplate'
import CafeFormFields from '../features/cafes/CafeFormFields'
import { useCafes, useUpdateCafe } from '../hooks/use-cafes'
import { useUnsavedChangesWarning } from '../hooks/use-unsaved-changes-warning'

function toCafePayload(values) {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    location: values.location.trim(),
    logo_path: values.logo_path?.trim() || null,
  }
}

export default function CafeEditPage() {
  const navigate = useNavigate()
  const { cafeId } = useParams()
  const cafesQuery = useCafes(undefined)
  const updateCafeMutation = useUpdateCafe()

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      description: '',
      location: '',
      logo_path: '',
    },
  })

  useUnsavedChangesWarning(isDirty)

  const cafe = (cafesQuery.data ?? []).find((item) => String(item.id) === String(cafeId))

  useEffect(() => {
    if (!cafe) {
      return
    }

    reset({
      name: cafe.name ?? '',
      description: cafe.description ?? '',
      location: cafe.location ?? '',
      logo_path: cafe.logo_path ?? '',
    })
  }, [cafe, reset])

  const onSubmit = handleSubmit(async (values) => {
    await updateCafeMutation.mutateAsync({
      cafeId,
      payload: toCafePayload(values),
    })
    navigate('/cafes')
  })

  const errorMessage = updateCafeMutation.error?.response?.data?.detail || updateCafeMutation.error?.message

  if (cafesQuery.isLoading) {
    return <Spin />
  }

  if (cafesQuery.isError) {
    return <Alert type="error" showIcon message="Unable to load cafes" />
  }

  if (!cafe) {
    return <Alert type="error" showIcon message="Cafe not found" />
  }

  return (
    <EntityFormTemplate
      title="Update Cafe"
      description="Edit cafe details and keep your network current."
      cancelTo="/cafes"
      submitLabel="Update Cafe"
      onSubmit={onSubmit}
      isSubmitting={updateCafeMutation.isPending}
      errorMessage={errorMessage}
      isDirty={isDirty}
    >
      <CafeFormFields control={control} errors={errors} setValue={setValue} />
    </EntityFormTemplate>
  )
}