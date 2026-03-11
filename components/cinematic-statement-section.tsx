"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CinematicStatement } from "@/lib/portfolio-data";

type CinematicStatementSectionProps = {
  statement: CinematicStatement;
};

export function CinematicStatementSection({
  statement,
}: CinematicStatementSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      if (!sectionRef.current || !titleRef.current || !bodyRef.current || !glowRef.current) {
        return;
      }

      gsap.fromTo(
        titleRef.current,
        { opacity: 0.08, y: 72, scale: 0.985, force3D: true },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 84%",
            end: "top 38%",
            scrub: 0.9,
          },
        },
      );

      gsap.fromTo(
        bodyRef.current,
        { opacity: 0, y: 34, force3D: true },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            end: "top 42%",
            scrub: 0.85,
          },
        },
      );

      gsap.fromTo(
        glowRef.current,
        { yPercent: -12, scale: 0.9, opacity: 0.14, force3D: true },
        {
          yPercent: 12,
          scale: 1.08,
          opacity: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.95,
          },
        },
      );
    }, sectionRef);

    return () => context.revert();
  }, [statement]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[82vh] items-center justify-center overflow-hidden py-14"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-[24rem] w-[24rem] -translate-y-1/2 rounded-full blur-[120px] will-change-transform sm:h-[30rem] sm:w-[30rem]"
        style={{ backgroundColor: "var(--glow-primary)" }}
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <span className="theme-pill inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.32em]">
          {statement.eyebrow}
        </span>
        <h2
          ref={titleRef}
          className="text-balance mt-8 text-5xl font-semibold tracking-[-0.05em] text-[color:var(--foreground-strong)] sm:text-6xl lg:text-[5.8rem] lg:leading-[0.94]"
        >
          {statement.title}
        </h2>
        <p
          ref={bodyRef}
          className="text-balance mx-auto mt-9 max-w-3xl text-lg leading-9 text-[color:var(--foreground-soft)] sm:text-xl"
        >
          {statement.description}
        </p>
      </div>
    </section>
  );
}
