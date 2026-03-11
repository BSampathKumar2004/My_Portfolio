"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowRight,
  BriefcaseBusiness,
  Download,
  Mail,
  MoonStar,
  Phone,
  ScrollText,
  Sparkles,
  SunMedium,
  UserRound,
} from "lucide-react";
import {
  aboutStorySteps,
  backendFlowSteps,
  certifications,
  cinematicStatements,
  educationItems,
  experience,
  heroRoles,
  navItems,
  projects,
  stats,
  techStack,
} from "@/lib/portfolio-data";
import { AboutStorySection } from "@/components/about-story-section";
import { ArchitectureShowcase } from "@/components/architecture-showcase";
import { BackendFlowStory } from "@/components/backend-flow-story";
import { CinematicStatementSection } from "@/components/cinematic-statement-section";
import { CountUp } from "@/components/count-up";
import { GitHubActivityGraph } from "@/components/github-activity-graph";
import { HeroScene } from "@/components/hero-scene";
import { ProjectsShowcase } from "@/components/projects-showcase";
import { SectionHeading } from "@/components/section-heading";
import { TypingRoles } from "@/components/typing-roles";

const TechClusterSection = dynamic(
  () =>
    import("@/components/tech-cluster-section").then(
      (module) => module.TechClusterSection,
    ),
  {
    ssr: false,
    loading: () => <SceneFallback label="Preparing technology cluster" />,
  },
);

function SceneFallback({ label }: { label: string }) {
  return (
    <div className="glass-panel flex h-[420px] items-center justify-center sm:h-[520px]">
      <div className="space-y-3 text-center">
        <div
          className="mx-auto h-12 w-12 animate-spin rounded-full border-2"
          style={{
            borderColor: "var(--soft-border)",
            borderTopColor: "var(--accent)",
          }}
        />
        <p className="text-sm uppercase tracking-[0.28em] text-[color:var(--muted)]">
          {label}
        </p>
      </div>
    </div>
  );
}

function ContactCard({
  href,
  label,
  value,
  icon: Icon,
}: {
  href: string;
  label: string;
  value: string;
  icon: typeof Mail;
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="glass-panel flex items-center gap-4 p-5"
    >
      <div className="theme-icon-panel rounded-2xl p-3">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
          {label}
        </p>
        <p className="mt-2 text-sm text-[color:var(--foreground)] sm:text-base">
          {value}
        </p>
      </div>
    </motion.a>
  );
}

const lenisEasing = (t: number) => 1 - Math.pow(1 - t, 4);
const THEME_STORAGE_KEY = "portfolio-theme";
const heroParticles = [
  { top: "14%", left: "8%", size: "h-2 w-2", speed: -22, opacity: "opacity-55" },
  { top: "26%", left: "24%", size: "h-1.5 w-1.5", speed: -14, opacity: "opacity-40" },
  { top: "18%", right: "12%", size: "h-2.5 w-2.5", speed: -18, opacity: "opacity-45" },
  { top: "42%", right: "28%", size: "h-1.5 w-1.5", speed: -12, opacity: "opacity-35" },
  { bottom: "22%", left: "14%", size: "h-2 w-2", speed: -16, opacity: "opacity-30" },
  { bottom: "16%", right: "8%", size: "h-2 w-2", speed: -24, opacity: "opacity-45" },
];

type ThemeMode = "dark" | "light";

