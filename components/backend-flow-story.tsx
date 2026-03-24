"use client";

import { memo, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { BackendFlowStep } from "@/lib/portfolio-data";

type BackendFlowStoryProps = {
  getPinnedOffset: () => number;
  steps: BackendFlowStep[];
};

export const BackendFlowStory = memo(function BackendFlowStory({
  getPinnedOffset,
  steps,
}: BackendFlowStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    const context = gsap.context(() => {
      const flowSteps = stepRefs.current.filter(Boolean) as HTMLDivElement[];

      if (
        !sectionRef.current ||
        !introRef.current ||
        !lineRef.current ||
        flowSteps.length === 0
      ) {
        return;
      }

      const buildTimeline = (pin: boolean, minDistance: number) => {
        gsap.set(flowSteps, { opacity: 0.18, y: 36, scale: 0.985, force3D: true });
        gsap.set(flowSteps[0], { opacity: 1, y: 0, scale: 1 });
        gsap.set(lineRef.current, {
          scaleY: 1 / Math.max(flowSteps.length, 1),
          transformOrigin: "top center",
          force3D: true,
        });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: pin ? () => `top top+=${getPinnedOffset()}` : "top 82%",
            end: () =>
              `+=${Math.max(
                window.innerHeight * (pin ? 2.7 : 1.5),
                minDistance,
              )}`,
            pin,
            pinSpacing: pin,
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline.fromTo(
          introRef.current,
          { opacity: 0.22, y: 28, force3D: true },
          { opacity: 1, y: 0, force3D: true },
          0,
        );

        flowSteps.forEach((step, index) => {
          const position = index * 0.58;

          timeline.to(
            lineRef.current,
            {
              scaleY: (index + 1) / flowSteps.length,
              duration: 0.22,
              force3D: true,
            },
            position,
          );

          timeline.to(
            step,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.24,
              force3D: true,
            },
            position,
          );

          if (index > 0) {
            timeline.to(
              flowSteps[index - 1],
              {
                opacity: 0.44,
                scale: 0.975,
                duration: 0.2,
                force3D: true,
              },
              position,
            );
          }
        });

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      };

      media.add("(min-width: 1024px)", () => buildTimeline(true, 2360));
      media.add("(max-width: 1023px)", () => buildTimeline(false, 1400));
    }, sectionRef);

    return () => {
      media.revert();
      context.revert();
    };
  }, [getPinnedOffset, steps]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-14">
      <div className="glass-panel relative overflow-hidden rounded-[2.5rem] px-6 py-12 sm:px-8 lg:px-12 lg:py-14">
        <div
          className="pointer-events-none absolute left-[-10%] top-0 h-60 w-60 rounded-full blur-[120px]"
          style={{ backgroundColor: "var(--glow-primary)" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-[-5%] h-56 w-56 rounded-full blur-[120px]"
          style={{ backgroundColor: "var(--glow-secondary)" }}
        />

        <div className="grid gap-14 lg:min-h-[72vh] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-center">
          <div ref={introRef} className="max-w-xl">
            <span className="theme-pill inline-flex rounded-full px-4 py-2 text-xs uppercase tracking-[0.32em]">
              Backend Systems
            </span>
            <h2 className="text-balance mt-8 text-4xl font-semibold tracking-[-0.04em] text-[color:var(--foreground-strong)] sm:text-5xl lg:text-[4.3rem] lg:leading-[0.98]">
              A backend pipeline should read like a clear sequence, not a mystery.
            </h2>
            <p className="text-balance mt-7 max-w-lg text-base leading-8 text-[color:var(--foreground-soft)] sm:text-lg">
              This is the flow I use to think about scalable APIs, asynchronous
              workers, and AI-powered document processing systems.
            </p>
          </div>

          <div className="relative pl-4 sm:pl-8">
            <div className="absolute left-4 top-0 h-full w-px bg-[color:var(--soft-border)] sm:left-8">
              <div
                ref={lineRef}
                className="h-full w-full origin-top bg-gradient-to-b from-sky-200 via-sky-300 to-cyan-400 will-change-transform"
              />
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                  className="relative pl-14 will-change-transform sm:pl-16"
                >
                  <span className="theme-surface-strong absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-[color:var(--foreground-strong)] shadow-[0_10px_30px_rgba(2,8,23,0.12)] sm:h-9 sm:w-9">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight text-[color:var(--foreground-strong)] sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-[color:var(--foreground-soft)] sm:text-base">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
