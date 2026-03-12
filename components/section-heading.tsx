type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
  variant?: "default" | "compact";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  variant = "default",
}: SectionHeadingProps) {
  const titleClassName =
    variant === "compact"
      ? "mt-6 max-w-4xl text-balance text-3xl font-semibold tracking-[-0.03em] text-[color:var(--foreground-strong)] sm:text-4xl lg:text-[3.4rem] lg:leading-[1.02]"
      : "mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-[-0.035em] text-[color:var(--foreground-strong)] sm:text-5xl lg:text-[4.25rem] lg:leading-[0.98]";

  return (
    <div className={className}>
      <span className="theme-pill inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.3em]">
        {eyebrow}
      </span>
      <h2 className={titleClassName}>
        {title}
      </h2>
      <p className="mt-6 max-w-2xl text-balance text-base leading-8 text-[color:var(--foreground-soft)] sm:text-lg">
        {description}
      </p>
    </div>
  );
}
