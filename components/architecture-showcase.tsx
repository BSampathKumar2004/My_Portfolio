"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";

export function ArchitectureShowcase() {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!cardRef.current || !imageRef.current) {
      return;
    }

    gsap.to(cardRef.current, {
      boxShadow: "var(--surface-shadow-hover)",
      y: -4,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(imageRef.current, {
      scale: 1.025,
      duration: 0.55,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !imageRef.current) {
      return;
    }

    gsap.to(cardRef.current, {
      boxShadow: "var(--surface-shadow)",
      y: 0,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.55,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div
        ref={cardRef}
        data-architecture-card
        data-cursor-reactive
        data-cursor-reactive-intensity="0.55"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="glass-panel overflow-hidden rounded-[2rem] p-4 shadow-[var(--surface-shadow)] transition-[box-shadow,transform,cursor] duration-500 cursor-zoom-in will-change-transform sm:p-5"
      >
        <div
          data-architecture-image-shell
          data-cursor-reactive-inner
          className="theme-surface overflow-hidden rounded-[1.5rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] will-change-transform"
        >
          <div
            ref={imageRef}
            data-architecture-hover-image
            className="origin-center will-change-transform"
          >
            <Image
              src="/Archicture.png"
              alt="System architecture for AI-powered document processing backend"
              width={1536}
              height={1024}
              sizes="(min-width: 1280px) 960px, (min-width: 768px) 90vw, 100vw"
              className="h-auto w-full object-contain"
              priority={false}
            />
          </div>
        </div>

        <p
          data-architecture-caption
          className="mt-5 text-center text-sm leading-7 text-[color:var(--foreground-soft)] sm:text-base"
        >
          <span className="font-medium text-[color:var(--foreground-strong)]">System Flow:</span> Client
          {" "}&rarr; FastAPI &rarr; Kafka &rarr; Worker Services &rarr;
          {" "}PostgreSQL &rarr; AI Pipeline (OCR + LLM)
        </p>
      </div>
    </div>
  );
}
