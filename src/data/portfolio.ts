export const profile = {
  name: "Manojkumar",
  copyrightYear: 2026,
  role: "Full-Stack Developer",
  introduction: "I turn complex ideas into intuitive digital experiences. From the interface you touch to the systems you don’t see, I build for clarity, speed, and scale.",
  email: "", github: "", linkedin: "",
};
export const technologies = [
  { name: "React", logo: "/logos/react.svg", category: "Frontend", description: "Composable interfaces with a clear, predictable flow of data.", verified: true },
  { name: "Next.js", logo: "/logos/nextjs.svg", category: "Frontend", description: "Server-rendered applications with fast, thoughtful user experiences.", verified: true },
  { name: "TypeScript", logo: "/logos/typescript.svg", category: "Frontend", description: "Typed contracts that make complex applications easier to evolve.", verified: true },
  { name: "Tailwind CSS", logo: "/logos/tailwindcss.svg", category: "Frontend", description: "A consistent visual language built with utility-first styling.", verified: true },
  { name: "Go", logo: "/logos/go.svg", category: "Backend", description: "Concurrent services and focused, efficient backend systems.", verified: false },
  { name: "Node.js", logo: "/logos/nodejs.svg", category: "Backend", description: "Event-driven services, integrations, and application APIs.", verified: false },
  { name: "PostgreSQL", logo: "/logos/postgresql.svg", category: "Infrastructure", description: "Relational modeling and dependable application data.", verified: false },
  { name: "Docker", logo: "/logos/docker.svg", category: "Infrastructure", description: "Reproducible environments from development to deployment.", verified: false },
];
export const projects = [
  { id: "01", title: "Webnox ERP", category: "ENTERPRISE SYSTEMS", description: "One workspace. Every moving part. A unified concept for managing customers, inventory, and field operations.", tags: ["Next.js", "Go", "PostgreSQL"], capabilities: ["Modular workspace", "Role-based access", "Operational reporting"], accent: "cyan", tabs: ["EFS", "CRM", "IMS"], detail: "Sample case study: bring fragmented business workflows into a shared operational workspace. The proposed architecture separates domain services, exposes typed APIs, and gives each team a focused view. Replace this narrative, stack, and concept preview with verified project details.", github: "", live: "" },
  { id: "02", title: "Easy Field Services", category: "OPERATIONS / ON THE MOVE", description: "From the first request to the final visit. A field-service concept that connects the office and the people on the ground.", tags: ["React", "Node.js", "PostgreSQL"], capabilities: ["Dispatch planning", "Work-order tracking", "Mobile-first workflows"], accent: "red", tabs: ["Dispatch", "Work orders", "Team"], detail: "Sample case study: design a clear handoff between dispatchers and technicians. The concept explores assignment, visit status, and service history through a responsive application. Screens and implementation details are illustrative, pending actual project content.", github: "", live: "" },
  { id: "03", title: "Event Management", category: "EXPERIENCES / CONNECTED", description: "Less coordination. More connection. An event-platform concept covering the journey from registration to check-in.", tags: ["Next.js", "TypeScript", "Redis"], capabilities: ["Event publishing", "Attendee registration", "Check-in workspace"], accent: "cyan", tabs: ["Overview", "Attendees", "Schedule"], detail: "Sample case study: simplify the experience for organizers and attendees with an end-to-end event workspace. This concept explores accessible registration and a focused check-in flow. Replace with actual architecture, outcomes, and screenshots before publishing.", github: "", live: "" },
];
export const experiences = [
  { period: "SAMPLE / MOST RECENT", title: "Full-Stack Developer", company: "Example product team", description: "Built connected frontend and backend workflows, collaborated on API design, and improved application reliability.", tags: ["Web applications", "API design", "Code review"] },
  { period: "SAMPLE / EARLIER", title: "Developer Intern", company: "Example engineering team", description: "Translated interface designs into responsive components and supported testing, debugging, and feature delivery.", tags: ["Responsive UI", "Testing", "Collaboration"] },
];
export const process = [
  { name: "Discover", label: "ASK THE RIGHT QUESTIONS", description: "Understand the people, the problem, and what success actually means before writing a line of code.", tools: ["Requirements", "User journeys", "Scope"] },
  { name: "Architect", label: "MAKE COMPLEXITY MANAGEABLE", description: "Define boundaries, data models, and API contracts. Choose the simplest architecture that can grow with the product.", tools: ["System design", "Data modeling", "API contracts"] },
  { name: "Design", label: "GIVE EVERY DETAIL A PURPOSE", description: "Build clear flows and accessible interfaces. Prototype the interactions that matter before committing to implementation.", tools: ["Wireframes", "Design systems", "Accessibility"] },
  { name: "Develop", label: "BUILD IN SMALL, SOLID STEPS", description: "Connect a thoughtful frontend to dependable services with reusable components and maintainable code.", tools: ["Typed interfaces", "Version control", "Code review"] },
  { name: "Test", label: "CONFIDENCE IS ENGINEERED", description: "Exercise critical user journeys, edge cases, and failure states. Check performance and accessibility on real layouts.", tools: ["Integration tests", "Browser QA", "Performance"] },
  { name: "Deploy", label: "SHIP. OBSERVE. IMPROVE.", description: "Release safely, monitor the important signals, and use feedback to shape the next iteration.", tools: ["CI/CD", "Monitoring", "Iteration"] },
];
export const achievements = [
  { value: 450, suffix: "+", label: "Problems explored", detail: "Sample coding-practice metric — replace with verified count." },
  { value: 12, suffix: "", label: "Projects delivered", detail: "Sample project metric — replace with verified count." },
];


