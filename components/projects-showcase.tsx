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

      let cardOffsets: number[] = [];
      let maxOffset = 0;

      const refreshMeasurements = () => {
        syncTrackPadding();
        cardOffsets = cards.map((card) => getCardTargetOffset(card, viewport));
        maxOffset = Math.max(0, cardOffsets[cards.length - 1] ?? 0);
      };

      const getMaxOffset = () => maxOffset;
      const focusSpan = () => Math.max(viewport.clientWidth * 0.78, 1);

      const getClosestIndex = (currentOffset: number) => {
        let nextIndex = 0;
        let smallestDistance = Number.POSITIVE_INFINITY;

        cardOffsets.forEach((offset, index) => {
          const distance = Math.abs(offset - currentOffset);

          if (distance < smallestDistance) {
            smallestDistance = distance;
            nextIndex = index;
          }
        });

        return nextIndex;
      };

      const syncCardFocus = (currentOffset: number) => {
        cards.forEach((card, index) => {
          const distance = Math.abs((cardOffsets[index] ?? 0) - currentOffset);
          const proximity = Math.max(0, 1 - distance / focusSpan());

          gsap.set(card, {
            scale: 0.89 + proximity * 0.14,
            y: -20 * proximity,
            opacity: 0.38 + proximity * 0.62,
            zIndex: Math.round(10 + proximity * 20),
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

      refreshMeasurements();

      const trigger = ScrollTrigger.create({
        trigger: stage,
        start: () => `top top+=${getPinnedOffset()}`,
        end: () => `+=${Math.max(getMaxOffset(), 1)}`,
        animation: trackTween,
        scrub: 0.9,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1.2,
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
                delay: 0.05,
                inertia: false,
                duration: { min: 0.22, max: 0.42 },
                ease: "power3.out",
              }
            : undefined,
        onUpdate: (self) => {
          const currentOffset = self.progress * getMaxOffset();
          syncCardFocus(currentOffset);
          const nextIndex = getClosestIndex(currentOffset);
          setActiveCardIndex(nextIndex);
        },
        onRefreshInit: () => {
          refreshMeasurements();
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
    <div ref={stageRef} className="space-y-10 lg:min-h-[78vh]">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-lg">
          <p className="text-sm leading-7 text-[color:var(--foreground-soft)]">
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
            className="interactive-button theme-button-secondary inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            type="button"
            aria-label="Next project"
            onClick={() => goToIndex(activeIndex + 1)}
            disabled={activeIndex === projects.length - 1}
            className="interactive-button theme-button-accent inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-35"
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
            <div className="theme-track-fade-left pointer-events-none absolute inset-y-0 left-0 z-10 w-28" />
            <div className="theme-track-fade-right pointer-events-none absolute inset-y-0 right-0 z-10 w-28" />
          </>
        ) : null}

        <div
          ref={trackRef}
          className="flex w-max gap-6 pb-6 pl-4 pr-4 pt-4 will-change-transform lg:gap-12 lg:pl-0 lg:pr-0"
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
                data-cursor-reactive
                data-cursor-reactive-intensity="0.9"
                className={`group glass-panel relative flex w-[84vw] max-w-[36rem] shrink-0 snap-center flex-col overflow-hidden rounded-[2rem] p-6 transition-[border-color,box-shadow] duration-500 ease-out will-change-transform md:w-[32rem] lg:w-[36rem] lg:cursor-pointer ${
                  isActive
                    ? "border-[color:var(--accent-border)] shadow-[var(--surface-shadow-hover)]"
                    : "border-[color:var(--soft-border)]"
                } ${
                  !isDesktop && isActive ? "scale-[1.01]" : ""
                } hover:border-[color:var(--soft-border-strong)] hover:shadow-[var(--surface-shadow-hover)]`}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div
                  data-cursor-reactive-inner
                  className="flex h-full flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.012]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="theme-icon-panel rounded-2xl p-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="theme-pill rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em]">
                      Project {index + 1}
                    </span>
                  </div>

                  <h3 className="mt-8 text-balance text-2xl font-semibold tracking-[-0.03em] text-[color:var(--foreground-strong)] md:text-[1.95rem]">
                    {project.title}
                  </h3>

                  <p className="mt-5 text-base leading-8 text-[color:var(--foreground-soft)]">
                    {project.description}
                  </p>

                  <p className="theme-surface mt-6 rounded-3xl p-4 text-sm leading-7 text-[color:var(--muted)]">
                    {project.outcome}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="theme-pill rounded-full px-3 py-1 text-sm"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
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
                ? "w-10 bg-[color:var(--accent)]"
                : "w-2.5 bg-[color:var(--soft-border)] hover:bg-[color:var(--soft-border-strong)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
