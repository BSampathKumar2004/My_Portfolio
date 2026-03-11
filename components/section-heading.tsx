type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <span className="theme-pill inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.3em]">
        {eyebrow}
      </span>
      <h2 className="mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-[-0.035em] text-[color:var(--foreground-strong)] sm:text-5xl lg:text-[4.25rem] lg:leading-[0.98]">
        {title}
      </h2>
      <p className="mt-6 max-w-2xl text-balance text-base leading-8 text-[color:var(--foreground-soft)] sm:text-lg">
        {description}
      </p>
    </div>
  );
}
