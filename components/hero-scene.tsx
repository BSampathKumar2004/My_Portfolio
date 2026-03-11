"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function HeroScene() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="mx-auto w-full max-w-[460px]"
    >
      <div
        data-cursor-reactive
        data-cursor-reactive-intensity="0.65"
        className="overflow-hidden rounded-[2rem] border border-[color:var(--soft-border)] bg-[color:var(--panel)] shadow-[var(--surface-shadow)] backdrop-blur-xl will-change-transform"
      >
        <div data-cursor-reactive-inner className="will-change-transform">
          <Image
            src="/GalaxyAvatar_20260311_100650.jpg"
            alt="Bandaru Sampath Kumar avatar"
            width={1080}
            height={1080}
            priority
            sizes="(min-width: 1024px) 460px, (min-width: 640px) 420px, 88vw"
            className="h-auto w-full object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
}
