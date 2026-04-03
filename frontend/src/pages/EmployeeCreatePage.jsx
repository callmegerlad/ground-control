import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import dayjs from '../lib/dayjs'
import EntityFormTemplate from '../components/FormTemplate'
import EmployeeFormFields from '../features/employees/EmployeeFormFields'
import { useCafes } from '../hooks/use-cafes'
import { useCreateEmployee } from '../hooks/use-employees'

function toEmployeePayload(values) {
  return {
    id: values.id.trim(),
    name: values.name.trim(),
    email_address: values.email_address.trim(),
    phone_number: values.phone_number.trim(),
    gender: values.gender,
    cafe_id: values.cafe_id || null,
    start_date: values.start_date ? values.start_date.toISOString() : null,
  }
}

export default function EmployeeCreatePage() {
  const navigate = useNavigate()
  const cafesQuery = useCafes(undefined)
  const createEmployeeMutation = useCreateEmployee()

  const cafeOptions = useMemo(
    () =>
      (cafesQuery.data ?? []).map((cafe) => ({
        label: cafe.name,
        value: cafe.id,
      })),
    [cafesQuery.data],
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      id: '',
      name: '',
      email_address: '',
      phone_number: '',
      gender: undefined,
      cafe_id: undefined,
      start_date: dayjs(),
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    await createEmployeeMutation.mutateAsync(toEmployeePayload(values))
    navigate('/employees')
  })

  const errorMessage =
    createEmployeeMutation.error?.response?.data?.detail || createEmployeeMutation.error?.message

  return (
    <EntityFormTemplate
      title="Create Employee"
      description="Register a new employee and optionally assign a cafe."
      cancelTo="/employees"
      submitLabel="Create Employee"
      onSubmit={onSubmit}
      isSubmitting={createEmployeeMutation.isPending}
      errorMessage={errorMessage}
    >
      <EmployeeFormFields
        control={control}
        errors={errors}
        cafeOptions={cafeOptions}
        isEditMode={false}
      />
    </EntityFormTemplate>
  )
}