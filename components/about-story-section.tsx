"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AboutStoryStep } from "@/lib/portfolio-data";

type AboutStorySectionProps = {
  getPinnedOffset: () => number;
  steps: AboutStoryStep[];
};

export function AboutStorySection({
  getPinnedOffset,
  steps,
}: AboutStorySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    const context = gsap.context(() => {
      const storySteps = stepRefs.current.filter(Boolean) as HTMLDivElement[];

      if (!sectionRef.current || storySteps.length === 0) {
        return;
      }

      const buildTimeline = (distanceMultiplier: number, minDistance: number) => {
        gsap.set(storySteps, { opacity: 0, y: 40, force3D: true });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: () => `top top+=${getPinnedOffset()}`,
            end: () =>
              `+=${Math.max(window.innerHeight * distanceMultiplier, minDistance)}`,
            pin: true,
            pinSpacing: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        storySteps.forEach((step, index) => {
          const isLast = index === storySteps.length - 1;
          const position = index * 0.94;

          timeline.to(
            step,
            { opacity: 1, y: 0, duration: 0.4, force3D: true },
            position,
          );

          if (!isLast) {
            timeline.to(
              step,
              { opacity: 0, y: -28, duration: 0.38, force3D: true },
              position + 0.56,
            );
          }
        });

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      };

      media.add("(min-width: 1024px)", () => buildTimeline(3.5, 2400));
      media.add("(max-width: 1023px)", () => buildTimeline(2.8, 1800));
    }, sectionRef);

    return () => {
      media.revert();
      context.revert();
    };
  }, [getPinnedOffset, steps]);

  return (
    <div ref={sectionRef} className="relative">
      <div className="mx-auto mb-8 flex w-fit rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300">
        About
      </div>

      <div className="relative flex min-h-[64vh] items-center justify-center overflow-hidden">
        {steps.map((step, index) => (
          <div
            key={step.title}
            ref={(node) => {
              stepRefs.current[index] = node;
            }}
            className="absolute inset-0 flex items-center justify-center px-4"
          >
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {step.title}
              </h2>
              <p className="text-balance mx-auto mt-6 max-w-3xl text-lg leading-9 text-slate-300 sm:text-xl">
                {step.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
