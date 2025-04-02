interface HeadingProps {
    title: string
    subtitle?: string
  }
  
  export function Heading({ title, subtitle }: HeadingProps) {
    return (
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">{title}</h2>
        {subtitle && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
      </div>
    )
  }
  
  