export function PortfolioPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const activeSectionRef = useRef("home");
  const [activeSection, setActiveSection] = useState("home");
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [isThemeReady, setIsThemeReady] = useState(false);

  const heroHighlights = useMemo(
    () => [
      { label: "FastAPI APIs", value: "Typed, scalable, async-first services" },
      { label: "Kafka Events", value: "Decoupled backend communication flows" },
      { label: "AI Pipelines", value: "OCR and LLM-backed extraction systems" },
    ],
    [],
  );
  const getPinnedOffset = useCallback(
    () => (headerRef.current?.getBoundingClientRect().height ?? 72) + 18,
    [],
  );
  const setActiveSectionIfNeeded = useCallback((sectionId: string) => {
    if (activeSectionRef.current === sectionId) {
      return;
    }

    activeSectionRef.current = sectionId;
    setActiveSection(sectionId);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (nextTheme: ThemeMode) => {
      root.dataset.theme = nextTheme;
      root.style.colorScheme = nextTheme;
      setTheme(nextTheme);
    };

    const initialTheme = root.dataset.theme === "light" ? "light" : "dark";
    applyTheme(initialTheme);
    setIsThemeReady(true);

    const handleSystemChange = (event: MediaQueryListEvent) => {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

      if (storedTheme === "light" || storedTheme === "dark") {
        return;
      }

      applyTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, []);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 3.5),
      smoothWheel: true,
      gestureOrientation: "vertical",
      syncTouch: false,
      touchMultiplier: 1,
      wheelMultiplier: 0.9,
      anchors: false,
    });

    lenisRef.current = lenis;

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    const progressTo = progressBarRef.current
      ? gsap.quickTo(progressBarRef.current, "scaleX", {
          duration: 0.18,
          ease: "power2.out",
        })
      : null;
    const opacityTo = progressBarRef.current
      ? gsap.quickTo(progressBarRef.current, "opacity", {
          duration: 0.2,
          ease: "power2.out",
        })
      : null;

    const handleLenisScroll = ({
      progress,
      scroll,
    }: {
      progress: number;
      scroll: number;
    }) => {
      const clampedProgress = Math.max(0, Math.min(1, progress));

      progressTo?.(clampedProgress);
      opacityTo?.(clampedProgress > 0.005 ? 1 : 0);

      if (scroll <= 24) {
        setActiveSectionIfNeeded("home");
      }

      ScrollTrigger.update();
    };

    lenis.on("scroll", handleLenisScroll);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const media = gsap.matchMedia();

    const context = gsap.context(() => {
      gsap.from("[data-hero]", {
        opacity: 0,
        y: 36,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.utils
        .toArray<HTMLElement>(
          "[data-reveal]:not([data-story-shell]):not([data-project-card]):not([data-projects-heading]):not([data-architecture-copy])",
        )
        .forEach((element) => {
          gsap.fromTo(
            element,
            { opacity: 0, y: 44, force3D: true },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                end: "top 60%",
                scrub: 0.85,
              },
            },
          );
        });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        gsap.to(element, {
          yPercent: Number(element.dataset.speed ?? 12),
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.9,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-story-shell]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0.26, y: 52, scale: 0.985, force3D: true },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              end: "top 34%",
              scrub: 0.95,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((element) => {
        gsap.to(element, {
          yPercent: Number(element.dataset.depth ?? -4),
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.95,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-detail-card]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0.3, y: 26, scale: 0.985, force3D: true },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top 92%",
              end: "top 64%",
              scrub: 0.8,
            },
          },
        );
      });

      media.add("(hover: hover) and (pointer: fine)", () => {
        const cleanups: Array<() => void> = [];

        gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((element) => {
          const strength = Number(element.dataset.magneticStrength ?? 0.14);
          const xTo = gsap.quickTo(element, "x", {
            duration: 0.45,
            ease: "power3.out",
          });
          const yTo = gsap.quickTo(element, "y", {
            duration: 0.45,
            ease: "power3.out",
          });
          const scaleTo = gsap.quickTo(element, "scale", {
            duration: 0.45,
            ease: "power3.out",
          });

          gsap.set(element, { force3D: true });

          const handleMove = (event: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const offsetX = event.clientX - (rect.left + rect.width / 2);
            const offsetY = event.clientY - (rect.top + rect.height / 2);

            xTo(offsetX * strength);
            yTo(offsetY * strength);
            scaleTo(1.015);
          };

          const handleLeave = () => {
            xTo(0);
            yTo(0);
            scaleTo(1);
          };

          element.addEventListener("mousemove", handleMove);
          element.addEventListener("mouseleave", handleLeave);

          cleanups.push(() => {
            element.removeEventListener("mousemove", handleMove);
            element.removeEventListener("mouseleave", handleLeave);
            gsap.set(element, { clearProps: "x,y,scale" });
          });
        });

        gsap.utils
          .toArray<HTMLElement>("[data-cursor-reactive]")
          .forEach((element) => {
            const inner =
              element.querySelector<HTMLElement>("[data-cursor-reactive-inner]") ??
              element;
            const intensity = Number(
              element.dataset.cursorReactiveIntensity ?? 1,
            );

            const rotateXTo = gsap.quickTo(element, "rotationX", {
              duration: 0.55,
              ease: "power3.out",
            });
            const rotateYTo = gsap.quickTo(element, "rotationY", {
              duration: 0.55,
              ease: "power3.out",
            });
            const innerXTo = gsap.quickTo(inner, "x", {
              duration: 0.55,
              ease: "power3.out",
            });
            const innerYTo = gsap.quickTo(inner, "y", {
              duration: 0.55,
              ease: "power3.out",
            });
            const innerScaleTo = gsap.quickTo(inner, "scale", {
              duration: 0.55,
              ease: "power3.out",
            });

            gsap.set(element, {
              transformPerspective: 1400,
              transformOrigin: "center center",
              force3D: true,
            });
            gsap.set(inner, { force3D: true });

            const handleMove = (event: MouseEvent) => {
              const rect = element.getBoundingClientRect();
              const normalizedX =
                ((event.clientX - rect.left) / rect.width - 0.5) * 2;
              const normalizedY =
                ((event.clientY - rect.top) / rect.height - 0.5) * 2;

              rotateYTo(normalizedX * 4 * intensity);
              rotateXTo(-normalizedY * 3.2 * intensity);
              innerXTo(normalizedX * 8 * intensity);
              innerYTo(normalizedY * 8 * intensity);
              innerScaleTo(1.01);
            };

            const handleLeave = () => {
              rotateXTo(0);
              rotateYTo(0);
              innerXTo(0);
              innerYTo(0);
              innerScaleTo(1);
            };

            element.addEventListener("mousemove", handleMove);
            element.addEventListener("mouseleave", handleLeave);

            cleanups.push(() => {
              element.removeEventListener("mousemove", handleMove);
              element.removeEventListener("mouseleave", handleLeave);
              gsap.set(element, {
                clearProps: "rotationX,rotationY,transformPerspective",
              });
              gsap.set(inner, { clearProps: "x,y,scale" });
            });
          });

        return () => {
          cleanups.forEach((cleanup) => cleanup());
        };
      });

      const heroSection = document.querySelector<HTMLElement>("[data-hero-section]");
      const heroBadge = document.querySelector<HTMLElement>("[data-hero-badge]");
      const heroHeading = document.querySelector<HTMLElement>("[data-hero-heading]");
      const heroLead = gsap.utils.toArray<HTMLElement>("[data-hero-lead]");
      const heroSummary = document.querySelector<HTMLElement>("[data-hero-summary]");
      const heroHighlightsGrid = document.querySelector<HTMLElement>(
        "[data-hero-highlights]",
      );
      const heroCopy = document.querySelector<HTMLElement>("[data-hero-copy]");
      const heroAvatar = document.querySelector<HTMLElement>("[data-hero-avatar]");
      const heroParticleElements =
        gsap.utils.toArray<HTMLElement>("[data-hero-particle]");

      const createHeroTimeline = (pin: boolean) => {
        if (!heroSection || !heroCopy || !heroAvatar) {
          return;
        }

        gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: pin ? "+=52%" : "bottom top",
            scrub: 0.9,
            pin,
            pinSpacing: pin,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
          .to(
            heroCopy,
            {
              yPercent: -12,
              opacity: 0.42,
              ease: "none",
              force3D: true,
            },
            0,
          )
          .to(
            heroBadge,
            {
              yPercent: -10,
              opacity: 0.65,
              ease: "none",
              force3D: true,
            },
            0,
          )
          .to(
            heroHeading,
            {
              scale: 0.965,
              yPercent: -8,
              transformOrigin: "left top",
              ease: "none",
              force3D: true,
            },
            0,
          )
          .to(
            heroLead,
            {
              yPercent: -12,
              opacity: 0.74,
              ease: "none",
              force3D: true,
            },
            0.03,
          )
          .to(
            heroSummary,
            {
              yPercent: -10,
              opacity: 0.56,
              ease: "none",
              force3D: true,
            },
            0.04,
          )
          .to(
            heroHighlightsGrid,
            {
              yPercent: -8,
              opacity: 0.78,
              ease: "none",
              force3D: true,
            },
            0.06,
          )
          .to(
            heroAvatar,
            {
              scale: 1.08,
              yPercent: -6,
              ease: "none",
              force3D: true,
            },
            0,
          )
          .to(
            heroParticleElements,
            {
              yPercent: (_, element) =>
                Number((element as HTMLElement).dataset.speed ?? -16),
              xPercent: (index) => (index % 2 === 0 ? -6 : 6),
              opacity: (_, element) =>
                Math.max(
                  0.16,
                  Number(window.getComputedStyle(element as HTMLElement).opacity) - 0.18,
                ),
              ease: "none",
              stagger: 0.02,
              force3D: true,
            },
            0,
          );
      };

      const architectureSection = document.querySelector<HTMLElement>(
        "[data-architecture-section]",
      );
      const architectureCopy = document.querySelector<HTMLElement>(
        "[data-architecture-copy]",
      );
      const architectureCard = document.querySelector<HTMLElement>(
        "[data-architecture-card]",
      );
      const architectureImage = document.querySelector<HTMLElement>(
        "[data-architecture-image-shell]",
      );
      const architectureCaption = document.querySelector<HTMLElement>(
        "[data-architecture-caption]",
      );

      const createArchitectureTimeline = (pin: boolean) => {
        if (
          !architectureSection ||
          !architectureCopy ||
          !architectureCard ||
          !architectureImage ||
          !architectureCaption
        ) {
          return;
        }

        gsap.timeline({
          scrollTrigger: {
            trigger: architectureSection,
            start: pin ? () => `top top+=${getPinnedOffset()}` : "top 78%",
            end: pin ? "+=58%" : "bottom 60%",
            scrub: 0.9,
            pin,
            pinSpacing: pin,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
          .fromTo(
            architectureCopy,
            { opacity: 0.18, y: 28, force3D: true },
            { opacity: 1, y: 0, ease: "none" },
            0,
          )
          .fromTo(
            architectureCard,
            { opacity: 0.28 },
            { opacity: 1, ease: "none" },
            0.02,
          )
          .to(
            architectureImage,
            {
              scale: 1.045,
              yPercent: -3,
              ease: "none",
              force3D: true,
            },
            0.08,
          )
          .fromTo(
            architectureCaption,
            { opacity: 0.3, y: 18, force3D: true },
            { opacity: 1, y: 0, ease: "none" },
            0.18,
          );
      };

      media.add("(min-width: 1024px)", () => {
        createHeroTimeline(true);
        createArchitectureTimeline(true);
      });

      media.add("(max-width: 1023px)", () => {
        createHeroTimeline(false);
        createArchitectureTimeline(false);
      });
    }, rootRef);

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section[id]"),
    );
    const sectionTriggers = sections.map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: () => setActiveSectionIfNeeded(section.id),
        onEnterBack: () => setActiveSectionIfNeeded(section.id),
      }),
    );

    const handleWindowLoad = () => ScrollTrigger.refresh();

    window.addEventListener("load", handleWindowLoad);
    requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });

    return () => {
      sectionTriggers.forEach((trigger) => trigger.kill());
      media.revert();
      context.revert();
      window.removeEventListener("load", handleWindowLoad);
      lenis.off("scroll", handleLenisScroll);
      lenis.destroy();
      gsap.ticker.remove(tick);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [getPinnedOffset, setActiveSectionIfNeeded]);

  const getScrollOffset = () => {
    const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 0;

    return -(headerHeight + 18);
  };

  const getScrollDuration = (targetId: string) => {
    if (typeof window === "undefined") {
      return 1.35;
    }

    const target = document.getElementById(targetId);

    if (!target) {
      return 1.35;
    }

    const headerOffset = Math.abs(getScrollOffset());
    const targetTop =
      window.scrollY + target.getBoundingClientRect().top - headerOffset;
    const distance = Math.abs(targetTop - window.scrollY);

    return Math.max(1.12, Math.min(1.55, 1.08 + Math.sqrt(distance) / 72));
  };

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);

    if (!target || !lenisRef.current) {
      return;
    }

    lenisRef.current?.scrollTo(`#${id}`, {
      lock: true,
      offset: getScrollOffset(),
      duration: getScrollDuration(id),
      easing: lenisEasing,
    });
  };

  const handleNavClick = (event: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    scrollToSection(id);
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  };

  return (
    <div ref={rootRef} className="relative overflow-x-clip">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px]">
        <div className="theme-progress-track absolute inset-0" />
        <div
          ref={progressBarRef}
          className="theme-progress-bar absolute inset-y-0 left-0 origin-left opacity-0"
          style={{ width: "100%", transform: "scaleX(0)" }}
        />
      </div>

      <div
        data-parallax
        data-speed="-10"
        className="pointer-events-none absolute left-[-12rem] top-24 -z-10 h-80 w-80 rounded-full blur-[140px] will-change-transform"
        style={{ backgroundColor: "var(--glow-primary)" }}
      />
      <div
        data-parallax
        data-speed="12"
        className="pointer-events-none absolute right-[-12rem] top-[28rem] -z-10 h-[28rem] w-[28rem] rounded-full blur-[160px] will-change-transform"
        style={{ backgroundColor: "var(--glow-secondary)" }}
      />
      <div className="theme-page-backdrop pointer-events-none absolute inset-0 -z-20" />

      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
        <div className="theme-header mx-auto mt-4 flex max-w-7xl items-center justify-between gap-4 rounded-full px-4 py-3 backdrop-blur-xl sm:px-6">
          <a
            href="#home"
            onClick={(event) => handleNavClick(event, "home")}
            className="text-left"
          >
            <span className="block text-xs uppercase tracking-[0.28em] text-[color:var(--muted)]">
              Portfolio
            </span>
            <span className="text-sm font-medium text-[color:var(--foreground-strong)] sm:text-base">
              Bandaru Sampath Kumar
            </span>
          </a>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                onClick={(event) => handleNavClick(event, item.id)}
                className={`theme-nav-chip relative rounded-full px-4 py-2 text-sm ${
                  activeSection === item.id
                    ? "theme-nav-chip-active"
                    : "theme-nav-chip-idle"
                }`}
              >
                {activeSection === item.id ? (
                  <motion.span
                    layoutId="active-nav-chip"
                    className="absolute inset-0 -z-10 rounded-full bg-[color:var(--soft-surface-strong)]"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 34,
                      mass: 0.72,
                    }}
                  />
                ) : null}
                {item.label}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="interactive-button theme-button-secondary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isThemeReady && theme === "light" ? (
                <SunMedium className="h-4 w-4" />
              ) : (
                <MoonStar className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {isThemeReady ? (theme === "light" ? "Light" : "Dark") : "Theme"}
              </span>
            </button>

            <a
              href="#contact"
              onClick={(event) => handleNavClick(event, "contact")}
              data-magnetic
              data-magnetic-strength="0.12"
              className="interactive-button theme-button-accent inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            >
              Contact
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-28 pt-32 sm:px-8 lg:px-10">
        <section
          id="home"
          data-hero-section
          className="relative grid min-h-[94vh] items-center gap-16 overflow-hidden pt-14 lg:gap-20 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.78fr)]"
        >
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            {heroParticles.map((particle, index) => (
              <span
                key={`hero-particle-${index}`}
                data-hero-particle
                data-speed={particle.speed}
                className={`absolute rounded-full blur-[1px] ${particle.size} ${particle.opacity} will-change-transform`}
                style={{
                  top: particle.top,
                  left: particle.left,
                  right: particle.right,
                  bottom: particle.bottom,
                  backgroundColor: "var(--hero-particle)",
                }}
              />
            ))}
          </div>

          <div data-hero-copy className="max-w-2xl will-change-transform lg:pr-4">
            <div
              data-hero
              data-hero-badge
              className="theme-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em]"
            >
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--accent)]" />
              Backend Engineer Portfolio
            </div>
            <h1
              data-hero
              data-hero-heading
              className="mt-8 text-balance text-5xl font-semibold tracking-[-0.045em] text-[color:var(--foreground-strong)] sm:text-6xl xl:text-[5.25rem] xl:leading-[0.94]"
            >
              Bandaru Sampath Kumar
            </h1>
            <div data-hero data-hero-lead className="mt-6">
              <TypingRoles roles={heroRoles} />
            </div>
            <p
              data-hero
              data-hero-lead
              className="mt-3 text-lg text-[color:var(--foreground-soft)] sm:text-xl"
            >
              FastAPI | Backend Systems | AI Pipelines
            </p>
            <p
              data-hero
              data-hero-summary
              className="mt-8 max-w-lg text-base leading-8 text-[color:var(--foreground-soft)] sm:text-lg"
            >
              Python Backend Developer focused on building scalable backend
              systems, AI-powered document processing pipelines, and event-driven
              architectures using Kafka and PostgreSQL.
            </p>

            <div data-hero className="mt-10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => scrollToSection("projects")}
                data-magnetic
                data-magnetic-strength="0.16"
                className="interactive-button theme-button-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
              >
                View Projects
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="/Bandaru-Sampath-Kumar-Resume.pdf"
                download
                data-magnetic
                data-magnetic-strength="0.14"
                className="interactive-button theme-button-secondary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
              >
                Download Resume
                <Download className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                data-magnetic
                data-magnetic-strength="0.16"
                className="interactive-button theme-button-accent inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
              >
                Contact
                <Mail className="h-4 w-4" />
              </button>
            </div>

            <div
              data-hero
              data-hero-highlights
              className="mt-12 grid gap-4 sm:grid-cols-3"
            >
              {heroHighlights.map((highlight) => (
                <div key={highlight.label} className="glass-panel interactive-lift p-4 sm:p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                    {highlight.label}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--foreground)]">
                    {highlight.value}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="mt-14 inline-flex items-center gap-3 text-sm uppercase tracking-[0.26em] text-[color:var(--muted)] transition-colors hover:text-[color:var(--foreground-strong)]"
            >
              Scroll to explore
              <span className="theme-pill flex h-9 w-9 items-center justify-center rounded-full">
                <ArrowRight className="h-4 w-4 rotate-90" />
              </span>
            </button>
          </div>

          <div
            data-hero
            data-hero-avatar
            className="will-change-transform lg:justify-self-end"
          >
            <HeroScene />
          </div>
        </section>

        <section id="about" className="section-space">
          <AboutStorySection
            getPinnedOffset={getPinnedOffset}
            steps={aboutStorySteps}
          />

          <div
            data-reveal
            data-story-shell
            className="mt-14 grid gap-5 sm:grid-cols-3"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="glass-panel p-6 sm:p-7"
              >
                <p className="text-3xl font-semibold text-[color:var(--foreground-strong)] sm:text-4xl">
                  {typeof stat.value === "number" ? (
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  ) : (
                    <span className="theme-accent-gradient">
                      {stat.valueText}
                    </span>
                  )}
                </p>
                <p className="mt-3 text-sm uppercase tracking-[0.24em] text-[color:var(--muted)]">
                  {stat.label}
                </p>
                <p className="mt-4 text-sm leading-6 text-[color:var(--foreground-soft)]">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <CinematicStatementSection statement={cinematicStatements[0]} />

        <section id="stack" className="section-space">
          <div data-reveal data-story-shell>
            <SectionHeading
              eyebrow="Tech Stack"
              title="An interactive backend toolkit centered around services, data, and automation."
              description="The stack below reflects the systems I use to design APIs, process documents, stream events, and operate backend workloads."
            />
            <div data-depth="-4" className="mt-14">
              <TechClusterSection techItems={techStack} theme={theme} />
            </div>
          </div>
        </section>

        <BackendFlowStory
          getPinnedOffset={getPinnedOffset}
          steps={backendFlowSteps}
        />

        <section id="projects" className="section-space">
          <div data-reveal>
            <SectionHeading
              eyebrow="Projects"
              title="Backend projects focused on real workflows, automation, and operations."
              description="Each project emphasizes API clarity, dependable data handling, and maintainable backend delivery rather than surface-level polish."
            />
          </div>

          <div className="mt-14">
            <ProjectsShowcase
              getPinnedOffset={getPinnedOffset}
              lenisRef={lenisRef}
              projects={projects}
            />
          </div>
        </section>

        <CinematicStatementSection statement={cinematicStatements[1]} />

        <section id="architecture" data-architecture-section className="section-space">
          <div>
            <div
              data-architecture-copy
              data-reveal
              className="mx-auto max-w-4xl text-center will-change-transform"
            >
              <h2 className="text-balance text-4xl font-semibold tracking-[-0.035em] text-[color:var(--foreground-strong)] sm:text-5xl lg:text-[4.1rem] lg:leading-[0.98]">
                System Architecture
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-8 text-[color:var(--foreground-soft)] sm:text-lg">
                A high-level architecture of a scalable backend system designed for
                AI-powered document processing and event-driven workflows.
              </p>
            </div>
            <div className="mt-14">
              <ArchitectureShowcase />
            </div>
          </div>
        </section>

        <section id="experience" className="section-space">
          <div
            data-story-shell
            className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.85fr)]"
          >
            <div data-reveal className="glass-panel p-7 sm:p-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                    Experience
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold text-[color:var(--foreground-strong)]">
                    {experience.role}
                  </h2>
                  <p className="mt-3 text-lg text-[color:var(--foreground-soft)]">
                    {experience.company}
                  </p>
                </div>
                <span className="theme-pill rounded-full px-4 py-2 text-sm">
                  {experience.period}
                </span>
              </div>

              <div className="mt-8 space-y-4">
                {experience.responsibilities.map((item) => (
                  <div
                    data-detail-card
                    key={item}
                    className="theme-surface flex items-start gap-4 rounded-2xl p-4"
                  >
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" />
                    <p className="text-sm leading-7 text-[color:var(--foreground-soft)] sm:text-base">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div data-reveal data-depth="-3" className="space-y-6">
              <GitHubActivityGraph />
            </div>
          </div>
        </section>

        <section id="education" className="section-space">
          <div data-story-shell className="grid gap-6 lg:grid-cols-2">
            <div data-reveal className="glass-panel p-7 sm:p-9">
              <div className="flex items-center gap-3 text-[color:var(--accent-text)]">
                <UserRound className="h-5 w-5" />
                <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                  Education
                </p>
              </div>
              <div className="mt-6 space-y-4">
                {educationItems.map((item) => (
                  <div
                    data-detail-card
                    key={item.title}
                    className="theme-surface rounded-2xl p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-base font-semibold text-[color:var(--foreground-strong)] sm:text-lg">
                        {item.title}
                      </h3>
                      <span className="theme-pill rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em]">
                        {item.score}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--foreground-soft)] sm:text-base">
                      {item.institution}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div data-reveal className="glass-panel p-7 sm:p-9">
              <div className="flex items-center gap-3 text-[color:var(--accent-text)]">
                <ScrollText className="h-5 w-5" />
                <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)]">
                  Certifications
                </p>
              </div>
              <div className="mt-6 space-y-4">
                {certifications.map((certificate) => (
                  <div
                    data-detail-card
                    key={certificate.title}
                    className="theme-surface rounded-2xl p-4"
                  >
                    <h3 className="text-base font-semibold text-[color:var(--foreground-strong)]">
                      {certificate.title}
                    </h3>
                    <p className="mt-2 text-sm text-[color:var(--foreground-soft)]">
                      {certificate.issuer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section-space pb-8">
          <div
            data-reveal
            data-story-shell
            className="glass-panel overflow-hidden p-7 sm:p-9 lg:p-11"
          >
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1fr)]">
              <div>
                <SectionHeading
                  eyebrow="Contact"
                  title="Available for backend engineering roles and product-focused collaborations."
                  description="If you need a backend engineer who cares about system design, maintainable APIs, and AI-enabled workflows, this portfolio is built to start that conversation."
                />

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="/Bandaru-Sampath-Kumar-Resume.pdf"
                    download
                    data-magnetic
                    data-magnetic-strength="0.14"
                    className="interactive-button theme-button-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
                  >
                    Download Resume
                    <Download className="h-4 w-4" />
                  </a>
                  <a
                    href="mailto:bandarusampath11@gmail.com"
                    data-magnetic
                    data-magnetic-strength="0.14"
                    className="interactive-button theme-button-secondary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
                  >
                    Email Me
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="grid gap-4">
                <ContactCard
                  href="tel:9290797555"
                  label="Phone"
                  value="9290797555"
                  icon={Phone}
                />
                <ContactCard
                  href="mailto:bandarusampath11@gmail.com"
                  label="Email"
                  value="bandarusampath11@gmail.com"
                  icon={Mail}
                />
                <ContactCard
                  href="https://linkedin.com/in/bandaru-sampath-kumar-280297310/"
                  label="LinkedIn"
                  value="linkedin.com/in/bandaru-sampath-kumar-280297310/"
                  icon={BriefcaseBusiness}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
