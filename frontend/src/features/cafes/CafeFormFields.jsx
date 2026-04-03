import { Controller } from 'react-hook-form'
import { Input, Typography } from 'antd'

const { Text } = Typography

function FieldLabel({ children }) {
  return (
    <Text className="mb-2 block text-xs! uppercase tracking-wider text-on-surface-variant! font-semibold!">
      {children}
    </Text>
  )
}

export default function CafeFormFields({ control, errors }) {
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
        {errors.name ? <Text className="mt-1 block text-red-500!">{errors.name.message}</Text> : null}
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
        {errors.location ? <Text className="mt-1 block text-red-500!">{errors.location.message}</Text> : null}
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
        {errors.description ? <Text className="mt-1 block text-red-500!">{errors.description.message}</Text> : null}
      </div>

      <div className="md:col-span-2">
        <FieldLabel>Logo URL (optional)</FieldLabel>
        <Controller
          name="logo_path"
          control={control}
          rules={{
            pattern: {
              value: /^(https?:\/\/)?[\w.-]+(?:\.[\w.-]+)+(?:[\w\-._~:\/?#[\]@!$&'()*+,;=.]+)?$/,
              message: 'Please enter a valid URL',
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="https://example.com/logo.png"
              className="bg-surface-container-lowest! text-on-surface!"
              status={errors.logo_path ? 'error' : ''}
            />
          )}
        />
        {errors.logo_path ? <Text className="mt-1 block text-red-500!">{errors.logo_path.message}</Text> : null}
      </div>
    </div>
  )
}