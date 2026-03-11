"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowLeft,
  ArrowRight,
  CalendarRange,
  FileSearch,
  RadioTower,
} from "lucide-react";
import type { ProjectItem } from "@/lib/portfolio-data";

type ProjectsShowcaseProps = {
  getPinnedOffset: () => number;
  lenisRef: MutableRefObject<Lenis | null>;
  projects: ProjectItem[];
};

const sliderEasing = (t: number) => 1 - Math.pow(1 - t, 4);

const iconByProject: Record<string, typeof FileSearch> = {
  "AI Document Processing Pipeline": FileSearch,
  "YouTube Live Streaming Backend System": RadioTower,
  "Hall Booking Management System": CalendarRange,
};

export function ProjectsShowcase({
  getPinnedOffset,
  lenisRef,
  projects,
}: ProjectsShowcaseProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const getCardTargetOffset = (card: HTMLElement, viewport: HTMLDivElement) =>
    Math.max(0, card.offsetLeft - (viewport.clientWidth - card.clientWidth) / 2);
  const getLastCardOffset = (viewport: HTMLDivElement) => {
    const lastCard = cardRefs.current[projects.length - 1];

    if (!lastCard) {
      return 0;
    }

    return Math.max(0, getCardTargetOffset(lastCard, viewport));
  };

  const setActiveCardIndex = (nextIndex: number) => {
    if (activeIndexRef.current === nextIndex) {
      return;
    }

    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncViewportMode = () => setIsDesktop(mediaQuery.matches);

    syncViewportMode();
    mediaQuery.addEventListener("change", syncViewportMode);

    return () => {
      mediaQuery.removeEventListener("change", syncViewportMode);
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(min-width: 1024px)", () => {
      const stage = stageRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;

      if (!stage || !viewport || !track) {
        return;
      }

      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];

      if (cards.length === 0) {
        return;
      }

      const syncTrackPadding = () => {
        const firstCard = cards[0];
        const lastCard = cards[cards.length - 1];

        if (!firstCard || !lastCard) {
          return;
        }

        const startInset = Math.max(
          24,
          (viewport.clientWidth - firstCard.clientWidth) / 2,
        );
        const endInset = Math.max(
          24,
          (viewport.clientWidth - lastCard.clientWidth) / 2,
        );

        track.style.paddingLeft = `${startInset}px`;
        track.style.paddingRight = `${endInset}px`;
      };

      const getMaxOffset = () =>
        Math.max(0, getCardTargetOffset(cards[cards.length - 1], viewport));
      const focusSpan = () => Math.max(viewport.clientWidth * 0.72, 1);

      const getClosestIndex = (currentOffset: number) => {
        let nextIndex = 0;
        let smallestDistance = Number.POSITIVE_INFINITY;

        cards.forEach((card, index) => {
          const distance = Math.abs(getCardTargetOffset(card, viewport) - currentOffset);

          if (distance < smallestDistance) {
            smallestDistance = distance;
            nextIndex = index;
          }
        });

        return nextIndex;
      };

      const syncCardFocus = (currentOffset: number) => {
        cards.forEach((card) => {
          const distance = Math.abs(
            getCardTargetOffset(card, viewport) - currentOffset,
          );
          const proximity = Math.max(0, 1 - distance / focusSpan());

          gsap.set(card, {
            scale: 0.92 + proximity * 0.1,
            y: -12 * proximity,
            opacity: 0.44 + proximity * 0.56,
            zIndex: Math.round(10 + proximity * 10),
            force3D: true,
          });
        });
      };

      const trackTween = gsap.to(track, {
        x: () => -getMaxOffset(),
        ease: "none",
        force3D: true,
        paused: true,
      });

      syncTrackPadding();

      const trigger = ScrollTrigger.create({
        trigger: stage,
        start: () => `top top+=${getPinnedOffset()}`,
        end: () => `+=${Math.max(getMaxOffset(), 1)}`,
        animation: trackTween,
        scrub: true,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap:
          projects.length > 1
            ? {
                snapTo: (value) => {
                  const distance = getMaxOffset();

                  if (distance <= 0) {
                    return 0;
                  }

                  const currentOffset = value * distance;
                  const closestIndex = getClosestIndex(currentOffset);
                  const targetOffset = getCardTargetOffset(cards[closestIndex], viewport);

                  return targetOffset / distance;
                },
                delay: 0.03,
                inertia: false,
                duration: { min: 0.18, max: 0.38 },
                ease: "power2.out",
              }
            : undefined,
        onUpdate: (self) => {
          const currentOffset = self.progress * getMaxOffset();
          syncCardFocus(currentOffset);
          const nextIndex = getClosestIndex(currentOffset);
          setActiveCardIndex(nextIndex);
        },
        onRefreshInit: () => {
          syncTrackPadding();
        },
        onRefresh: (self) => {
          const currentOffset = self.progress * getMaxOffset();
          syncCardFocus(currentOffset);
          const nextIndex = getClosestIndex(currentOffset);
          setActiveCardIndex(nextIndex);
        },
      });

      triggerRef.current = trigger;
      syncCardFocus(0);

      return () => {
        triggerRef.current = null;
        trigger.kill();
        trackTween.kill();
        gsap.set(track, { clearProps: "transform,paddingLeft,paddingRight" });
        gsap.set(cards, { clearProps: "all" });
      };
    });

    media.add("(max-width: 1023px)", () => {
      const viewport = viewportRef.current;

      if (!viewport) {
        return;
      }

      let frameId = 0;

      const updateActiveCard = () => {
        if (frameId) {
          return;
        }

        frameId = window.requestAnimationFrame(() => {
          frameId = 0;

          const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
          let nextIndex = 0;
          let smallestDistance = Number.POSITIVE_INFINITY;

          cardRefs.current.forEach((card, index) => {
            if (!card) {
              return;
            }

            const cardCenter = card.offsetLeft + card.clientWidth / 2;
            const distance = Math.abs(cardCenter - viewportCenter);

            if (distance < smallestDistance) {
              smallestDistance = distance;
              nextIndex = index;
            }
          });

          setActiveCardIndex(nextIndex);
        });
      };

      updateActiveCard();
      viewport.addEventListener("scroll", updateActiveCard, { passive: true });

      return () => {
        if (frameId) {
          window.cancelAnimationFrame(frameId);
        }
        viewport.removeEventListener("scroll", updateActiveCard);
      };
    });

    return () => media.revert();
  }, [getPinnedOffset, projects.length]);

  const goToIndex = (index: number) => {
    const nextIndex = Math.max(0, Math.min(projects.length - 1, index));
    setActiveCardIndex(nextIndex);

    if (isDesktop && triggerRef.current && lenisRef.current) {
      const trigger = triggerRef.current;
      const viewport = viewportRef.current;
      const card = cardRefs.current[nextIndex];

      if (!viewport || !card) {
        return;
      }

      const distance = getLastCardOffset(viewport);

      if (distance <= 0) {
        return;
      }

      const progress = getCardTargetOffset(card, viewport) / distance;
      const triggerEnd = typeof trigger.end === "number" ? trigger.end : trigger.start;
      const targetScroll = trigger.start + (triggerEnd - trigger.start) * progress;

      lenisRef.current.scrollTo(targetScroll, {
        duration: 1.05,
        easing: sliderEasing,
        lock: true,
      });
      return;
    }

    const viewport = viewportRef.current;
    const card = cardRefs.current[nextIndex];

    if (!viewport || !card) {
      return;
    }

    const targetLeft = getCardTargetOffset(card, viewport);

    gsap.to(viewport, {
      scrollLeft: targetLeft,
      duration: 0.8,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const lenisPreventProps = !isDesktop ? { "data-lenis-prevent": "" } : {};

  return (
    <div ref={stageRef} className="space-y-8 lg:min-h-[72vh]">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="text-sm leading-7 text-slate-300">
            Scroll to move through the projects horizontally, or use the controls to
            focus on each build individually.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous project"
            onClick={() => goToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-slate-100 transition-all hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            type="button"
            aria-label="Next project"
            onClick={() => goToIndex(activeIndex + 1)}
            disabled={activeIndex === projects.length - 1}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-4 text-sm font-medium text-sky-100 transition-all hover:bg-sky-300/15 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        {...lenisPreventProps}
        className={`relative ${
          isDesktop
            ? "overflow-hidden"
            : "no-scrollbar snap-x snap-mandatory overflow-x-auto overflow-y-visible"
        }`}
      >
        {isDesktop ? (
          <>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#020617] via-[#020617]/75 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#020617] via-[#020617]/75 to-transparent" />
          </>
        ) : null}

        <div
          ref={trackRef}
          className="flex w-max gap-6 pb-4 pl-4 pr-4 pt-2 will-change-transform lg:gap-10 lg:pl-0 lg:pr-0"
        >
          {projects.map((project, index) => {
            const Icon = iconByProject[project.title] ?? FileSearch;
            const isActive = index === activeIndex;

            return (
              <article
                key={project.title}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className={`group relative flex w-[84vw] max-w-[36rem] shrink-0 snap-center flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.82))] p-6 shadow-[0_24px_80px_rgba(2,8,23,0.34)] transition-[border-color,box-shadow] duration-500 ease-out will-change-transform md:w-[32rem] lg:w-[36rem] lg:cursor-pointer ${
                  isActive
                    ? "border-sky-300/22 shadow-[0_34px_110px_rgba(2,8,23,0.46)]"
                    : "border-white/10"
                } ${
                  !isDesktop && isActive ? "scale-[1.01]" : ""
                } hover:border-white/20 hover:shadow-[0_34px_100px_rgba(2,8,23,0.5)]`}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-sky-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                    Project {index + 1}
                  </span>
                </div>

                <h3 className="mt-8 text-2xl font-semibold tracking-tight text-white md:text-[1.9rem]">
                  {project.title}
                </h3>

                <p className="mt-5 text-base leading-8 text-slate-300">
                  {project.description}
                </p>

                <p className="mt-6 rounded-3xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-7 text-slate-400">
                  {project.outcome}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-slate-300"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {projects.map((project, index) => (
          <button
            key={project.title}
            type="button"
            aria-label={`Go to ${project.title}`}
            onClick={() => goToIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex
                ? "w-10 bg-sky-300"
                : "w-2.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
