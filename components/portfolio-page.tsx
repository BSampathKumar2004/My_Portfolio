"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
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
  Phone,
  ScrollText,
  Sparkles,
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
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-slate-700 border-t-sky-300" />
        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{label}</p>
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="glass-panel flex items-center gap-4 p-5"
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sky-100">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
        <p className="mt-2 text-sm text-slate-200 sm:text-base">{value}</p>
      </div>
    </motion.a>
  );
}

const lenisEasing = (t: number) => 1 - Math.pow(1 - t, 4);
const heroParticles = [
  { top: "14%", left: "8%", size: "h-2 w-2", speed: -22, opacity: "opacity-55" },
  { top: "26%", left: "24%", size: "h-1.5 w-1.5", speed: -14, opacity: "opacity-40" },
  { top: "18%", right: "12%", size: "h-2.5 w-2.5", speed: -18, opacity: "opacity-45" },
  { top: "42%", right: "28%", size: "h-1.5 w-1.5", speed: -12, opacity: "opacity-35" },
  { bottom: "22%", left: "14%", size: "h-2 w-2", speed: -16, opacity: "opacity-30" },
  { bottom: "16%", right: "8%", size: "h-2 w-2", speed: -24, opacity: "opacity-45" },
];

export function PortfolioPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const activeSectionRef = useRef("home");
  const [activeSection, setActiveSection] = useState("home");

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

    const handleLenisScroll = () => ScrollTrigger.update();

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
            { opacity: 0, y: 36, force3D: true },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top 86%",
                end: "top 64%",
                scrub: true,
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
            scrub: true,
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
              start: "top 88%",
              end: "top 38%",
              scrub: true,
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
            scrub: true,
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
              start: "top 90%",
              end: "top 68%",
              scrub: true,
            },
          },
        );
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
            end: pin ? "+=42%" : "bottom top",
            scrub: true,
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
            end: pin ? "+=52%" : "bottom 60%",
            scrub: true,
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

    const setActiveSectionIfNeeded = (sectionId: string) => {
      if (activeSectionRef.current === sectionId) {
        return;
      }

      activeSectionRef.current = sectionId;
      setActiveSection(sectionId);
    };

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
  }, [getPinnedOffset]);

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

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <div ref={rootRef} className="relative overflow-x-clip">
      <div
        data-parallax
        data-speed="-10"
        className="pointer-events-none absolute left-[-12rem] top-24 -z-10 h-80 w-80 rounded-full bg-sky-500/12 blur-[140px] will-change-transform"
      />
      <div
        data-parallax
        data-speed="12"
        className="pointer-events-none absolute right-[-12rem] top-[28rem] -z-10 h-[28rem] w-[28rem] rounded-full bg-cyan-400/8 blur-[160px] will-change-transform"
      />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.95),_rgba(2,6,23,1)),linear-gradient(180deg,_rgba(2,6,23,1)_0%,_rgba(2,6,23,0.98)_45%,_rgba(2,6,23,1)_100%)]" />

      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/10 bg-slate-950/70 px-4 py-3 shadow-[0_20px_80px_rgba(2,8,23,0.45)] backdrop-blur-xl sm:px-6">
          <a
            href="#home"
            onClick={(event) => handleNavClick(event, "home")}
            className="text-left"
          >
            <span className="block text-xs uppercase tracking-[0.28em] text-slate-500">
              Portfolio
            </span>
            <span className="text-sm font-medium text-slate-100 sm:text-base">
              Bandaru Sampath Kumar
            </span>
          </a>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(event) => handleNavClick(event, item.id)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  activeSection === item.id
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            onClick={(event) => handleNavClick(event, "contact")}
            className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-sm font-medium text-sky-100 transition-colors hover:bg-sky-300/15"
          >
            Contact
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-28 sm:px-8 lg:px-10">
        <section
          id="home"
          data-hero-section
          className="relative grid min-h-[92vh] items-center gap-14 overflow-hidden pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.78fr)]"
        >
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            {heroParticles.map((particle, index) => (
              <span
                key={`hero-particle-${index}`}
                data-hero-particle
                data-speed={particle.speed}
                className={`absolute rounded-full bg-sky-200/80 blur-[1px] ${particle.size} ${particle.opacity} will-change-transform`}
                style={{
                  top: particle.top,
                  left: particle.left,
                  right: particle.right,
                  bottom: particle.bottom,
                }}
              />
            ))}
          </div>

          <div data-hero-copy className="max-w-2xl will-change-transform">
            <div
              data-hero
              data-hero-badge
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300"
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-200" />
              Backend Engineer Portfolio
            </div>
            <h1
              data-hero
              data-hero-heading
              className="mt-8 text-5xl font-semibold tracking-tight text-white sm:text-6xl xl:text-7xl"
            >
              Bandaru Sampath Kumar
            </h1>
            <div data-hero data-hero-lead className="mt-6">
              <TypingRoles roles={heroRoles} />
            </div>
            <p
              data-hero
              data-hero-lead
              className="mt-3 text-lg text-slate-300 sm:text-xl"
            >
              FastAPI | Backend Systems | AI Pipelines
            </p>
            <p
              data-hero
              data-hero-summary
              className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg"
            >
              Python Backend Developer focused on building scalable backend
              systems, AI-powered document processing pipelines, and event-driven
              architectures using Kafka and PostgreSQL.
            </p>

            <div data-hero className="mt-10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => scrollToSection("projects")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-950 transition-transform hover:-translate-y-0.5"
              >
                View Projects
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="/Bandaru-Sampath-Kumar-Resume.pdf"
                download
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-6 py-3 text-sm font-medium text-slate-100 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
              >
                Download Resume
                <Download className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-6 py-3 text-sm font-medium text-sky-100 transition-colors hover:bg-sky-300/15"
              >
                Contact
                <Mail className="h-4 w-4" />
              </button>
            </div>

            <div
              data-hero
              data-hero-highlights
              className="mt-10 grid gap-3 sm:grid-cols-3"
            >
              {heroHighlights.map((highlight) => (
                <div key={highlight.label} className="glass-panel p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    {highlight.label}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-200">
                    {highlight.value}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="mt-12 inline-flex items-center gap-3 text-sm uppercase tracking-[0.26em] text-slate-400 transition-colors hover:text-white"
            >
              Scroll to explore
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
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
            className="mt-10 grid gap-4 sm:grid-cols-3"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="glass-panel p-6"
              >
                <p className="text-3xl font-semibold text-white sm:text-4xl">
                  {typeof stat.value === "number" ? (
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  ) : (
                    <span className="bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent">
                      {stat.valueText}
                    </span>
                  )}
                </p>
                <p className="mt-3 text-sm uppercase tracking-[0.24em] text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-4 text-sm leading-6 text-slate-300">
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
            <div data-depth="-4" className="mt-12">
              <TechClusterSection techItems={techStack} />
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

          <div className="mt-12">
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
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                System Architecture
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                A high-level architecture of a scalable backend system designed for
                AI-powered document processing and event-driven workflows.
              </p>
            </div>
            <div className="mt-12">
              <ArchitectureShowcase />
            </div>
          </div>
        </section>

        <section id="experience" className="section-space">
          <div
            data-story-shell
            className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.85fr)]"
          >
            <div data-reveal className="glass-panel p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Experience
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold text-white">
                    {experience.role}
                  </h2>
                  <p className="mt-3 text-lg text-slate-300">{experience.company}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200">
                  {experience.period}
                </span>
              </div>

              <div className="mt-8 space-y-4">
                {experience.responsibilities.map((item) => (
                  <div
                    data-detail-card
                    key={item}
                    className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                  >
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-300" />
                    <p className="text-sm leading-7 text-slate-300 sm:text-base">
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
            <div data-reveal className="glass-panel p-6 sm:p-8">
              <div className="flex items-center gap-3 text-sky-100">
                <UserRound className="h-5 w-5" />
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Education
                </p>
              </div>
              <div className="mt-6 space-y-4">
                {educationItems.map((item) => (
                  <div
                    data-detail-card
                    key={item.title}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-base font-semibold text-white sm:text-lg">
                        {item.title}
                      </h3>
                      <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-200">
                        {item.score}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                      {item.institution}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div data-reveal className="glass-panel p-6 sm:p-8">
              <div className="flex items-center gap-3 text-sky-100">
                <ScrollText className="h-5 w-5" />
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Certifications
                </p>
              </div>
              <div className="mt-6 space-y-4">
                {certifications.map((certificate) => (
                  <div
                    data-detail-card
                    key={certificate.title}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                  >
                    <h3 className="text-base font-semibold text-white">
                      {certificate.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">
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
            className="glass-panel overflow-hidden p-6 sm:p-8 lg:p-10"
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
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-950 transition-transform hover:-translate-y-0.5"
                  >
                    Download Resume
                    <Download className="h-4 w-4" />
                  </a>
                  <a
                    href="mailto:bandarusampath11@gmail.com"
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-sm font-medium text-slate-100 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
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
