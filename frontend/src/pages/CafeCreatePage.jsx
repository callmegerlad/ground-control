import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import EntityFormTemplate from '../components/FormTemplate'
import CafeFormFields from '../features/cafes/CafeFormFields'
import { useCreateCafe } from '../hooks/use-cafes'

function toCafePayload(values) {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    location: values.location.trim(),
    logo_path: values.logo_path?.trim() || null,
  }
}

export default function CafeCreatePage() {
  const navigate = useNavigate()
  const createCafeMutation = useCreateCafe()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      description: '',
      location: '',
      logo_path: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    await createCafeMutation.mutateAsync(toCafePayload(values))
    navigate('/cafes')
  })

  const errorMessage = createCafeMutation.error?.response?.data?.detail || createCafeMutation.error?.message

  return (
    <EntityFormTemplate
      title="Create Cafe"
      description="Add a new cafe to your network."
      cancelTo="/cafes"
      submitLabel="Create Cafe"
      onSubmit={onSubmit}
      isSubmitting={createCafeMutation.isPending}
      errorMessage={errorMessage}
    >
      <CafeFormFields control={control} errors={errors} />
    </EntityFormTemplate>
  )
}