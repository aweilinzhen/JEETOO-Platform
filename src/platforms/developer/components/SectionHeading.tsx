type SectionHeadingProps = {
  title: string
  description?: string
  light?: boolean
}

export function SectionHeading({ title, description, light = false }: SectionHeadingProps) {
  return (
    <div className={`section-heading${light ? ' is-light' : ''}`}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
