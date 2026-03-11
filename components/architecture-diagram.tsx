"use client";

import { motion } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  Database,
  Layers3,
  ServerCog,
  Workflow,
} from "lucide-react";

const architectureSteps = [
  {
    title: "Client",
    subtitle: "Web and service consumers",
    icon: Layers3,
  },
  {
    title: "FastAPI API Layer",
    subtitle: "Typed endpoints, validation, auth, orchestration",
    icon: ServerCog,
  },
  {
    title: "Kafka Event Stream",
    subtitle: "Async delivery for resilient backend communication",
    icon: Workflow,
  },
  {
    title: "Worker Services",
    subtitle: "Background jobs, processing, and service execution",
    icon: Bot,
  },
  {
    title: "PostgreSQL Database",
    subtitle: "Core relational data and transactional state",
    icon: Database,
  },
  {
    title: "AI Pipeline",
    subtitle: "OCR + LLM extraction for document intelligence",
    icon: BrainCircuit,
  },
];

export function ArchitectureDiagram() {
  return (
    <div className="glass-panel relative overflow-hidden p-6 sm:p-8">
      <div className="absolute inset-x-1/2 top-12 hidden h-[calc(100%-6rem)] w-px -translate-x-1/2 bg-white/10 md:block" />
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-12 hidden h-4 w-4 -translate-x-1/2 rounded-full bg-sky-300/90 shadow-[0_0_30px_rgba(125,211,252,0.65)] md:block"
        animate={{ y: [0, 540, 0] }}
        transition={{ duration: 8, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="space-y-6">
        {architectureSteps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div key={step.title} className="relative md:min-h-28">
              <div
                className={`relative flex ${
                  index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                }`}
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="relative w-full rounded-3xl border border-white/10 bg-slate-950/75 p-5 shadow-[0_24px_80px_rgba(3,7,18,0.4)] backdrop-blur-xl md:w-[calc(50%-2rem)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl border border-sky-300/20 bg-sky-300/10 p-3 text-sky-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {index < architectureSteps.length - 1 ? (
                <div className="relative mx-auto mt-4 flex h-8 w-8 items-center justify-center md:hidden">
                  <div className="h-full w-px bg-white/12" />
                  <motion.div
                    aria-hidden
                    className="absolute h-3 w-3 rounded-full bg-sky-300/90"
                    animate={{ y: [-12, 12, -12] }}
                    transition={{ duration: 2, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
