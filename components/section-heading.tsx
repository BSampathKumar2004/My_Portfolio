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
      <span className="inline-flex rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-slate-300">
        {eyebrow}
      </span>
      <h2 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-[3.75rem] lg:leading-[1.02]">
        {title}
      </h2>
      <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
