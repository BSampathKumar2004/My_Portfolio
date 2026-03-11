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
      boxShadow: "0 32px 110px rgba(2, 8, 23, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
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
      boxShadow: "0 20px 60px rgba(2, 8, 23, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="glass-panel overflow-hidden rounded-[2rem] p-4 shadow-[0_20px_60px_rgba(2,8,23,0.32),inset_0_1px_0_rgba(255,255,255,0.04)] transition-[cursor] cursor-zoom-in will-change-transform sm:p-5"
      >
        <div
          data-architecture-image-shell
          className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/60 will-change-transform"
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
          className="mt-5 text-center text-sm leading-7 text-slate-300 sm:text-base"
        >
          <span className="font-medium text-white">System Flow:</span> Client
          {" "}&rarr; FastAPI &rarr; Kafka &rarr; Worker Services &rarr;
          {" "}PostgreSQL &rarr; AI Pipeline (OCR + LLM)
        </p>
      </div>
    </div>
  );
}
