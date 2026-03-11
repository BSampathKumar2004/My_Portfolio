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
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_24px_100px_rgba(2,8,23,0.38)] backdrop-blur-xl">
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
    </motion.div>
  );
}
