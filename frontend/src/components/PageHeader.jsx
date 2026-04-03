import { Typography } from 'antd'

const { Paragraph, Text, Title } = Typography

export default function PageHeader({ title, description, meta, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <Title level={2} className="my-2! text-5xl! font-extrabold! text-on-surface!">
          {title}
        </Title>
        <Paragraph className="mb-0! text-on-surface-variant!">
          {description}
        </Paragraph>
        {meta ? (
          <Text type="secondary" className="text-on-surface-variant!">
            {meta}
          </Text>
        ) : null}
      </div>
      {actions}
    </div>
  )
}
