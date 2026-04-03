import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Alert, Spin } from 'antd'
import EntityFormTemplate from '../components/FormTemplate'
import EmployeeFormFields from '../features/employees/EmployeeFormFields'
import { useCafes } from '../hooks/use-cafes'
import { useEmployees, useUpdateEmployee } from '../hooks/use-employees'

function toEmployeePayload(values) {
  return {
    name: values.name.trim(),
    email_address: values.email_address.trim(),
    phone_number: values.phone_number.trim(),
    gender: values.gender,
    cafe_id: values.cafe_id || null,
    start_date: values.start_date ? values.start_date.toISOString() : null,
  }
}

export default function EmployeeEditPage() {
  const navigate = useNavigate()
  const { employeeId } = useParams()
  const employeesQuery = useEmployees(undefined)
  const cafesQuery = useCafes(undefined)
  const updateEmployeeMutation = useUpdateEmployee()

  const employee = (employeesQuery.data ?? []).find((item) => item.id === employeeId)

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
    reset,
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
      start_date: null,
    },
  })

  useEffect(() => {
    if (!employee) {
      return
    }

    const cafeId = (cafesQuery.data ?? []).find((cafe) => cafe.name === employee.cafe)?.id

    reset({
      id: employee.id,
      name: employee.name,
      email_address: employee.email_address,
      phone_number: employee.phone_number,
      gender: employee.gender,
      cafe_id: cafeId,
      start_date: null,
    })
  }, [employee, cafesQuery.data, reset])

  const onSubmit = handleSubmit(async (values) => {
    await updateEmployeeMutation.mutateAsync({
      employeeId,
      payload: toEmployeePayload(values),
    })
    navigate('/employees')
  })

  const errorMessage =
    updateEmployeeMutation.error?.response?.data?.detail || updateEmployeeMutation.error?.message

  if (employeesQuery.isLoading || cafesQuery.isLoading) {
    return <Spin />
  }

  if (employeesQuery.isError || cafesQuery.isError) {
    return <Alert type="error" showIcon message="Unable to load employee details" />
  }

  if (!employee) {
    return <Alert type="error" showIcon message="Employee not found" />
  }

  return (
    <EntityFormTemplate
      title="Update Employee"
      description="Update employee profile and assignment details."
      cancelTo="/employees"
      submitLabel="Update Employee"
      onSubmit={onSubmit}
      isSubmitting={updateEmployeeMutation.isPending}
      errorMessage={errorMessage}
    >
      <EmployeeFormFields
        control={control}
        errors={errors}
        cafeOptions={cafeOptions}
        isEditMode
      />
    </EntityFormTemplate>
  )
}