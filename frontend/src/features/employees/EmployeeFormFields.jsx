import { Controller } from 'react-hook-form'
import { DatePicker, Input, Select, Typography } from 'antd'

const { Text } = Typography

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

function FieldLabel({ children }) {
  return (
    <Text className="mb-2 block text-xs! uppercase tracking-wider text-on-surface-variant! font-semibold!">
      {children}
    </Text>
  )
}

export default function EmployeeFormFields({ control, errors, cafeOptions, isEditMode }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div>
        <FieldLabel>Employee ID</FieldLabel>
        <Controller
          name="id"
          control={control}
          rules={{
            required: 'Employee ID is required',
            pattern: {
              value: /^UI[A-Za-z0-9]{7}$/,
              message: 'ID must match format UIXXXXXXX',
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              disabled={isEditMode}
              placeholder="UIA123456"
              className="bg-surface-container-lowest! text-on-surface!"
              status={errors.id ? 'error' : ''}
            />
          )}
        />
        {errors.id ? <Text className="mt-1 block text-red-500!">{errors.id.message}</Text> : null}
      </div>

      <div>
        <FieldLabel>Name</FieldLabel>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Name is required' }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Alex Tan"
              className="bg-surface-container-lowest! text-on-surface!"
              status={errors.name ? 'error' : ''}
            />
          )}
        />
        {errors.name ? <Text className="mt-1 block text-red-500!">{errors.name.message}</Text> : null}
      </div>

      <div>
        <FieldLabel>Email</FieldLabel>
        <Controller
          name="email_address"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email',
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="alex@groundcontrol.cafe"
              className="bg-surface-container-lowest! text-on-surface!"
              status={errors.email_address ? 'error' : ''}
            />
          )}
        />
        {errors.email_address ? (
          <Text className="mt-1 block text-red-500!">{errors.email_address.message}</Text>
        ) : null}
      </div>

      <div>
        <FieldLabel>Phone Number</FieldLabel>
        <Controller
          name="phone_number"
          control={control}
          rules={{
            required: 'Phone number is required',
            pattern: {
              value: /^[89][0-9]{7}$/,
              message: 'Phone must be 8 digits and start with 8 or 9',
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="91234567"
              className="bg-surface-container-lowest! text-on-surface!"
              status={errors.phone_number ? 'error' : ''}
            />
          )}
        />
        {errors.phone_number ? (
          <Text className="mt-1 block text-red-500!">{errors.phone_number.message}</Text>
        ) : null}
      </div>

      <div>
        <FieldLabel>Gender</FieldLabel>
        <Controller
          name="gender"
          control={control}
          rules={{ required: 'Gender is required' }}
          render={({ field }) => (
            <Select
              {...field}
              options={genderOptions}
              className="bg-surface-container-lowest! text-on-surface!"
              status={errors.gender ? 'error' : ''}
            />
          )}
        />
        {errors.gender ? <Text className="mt-1 block text-red-500!">{errors.gender.message}</Text> : null}
      </div>

      <div>
        <FieldLabel>Assigned Cafe (optional)</FieldLabel>
        <Controller
          name="cafe_id"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              allowClear
              options={cafeOptions}
              placeholder="Select a cafe"
              className="bg-surface-container-lowest! text-on-surface!"
            />
          )}
        />
      </div>

      <div className="md:col-span-2">
        <FieldLabel>Start Date (optional)</FieldLabel>
        <Controller
          name="start_date"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              className="w-full bg-surface-container-lowest! text-on-surface!"
              placeholder="Select start date"
              allowClear
            />
          )}
        />
      </div>
    </div>
  )
}