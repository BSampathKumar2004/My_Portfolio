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
  repositoryUrl?: string;
  repositoryLabel?: string;
  projectUrl?: string;
  projectLabel?: string;
  architectureTitle: string;
  architectureDescription: string;
  architectureFlow: string[];
};

export type CertificationItem = {
  title: string;
  issuer: string;
  certificateUrl?: string;
};

export type EducationItem = {
  title: string;
  institution: string;
  score: string;
  proofUrl?: string;
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
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  // { id: "contact", label: "Contact" },
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
    value: 5,
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
      "A scalable FastAPI backend system that processes uploaded documents with OCR and LLM pipelines to extract clean structured data.",
    outcome:
      "Built to turn unstructured documents into validated records without blocking the API layer, using asynchronous workers and durable data storage.",
    technologies: ["Python", "FastAPI", "PaddleOCR", "LLM", "PostgreSQL"],
    repositoryUrl:"https://github.com/BSampathKumar2004",
    repositoryLabel: "GitHub Repository",
    architectureTitle: "Asynchronous document extraction pipeline",
    architectureDescription:
      "Uploads enter through FastAPI, are validated and published to Kafka, then background workers run OCR and LLM extraction before writing structured output into PostgreSQL.",
    architectureFlow: [
      "Document Upload",
      "FastAPI API Layer",
      "Kafka Event Queue",
      "OCR Worker",
      "LLM Extraction Worker",
      "PostgreSQL Storage",
    ],
  },
  {
    title: "OMR Sheet Evaluation System",
    description:
      "Developed a backend system that analyzes scanned OMR sheets and extracts selected answers using computer vision techniques.",
    outcome:
      "Computer vision backend system that detects and evaluates OMR answer sheets automatically using predefined bubble coordinates and image processing techniques.",
    technologies: ["Python", "FastAPI", "OpenCV", "NumPy", "Image Processing"],
    repositoryUrl: "https://github.com/BSampathKumar2004/OMR_Evalution.git",
    repositoryLabel: "GitHub Repository",
    architectureTitle: "OMR image processing and answer evaluation pipeline",
    architectureDescription:
      "Uploaded OMR sheet images move through preprocessing and alignment, then predefined bubble coordinates and pixel-intensity analysis are used to detect marked answers, compare them against an answer key, and generate a final score reliably even with mild alignment or lighting variation.",
    architectureFlow: [
      "Upload OMR Sheet Image",
      "Image Preprocessing and Alignment",
      "Bubble Detection Using Predefined Coordinates",
      "Filled Bubble Detection via Pixel Intensity Analysis",
      "Answer Extraction and Answer Key Comparison",
      "Score Calculation and Result Generation",
    ],
  },
  {
    title: "AI Interview Automation System",
    description:
      "Developed an automated technical interview backend system that dynamically generates interview questions and evaluates candidate responses using large language models.",
    outcome:
      "AI-powered backend system that generates interview questions, converts them into audio, evaluates candidate answers, and produces automated interview reports.",
    technologies: [
      "Python",
      "FastAPI",
      "Kafka",
      "LLM Integration",
      "Text-to-Speech",
      "Event-driven Architecture",
    ],
    repositoryUrl: "https://github.com/BSampathKumar2004",
    repositoryLabel: "GitHub Repository",
    architectureTitle: "Event-driven AI interview orchestration pipeline",
    architectureDescription:
      "Interview configuration is collected in the frontend and published into Kafka, where backend services consume events to generate questions with an LLM, convert prompts to audio, collect candidate responses, evaluate answers, calculate scores, and return a detailed interview report.",
    architectureFlow: [
      "Frontend Collects Interview Configuration",
      "Configuration Sent to Backend",
      "Data Published to Kafka Event Stream",
      "Backend Service Consumes Event",
      "LLM Generates Interview Questions",
      "Questions Converted to Audio Using Text-to-Speech",
      "Candidate Responses Collected from Frontend",
      "LLM Evaluates Answers",
      "Score Calculated and Report Generated",
      "Interview Report Returned to Frontend",
    ],
  },
  {
    title: "YouTube Live Streaming Backend System",
    description:
      "Backend APIs for managing YouTube live streams, scheduling sessions, chat integration, and automated thumbnail generation.",
    outcome:
      "Centralized live-stream operations into service-driven APIs so scheduling, moderation, and media automation stay consistent across the workflow.",
    technologies: ["FastAPI", "YouTube API", "MoviePy"],
    repositoryUrl: "https://github.com/BSampathKumar2004/YouTube_LiveStream",
    repositoryLabel: "GitHub Repository",
    architectureTitle: "Streaming operations orchestration backend",
    architectureDescription:
      "A FastAPI control layer coordinates stream scheduling, YouTube API integration, chat handling, and media-generation workers so live operations stay organized behind a single backend surface.",
    architectureFlow: [
      "Admin Dashboard",
      "FastAPI Control API",
      "YouTube Integration Service",
      "Chat / Scheduling Workers",
      "Thumbnail Automation",
      "Operational State Store",
    ],
  },
  {
    title: "Hall Booking Management System",
    description:
      "A REST API backend for hall reservation management with booking workflows, schema design, and containerized deployment.",
    outcome:
      "Solved scheduling and reservation tracking with maintainable schemas, clear API contracts, and a reproducible Docker-based setup.",
    technologies: ["Python", "FastAPI", "PostgreSQL", "MongoDB", "Docker"],
    repositoryUrl: "https://github.com/BSampathKumar2004/Halls_booking_backend",
    repositoryLabel: "GitHub Repository",
    architectureTitle: "Reservation and availability management API",
    architectureDescription:
      "Client requests move through FastAPI services that validate reservations, persist booking state in PostgreSQL, store flexible records in MongoDB where needed, and run consistently through Dockerized environments.",
    architectureFlow: [
      "Client / Admin Panel",
      "FastAPI Reservation API",
      "Booking Validation Layer",
      "PostgreSQL Core Records",
      "MongoDB Supporting Documents",
      "Dockerized Deployment",
    ],
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
    certificateUrl: "/IBM(AI&DS).pdf",
  },
  {
    title: "Web Development",
    issuer: "Internshala",
  },
  {
    title: "Blockchain Developer",
    issuer: "IBM SkillBuild",
    certificateUrl: "/IBM(BlockChain).pdf",
  },
];
