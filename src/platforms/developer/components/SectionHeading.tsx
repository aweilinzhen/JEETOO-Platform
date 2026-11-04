type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  light?: boolean
}

export function SectionHeading({ eyebrow, title, description, light = false }: SectionHeadingProps) {
  return (
    <div className={`section-heading${light ? ' is-light' : ''}`}>
      <div className="section-eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}
