export type NavItem = {
  id: string;
  label: string;
};

export type StatItem = {
  label: string;
  description: string;
  value?: number;
  suffix?: string;
  valueText?: string;
};

export type TechItem = {
  name: string;
  category: string;
  description: string;
  detail: string;
  color: string;
};

export type ProjectItem = {
  title: string;
  description: string;
  outcome: string;
  technologies: string[];
};

export type CertificationItem = {
  title: string;
  issuer: string;
};

export type EducationItem = {
  title: string;
  institution: string;
  score: string;
};

export type AboutStoryStep = {
  title: string;
  body: string;
};

export type CinematicStatement = {
  eyebrow: string;
  title: string;
  description: string;
};

export type BackendFlowStep = {
  title: string;
  description: string;
};

export const navItems: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "stack", label: "Tech Stack" },
  { id: "projects", label: "Projects" },
  { id: "architecture", label: "Architecture" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export const heroRoles = [
  "Python Backend Developer",
  "FastAPI Backend Engineer",
  "AI Pipeline Builder",
];

export const stats: StatItem[] = [
  {
    value: 1,
    suffix: "+",
    label: "Years Experience",
    description: "Building backend systems and production-ready APIs.",
  },
  {
    value: 3,
    suffix: "+",
    label: "Backend Projects",
    description: "Delivered backend products across automation and operations.",
  },
  {
    valueText: "AI",
    label: "Document Pipelines",
    description: "OCR and LLM workflows for structured document extraction.",
  },
];

export const aboutStorySteps: AboutStoryStep[] = [
  {
    title: "Python Backend Developer",
    body: "FastAPI | Backend Systems | AI Pipelines",
  },
  {
    title: "Scalable Backend Systems",
    body: "I build scalable backend systems and high-performance APIs using Python and FastAPI.",
  },
  {
    title: "AI Document Processing",
    body: "My work focuses on AI-powered document processing pipelines, OCR integration, and LLM-driven automation.",
  },
  {
    title: "Event-Driven Architectures",
    body: "I design event-driven backend architectures using Kafka, PostgreSQL, and distributed processing systems.",
  },
];

export const cinematicStatements: CinematicStatement[] = [
  {
    eyebrow: "What I Build",
    title: "Backend systems that stay clear under scale.",
    description:
      "FastAPI services, event-driven workers, and AI-backed document flows designed to stay readable as product complexity grows.",
  },
  {
    eyebrow: "Architecture Thinking",
    title: "Good backend architecture makes the next decision easier.",
    description:
      "I focus on explicit contracts, resilient data flow, and services that remain simple to reason about in production.",
  },
];

export const backendFlowSteps: BackendFlowStep[] = [
  {
    title: "Client",
    description: "Requests begin from product surfaces, dashboards, and document upload workflows.",
  },
  {
    title: "FastAPI API Layer",
    description: "Typed endpoints validate requests, coordinate services, and hand off long-running work cleanly.",
  },
  {
    title: "Kafka Event Stream",
    description: "Events decouple ingestion from downstream processing so the system can scale asynchronously.",
  },
  {
    title: "Worker Services",
    description: "Background workers transform files, trigger extraction steps, and manage task orchestration.",
  },
  {
    title: "PostgreSQL Database",
    description: "Structured records, audit trails, and workflow state remain queryable and reliable.",
  },
  {
    title: "AI Processing Pipeline",
    description: "OCR and LLM stages turn unstructured documents into validated application-ready data.",
  },
];

export const techStack: TechItem[] = [
  {
    name: "Python",
    category: "Core Language",
    description: "Primary language for backend services, automation, and data workflows.",
    detail: "Used for clean service layers, integrations, and maintainable business logic.",
    color: "#5c8dff",
  },
  {
    name: "FastAPI",
    category: "API Framework",
    description: "Designing high-performance APIs with async patterns and typed contracts.",
    detail: "Used for REST APIs, background processing hooks, and service composition.",
    color: "#2dd4bf",
  },
  {
    name: "Java",
    category: "Ecosystem",
    description: "Supporting cross-stack backend understanding and system interoperability.",
    detail: "Useful when services or integrations span multiple backend runtimes.",
    color: "#f59e0b",
  },
  {
    name: "PostgreSQL",
    category: "Relational Data",
    description: "Schema design, query planning, and transactional data storage.",
    detail: "Used for reliable data models, operational reporting, and core business data.",
    color: "#60a5fa",
  },
  {
    name: "MongoDB",
    category: "Document Data",
    description: "Flexible storage for semi-structured or rapidly evolving data models.",
    detail: "Used where document-oriented storage improves delivery speed and flexibility.",
    color: "#4ade80",
  },
  {
    name: "Kafka",
    category: "Event Streaming",
    description: "Building event-driven flows and decoupled backend pipelines.",
    detail: "Supports scalable asynchronous processing across API and worker boundaries.",
    color: "#f87171",
  },
  {
    name: "Docker",
    category: "Containers",
    description: "Containerized development and deployment for backend consistency.",
    detail: "Used to standardize services across local, staging, and production environments.",
    color: "#38bdf8",
  },
  {
    name: "PaddleOCR",
    category: "OCR Engine",
    description: "Document text extraction for AI-assisted automation workflows.",
    detail: "Powers OCR-first document pipelines before downstream validation or LLM parsing.",
    color: "#a78bfa",
  },
  {
    name: "LLM Integration",
    category: "AI Systems",
    description: "Structuring extracted content into usable, validated application data.",
    detail: "Applied for entity extraction, summarization, and schema-guided response handling.",
    color: "#f472b6",
  },
  {
    name: "Git",
    category: "Version Control",
    description: "Collaborative workflows, branching strategy, and controlled iteration.",
    detail: "Supports traceable delivery and safer backend release management.",
    color: "#fb7185",
  },
  {
    name: "Linux",
    category: "Runtime Environment",
    description: "Comfortable operating backend services and tooling in Linux environments.",
    detail: "Used for deployment operations, debugging, and backend infrastructure tasks.",
    color: "#facc15",
  },
];

export const projects: ProjectItem[] = [
  {
    title: "AI Document Processing Pipeline",
    description:
      "Backend services for OCR-based document processing using PaddleOCR and LLM pipelines for structured data extraction.",
    outcome:
      "Designed a reliable backend flow that converts unstructured files into validated, application-ready records.",
    technologies: ["Python", "FastAPI", "PaddleOCR", "LLM Integration"],
  },
  {
    title: "YouTube Live Streaming Backend System",
    description:
      "Backend APIs for managing YouTube live streams, scheduling, chat integration, and automated thumbnail generation.",
    outcome:
      "Centralized stream operations into service-driven APIs for scheduling, moderation, and media automation.",
    technologies: ["FastAPI", "YouTube API", "MoviePy"],
  },
  {
    title: "Hall Booking Management System",
    description:
      "REST API backend for hall reservation management with database schema design and Docker containerization.",
    outcome:
      "Created a structured reservation backend with maintainable schemas and reproducible containerized setup.",
    technologies: ["Python", "FastAPI", "PostgreSQL", "MongoDB", "Docker"],
  },
];

export const experience = {
  role: "Backend Developer",
  company: "CRIATIVO Software Solutions Pvt Ltd",
  period: "Feb 2025 - Present",
  responsibilities: [
    "Developing backend systems using Python and FastAPI.",
    "Designing scalable REST APIs for internal and client-facing products.",
    "Architecting PostgreSQL database schemas with maintainable query flows.",
    "Implementing Kafka-based event-driven services and asynchronous workers.",
    "Building AI document processing pipelines using OCR and LLM integrations.",
  ],
};

export const educationItems: EducationItem[] = [
  {
    title: "B.Tech Computer Science",
    institution: "CT University",
    score: "CGPA 7.4",
  },
  {
    title: "Intermediate (MPC)",
    institution: "Pragathi Inter College, Kakinada",
    score: "85%",
  },
  {
    title: "SSC",
    institution: "Sama School, Kakinada",
    score: "CGPA 9.2",
  },
];

export const certifications: CertificationItem[] = [
  {
    title: "Machine Learning & Deep Learning",
    issuer: "IBM SkillBuild",
  },
  {
    title: "Web Development",
    issuer: "Internshala",
  },
];
