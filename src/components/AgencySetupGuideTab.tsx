import React, { useState } from "react";
import {
  Server,
  Terminal,
  Layers,
  Cpu,
  Database,
  Zap,
  Copy,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Package,
  GitBranch,
  Globe,
  Shield,
  Workflow,
  Bot,
  HardDrive,
  Network,
  Code2,
  BookOpen,
  Rocket,
} from "lucide-react";

// ─── types ────────────────────────────────────────────────────────────────────

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface CodeBlockProps {
  code: string;
  lang?: string;
  label?: string;
}

// ─── copy-to-clipboard helper ─────────────────────────────────────────────────

function CodeBlock({ code, lang = "yaml", label }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative my-4 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
          {label || lang}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 hover:text-white transition"
        >
          {copied ? (
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 text-[11px] text-emerald-300 font-mono leading-relaxed overflow-x-auto whitespace-pre">
        {code}
      </pre>
    </div>
  );
}

// ─── collapsible accordion ────────────────────────────────────────────────────

function Accordion({
  title,
  children,
  defaultOpen = false,
  accent = "amber",
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accent?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const accentMap: Record<string, string> = {
    amber: "text-amber-400",
    cyan: "text-cyan-400",
    indigo: "text-indigo-400",
    emerald: "text-emerald-400",
    rose: "text-rose-400",
    fuchsia: "text-fuchsia-400",
  };

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-900 hover:bg-slate-800/60 transition text-left"
      >
        <span className={`text-sm font-bold font-mono ${accentMap[accent] || "text-white"}`}>
          {title}
        </span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 py-5 bg-slate-950/60 space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── stack badge ──────────────────────────────────────────────────────────────

function StackBadge({
  name,
  port,
  color,
  icon,
}: {
  name: string;
  port?: string;
  color: string;
  icon: React.ReactNode;
}) {
  const colorMap: Record<string, string> = {
    amber: "border-amber-700/50 bg-amber-950/30 text-amber-300",
    cyan: "border-cyan-700/50 bg-cyan-950/30 text-cyan-300",
    indigo: "border-indigo-700/50 bg-indigo-950/30 text-indigo-300",
    emerald: "border-emerald-700/50 bg-emerald-950/30 text-emerald-300",
    rose: "border-rose-700/50 bg-rose-950/30 text-rose-300",
    fuchsia: "border-fuchsia-700/50 bg-fuchsia-950/30 text-fuchsia-300",
    blue: "border-blue-700/50 bg-blue-950/30 text-blue-300",
    orange: "border-orange-700/50 bg-orange-950/30 text-orange-300",
  };

  return (
    <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 ${colorMap[color]}`}>
      <span className="shrink-0">{icon}</span>
      <div>
        <span className="block text-[11px] font-bold">{name}</span>
        {port && (
          <span className="block text-[9px] font-mono text-slate-500">:{port}</span>
        )}
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  { id: "overview", label: "Stack Overview", icon: <Layers className="h-4 w-4" />, color: "amber" },
  { id: "docker", label: "Docker Compose", icon: <Package className="h-4 w-4" />, color: "cyan" },
  { id: "ollama", label: "Ollama + Qwen", icon: <Cpu className="h-4 w-4" />, color: "indigo" },
  { id: "rag", label: "RAG Pipeline", icon: <Database className="h-4 w-4" />, color: "emerald" },
  { id: "agents", label: "Custom Agents", icon: <Bot className="h-4 w-4" />, color: "fuchsia" },
  { id: "automation", label: "Activepieces", icon: <Workflow className="h-4 w-4" />, color: "orange" },
  { id: "clients", label: "Client Demos", icon: <Rocket className="h-4 w-4" />, color: "rose" },
  { id: "security", label: "Security & VPS", icon: <Shield className="h-4 w-4" />, color: "cyan" },
];

export default function AgencySetupGuideTab() {
  const [activeSection, setActiveSection] = useState("overview");

  const sectionColorMap: Record<string, string> = {
    amber: "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950",
    cyan: "bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950",
    indigo: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white",
    emerald: "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950",
    fuchsia: "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white",
    orange: "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950",
    rose: "bg-gradient-to-r from-rose-500 to-pink-500 text-white",
    blue: "bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-950",
  };

  const active = SECTIONS.find((s) => s.id === activeSection)!;

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border border-slate-800 p-6 md:p-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/8 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/6 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-cyan-400 text-slate-950 font-mono text-[10px] font-black uppercase rounded-full tracking-wider shadow-lg">
                Self-Hosted AI Agency Stack 🤖
              </span>
              <span className="text-xs text-slate-500 font-mono">Production-Grade Blueprint</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              AI Agency Setup Guide
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Complete production blueprint for launching your own AI agency using Ollama + Qwen, Open WebUI,
              Activepieces, ComfyUI, Docker Compose, and Claude Code — zero OpenAI dependency, 100% self-hosted,
              fully private.
            </p>
          </div>

          <div className="shrink-0 bg-slate-950 border border-slate-800 px-5 py-4 rounded-2xl shadow-xl space-y-1">
            <span className="block text-[9px] text-slate-500 font-mono uppercase">Stack Components</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">8</span>
              <span className="text-xs text-slate-400">services, all Docker-ready</span>
            </div>
            <span className="block text-[10px] text-emerald-400 font-mono">$0/mo API costs</span>
          </div>
        </div>

        {/* Stack quick-view */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 relative z-10">
          {[
            { name: "Ollama", port: "11434", color: "indigo", icon: <Cpu className="h-3.5 w-3.5" /> },
            { name: "Open WebUI", port: "3000", color: "cyan", icon: <Globe className="h-3.5 w-3.5" /> },
            { name: "Qdrant", port: "6333", color: "amber", icon: <Database className="h-3.5 w-3.5" /> },
            { name: "Activepieces", port: "8080", color: "orange", icon: <Workflow className="h-3.5 w-3.5" /> },
            { name: "ComfyUI", port: "8188", color: "fuchsia", icon: <Zap className="h-3.5 w-3.5" /> },
            { name: "LiteLLM", port: "4000", color: "emerald", icon: <Network className="h-3.5 w-3.5" /> },
            { name: "Langfuse", port: "3001", color: "rose", icon: <GitBranch className="h-3.5 w-3.5" /> },
            { name: "Nginx", port: "443", color: "blue", icon: <Shield className="h-3.5 w-3.5" /> },
          ].map(({ name, port, color, icon }) => (
            <React.Fragment key={name}>
              <StackBadge name={name} port={port} color={color} icon={icon} />
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar nav */}
        <div className="lg:col-span-3 space-y-1.5">
          <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-widest font-black px-1 mb-2">
            Guide Sections
          </span>
          {SECTIONS.map((s) => {
            const isActive = s.id === activeSection;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-bold transition ${
                  isActive
                    ? sectionColorMap[s.color] + " shadow-lg"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {s.icon}
                {s.label}
              </button>
            );
          })}

          {/* Mini checklist */}
          <div className="mt-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="block text-[9px] text-slate-500 font-mono uppercase font-black">Launch Checklist</span>
            {[
              "VPS provisioned (4 vCPU / 16 GB RAM min)",
              "Docker + Compose installed",
              "Ollama pulling Qwen models",
              "Open WebUI connected to Ollama",
              "Qdrant vector store live",
              "Activepieces flows deployed",
              "Nginx reverse proxy + SSL",
              "Langfuse tracing enabled",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-[10px] text-slate-400">
                <span className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border border-slate-700 flex items-center justify-center">
                  <span className="text-[8px] font-mono text-slate-600">{i + 1}</span>
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Content panel */}
        <div className="lg:col-span-9">
          {activeSection === "overview" && <OverviewSection />}
          {activeSection === "docker" && <DockerSection />}
          {activeSection === "ollama" && <OllamaSection />}
          {activeSection === "rag" && <RAGSection />}
          {activeSection === "agents" && <AgentsSection />}
          {activeSection === "automation" && <AutomationSection />}
          {activeSection === "clients" && <ClientDemoSection />}
          {activeSection === "security" && <SecuritySection />}
        </div>
      </div>
    </div>
  );
}

// ─── section: overview ────────────────────────────────────────────────────────

function OverviewSection() {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Layers className="h-5 w-5 text-amber-400" />}
        title="Stack Architecture Overview"
        badge="Foundation"
        badgeColor="amber"
        description="Your full self-hosted AI agency stack — designed for privacy, zero ongoing API costs, and client-grade reliability."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="LLM Layer" color="indigo">
          <p>
            <strong className="text-white">Ollama</strong> serves as your local LLM runtime. Pull Qwen3 (7B/14B/32B)
            for general chat and Qwen2.5-Coder for code generation. Models run on your VPS GPU or CPU with no
            external API calls.
          </p>
          <p className="mt-2">
            <strong className="text-white">LiteLLM proxy</strong> sits in front of Ollama and exposes an
            OpenAI-compatible endpoint — so any tool expecting OpenAI format (Open WebUI, CrewAI, LangChain) just
            works without code changes.
          </p>
        </InfoCard>

        <InfoCard title="Frontend / Chat" color="cyan">
          <p>
            <strong className="text-white">Open WebUI</strong> provides your client-facing chat interface with built-in
            RAG, multi-model switching, and user management. Connect it to LiteLLM so all Qwen models appear in the
            model picker.
          </p>
          <p className="mt-2">
            White-label it per client: custom logo, system prompt, restricted model list.
          </p>
        </InfoCard>

        <InfoCard title="Vector / RAG" color="emerald">
          <p>
            <strong className="text-white">Qdrant</strong> is your high-performance vector database. Embed documents
            with <code className="text-cyan-400 bg-slate-900 px-1 rounded">nomic-embed-text</code> via Ollama and store
            them in Qdrant. Open WebUI's RAG pipeline connects directly to Qdrant.
          </p>
        </InfoCard>

        <InfoCard title="Automation Layer" color="orange">
          <p>
            <strong className="text-white">Activepieces</strong> orchestrates your no-code / low-code automation flows
            — lead intake, email routing, webhook triggers from clients, scheduled agent runs, and Slack/email
            notifications. Self-hosted edition is free and unlimited.
          </p>
        </InfoCard>

        <InfoCard title="Media Generation" color="fuchsia">
          <p>
            <strong className="text-white">ComfyUI</strong> handles image/video generation via Stable Diffusion.
            Expose its API endpoint and call it from Activepieces or your Python agent scripts to generate marketing
            assets, thumbnails, or client deliverables on demand.
          </p>
        </InfoCard>

        <InfoCard title="Observability" color="rose">
          <p>
            <strong className="text-white">Langfuse</strong> traces every LLM call — prompt, tokens, latency, cost
            (even local). Essential for debugging multi-agent pipelines and showing clients real-time usage dashboards.
          </p>
        </InfoCard>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h4 className="text-sm font-black text-white font-mono uppercase">Architecture Data Flow</h4>
        <div className="font-mono text-[11px] text-slate-300 bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-x-auto">
          <pre>{`Client Browser / API Call
        │
        ▼
 Nginx (SSL termination, reverse proxy)
        │
   ┌────┴────────────────────────────────┐
   │                                     │
   ▼                                     ▼
Open WebUI :3000                  Activepieces :8080
   │  (chat, RAG, users)            (automation flows)
   │                                     │
   ├──────────► LiteLLM :4000 ◄──────────┤
   │              (OpenAI-compat proxy)   │
   │                    │                 │
   │                    ▼                 │
   │             Ollama :11434            │
   │           (Qwen3, Qwen2.5-Coder     │
   │            nomic-embed-text)         │
   │                                      │
   ├──────────► Qdrant :6333              │
   │           (vector store + RAG)       │
   │                                      │
   └──────────► Langfuse :3001 ◄──────────┘
                 (LLM observability)

ComfyUI :8188  (image/video gen, called via API)
Claude Code     (dev environment, local or remote)
`}</pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Agency Services You Can Sell",
            items: [
              "Custom AI chatbots (white-label Open WebUI)",
              "RAG document Q&A systems",
              "Lead qualification agents",
              "Automated content pipelines",
              "Image/video generation workflows",
              "Multi-agent research reports",
            ],
            color: "text-emerald-400",
          },
          {
            label: "Typical VPS Requirements",
            items: [
              "CPU: 8 vCPU (Qwen 7B runs fine)",
              "RAM: 16–32 GB (32 GB for 14B models)",
              "GPU: Optional RTX 3090 for speed",
              "Storage: 200 GB+ SSD for models",
              "OS: Ubuntu 22.04 LTS",
              "Providers: Hetzner, OVH, Contabo",
            ],
            color: "text-cyan-400",
          },
          {
            label: "Recurring Revenue Angles",
            items: [
              "$500–2k/mo white-label AI portal",
              "$300–800/mo automation maintenance",
              "$1k–5k one-time RAG setup",
              "$200–500/mo Langfuse reporting",
              "$150–400/mo model updates",
              "$2k+ multi-agent custom builds",
            ],
            color: "text-amber-400",
          },
        ].map((col) => (
          <div key={col.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <span className={`block text-[10px] font-mono font-black uppercase ${col.color}`}>{col.label}</span>
            <ul className="space-y-1">
              {col.items.map((item) => (
                <li key={item} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                  <span className={`mt-0.5 shrink-0 ${col.color}`}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── section: docker compose ──────────────────────────────────────────────────

function DockerSection() {
  const composeYaml = `version: "3.9"

services:

  # ── Ollama LLM runtime ─────────────────────────────────
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    restart: unless-stopped
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_ORIGINS=*
    # GPU passthrough (uncomment if you have NVIDIA GPU):
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: all
    #           capabilities: [gpu]

  # ── Open WebUI (chat frontend) ─────────────────────────
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    restart: unless-stopped
    ports:
      - "3000:8080"
    volumes:
      - open_webui_data:/app/backend/data
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
      - OPENAI_API_BASE_URL=http://litellm:4000/v1
      - OPENAI_API_KEY=your-litellm-master-key
      - WEBUI_SECRET_KEY=change-me-long-random-string
      - ENABLE_RAG_WEB_SEARCH=true
      - RAG_EMBEDDING_ENGINE=ollama
      - RAG_EMBEDDING_MODEL=nomic-embed-text
      - QDRANT_URI=http://qdrant:6333
    depends_on:
      - ollama
      - qdrant
      - litellm

  # ── Qdrant vector database ─────────────────────────────
  qdrant:
    image: qdrant/qdrant:latest
    container_name: qdrant
    restart: unless-stopped
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_data:/qdrant/storage

  # ── LiteLLM proxy (OpenAI-compat gateway) ─────────────
  litellm:
    image: ghcr.io/berriai/litellm:main-latest
    container_name: litellm
    restart: unless-stopped
    ports:
      - "4000:4000"
    volumes:
      - ./litellm_config.yaml:/app/config.yaml
    command: ["--config", "/app/config.yaml", "--port", "4000"]
    environment:
      - LITELLM_MASTER_KEY=your-litellm-master-key
    depends_on:
      - ollama

  # ── Activepieces automation platform ──────────────────
  activepieces:
    image: activepieces/activepieces:latest
    container_name: activepieces
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - activepieces_data:/root/.activepieces
    environment:
      - AP_ENCRYPTION_KEY=change-me-32-char-random-key-here
      - AP_JWT_SECRET=change-me-jwt-secret-string
      - AP_FRONTEND_URL=https://your-domain.com
      - AP_SANDBOX_RUN_TIME_SECONDS=600
      - AP_EXECUTION_MODE=SANDBOXED

  # ── ComfyUI image generation ───────────────────────────
  comfyui:
    image: yanwk/comfyui-boot:cu124
    container_name: comfyui
    restart: unless-stopped
    ports:
      - "8188:8188"
    volumes:
      - comfyui_models:/root/ComfyUI/models
      - comfyui_output:/root/ComfyUI/output
    environment:
      - CLI_ARGS=--listen 0.0.0.0 --port 8188
    # GPU passthrough (uncomment if NVIDIA GPU available):
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: all
    #           capabilities: [gpu]

  # ── Langfuse observability ─────────────────────────────
  langfuse:
    image: langfuse/langfuse:latest
    container_name: langfuse
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - DATABASE_URL=postgresql://langfuse:langfuse@langfuse-db:5432/langfuse
      - NEXTAUTH_URL=https://your-domain.com:3001
      - NEXTAUTH_SECRET=change-me-nextauth-secret
      - SALT=change-me-salt-string
    depends_on:
      - langfuse-db

  langfuse-db:
    image: postgres:15-alpine
    container_name: langfuse-db
    restart: unless-stopped
    volumes:
      - langfuse_db:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=langfuse
      - POSTGRES_PASSWORD=langfuse
      - POSTGRES_DB=langfuse

volumes:
  ollama_data:
  open_webui_data:
  qdrant_data:
  activepieces_data:
  comfyui_models:
  comfyui_output:
  langfuse_db:`;

  const litellmConfig = `model_list:
  - model_name: qwen3-7b
    litellm_params:
      model: ollama/qwen3:7b
      api_base: http://ollama:11434

  - model_name: qwen3-14b
    litellm_params:
      model: ollama/qwen3:14b
      api_base: http://ollama:11434

  - model_name: qwen2.5-coder
    litellm_params:
      model: ollama/qwen2.5-coder:7b
      api_base: http://ollama:11434

  - model_name: nomic-embed-text
    litellm_params:
      model: ollama/nomic-embed-text
      api_base: http://ollama:11434

general_settings:
  master_key: your-litellm-master-key

litellm_settings:
  success_callback: ["langfuse"]
  failure_callback: ["langfuse"]
  langfuse_public_key: pk-lf-...
  langfuse_secret_key: sk-lf-...
  langfuse_host: http://langfuse:3000`;

  const deployCmd = `# 1. Clone your agency config
git clone https://github.com/your-org/ai-agency-stack && cd ai-agency-stack

# 2. Copy and edit your secrets
cp .env.example .env && nano .env

# 3. Start the full stack
docker compose up -d

# 4. Pull Qwen models (run after Ollama starts)
docker exec ollama ollama pull qwen3:7b
docker exec ollama ollama pull qwen3:14b
docker exec ollama ollama pull qwen2.5-coder:7b
docker exec ollama ollama pull nomic-embed-text

# 5. Verify all services healthy
docker compose ps

# 6. Tail logs for any service
docker compose logs -f open-webui`;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Package className="h-5 w-5 text-cyan-400" />}
        title="Docker Compose — Full Stack"
        badge="docker-compose.yml"
        badgeColor="cyan"
        description="One file to spin up your entire AI agency stack. Copy-paste, fill in your secrets, and run docker compose up -d."
      />

      <Accordion title="docker-compose.yml — Complete Config" defaultOpen accent="cyan">
        <CodeBlock code={composeYaml} lang="yaml" label="docker-compose.yml" />
      </Accordion>

      <Accordion title="litellm_config.yaml — Model Gateway" accent="indigo">
        <p className="mb-2">
          Place this file next to your <code className="text-cyan-400">docker-compose.yml</code>. It registers all
          Ollama models under OpenAI-compatible names so every tool can use them without knowing about Ollama.
        </p>
        <CodeBlock code={litellmConfig} lang="yaml" label="litellm_config.yaml" />
      </Accordion>

      <Accordion title="Deploy Commands — First-Run Sequence" accent="emerald">
        <CodeBlock code={deployCmd} lang="bash" label="bash" />
      </Accordion>

      <div className="bg-slate-900 border border-amber-700/30 rounded-2xl p-5 space-y-2">
        <h4 className="text-xs font-black text-amber-400 font-mono uppercase">Potential Issues & Fixes</h4>
        <ul className="space-y-2">
          {[
            {
              issue: "Ollama OOM crash on CPU-only VPS",
              fix: "Use qwen3:7b (4-bit quantized, ~4 GB RAM). Set OLLAMA_NUM_PARALLEL=1 env var.",
            },
            {
              issue: "Open WebUI can't connect to Qdrant",
              fix: "Ensure QDRANT_URI uses the Docker service name (http://qdrant:6333), not localhost.",
            },
            {
              issue: "LiteLLM returns 401 Unauthorized",
              fix: "Match LITELLM_MASTER_KEY in compose and OPENAI_API_KEY in Open WebUI exactly.",
            },
            {
              issue: "Activepieces flows timeout",
              fix: "Increase AP_SANDBOX_RUN_TIME_SECONDS to 600 or higher for long AI tasks.",
            },
          ].map((item) => (
            <li key={item.issue} className="text-xs text-slate-300">
              <span className="text-rose-400 font-bold">{item.issue}: </span>
              {item.fix}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── section: ollama ──────────────────────────────────────────────────────────

function OllamaSection() {
  const modelPullCmds = `# Text generation models
ollama pull qwen3:7b          # Fast, fits 8 GB VRAM / 16 GB RAM
ollama pull qwen3:14b         # Better quality, needs 32 GB RAM
ollama pull qwen3:32b         # Best quality, needs 64 GB RAM or quantized

# Code generation
ollama pull qwen2.5-coder:7b
ollama pull qwen2.5-coder:14b

# Embeddings (required for RAG)
ollama pull nomic-embed-text

# Vision / multimodal
ollama pull qwen2.5-vl:7b

# List loaded models
ollama list

# Run interactive chat (test)
ollama run qwen3:7b`;

  const ollamaTest = `# Test Ollama via HTTP (from your VPS)
curl http://localhost:11434/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "qwen3:7b",
    "prompt": "What can you help me with?",
    "stream": false
  }'

# Test via LiteLLM OpenAI-compat endpoint
curl http://localhost:4000/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-litellm-master-key" \\
  -d '{
    "model": "qwen3-7b",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`;

  const modelfileCustom = `# Create a custom system-prompted agent persona
# Save as: Modelfile.agency-assistant

FROM qwen3:7b

SYSTEM """
You are an elite AI agency assistant. You help clients with:
- Analyzing their business workflows for automation opportunities
- Suggesting AI integration strategies
- Drafting professional reports and proposals

Be concise, data-driven, and professional. Always ask clarifying
questions before making recommendations.
"""

PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_predict 2048

# Build and run the custom model
# ollama create agency-assistant -f Modelfile.agency-assistant
# ollama run agency-assistant`;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Cpu className="h-5 w-5 text-indigo-400" />}
        title="Ollama + Qwen Model Setup"
        badge="LLM Layer"
        badgeColor="indigo"
        description="Pull and configure Qwen models for chat, code generation, embeddings, and vision tasks — all running locally."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="Qwen3 Model Sizes" color="indigo">
          <table className="w-full text-[11px] font-mono">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="text-left pb-1">Model</th>
                <th className="text-left pb-1">VRAM</th>
                <th className="text-left pb-1">Quality</th>
              </tr>
            </thead>
            <tbody className="space-y-1">
              {[
                { model: "qwen3:7b", vram: "~5 GB", quality: "Good" },
                { model: "qwen3:14b", vram: "~9 GB", quality: "Great" },
                { model: "qwen3:32b", vram: "~20 GB", quality: "Excellent" },
                { model: "qwen3:32b-q4", vram: "~10 GB", quality: "Excellent*" },
              ].map((row) => (
                <tr key={row.model} className="border-b border-slate-900">
                  <td className="py-1 text-cyan-400">{row.model}</td>
                  <td className="py-1 text-amber-400">{row.vram}</td>
                  <td className="py-1 text-emerald-400">{row.quality}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-slate-500 mt-2">* 4-bit quantized — near-full quality at half VRAM</p>
        </InfoCard>

        <InfoCard title="CPU-Only VPS Tip" color="amber">
          <p>
            Even without a GPU, qwen3:7b with 4-bit quantization runs at ~3–6 tokens/sec on a 16-core VPS. Good
            enough for async agent tasks. Use <code className="text-cyan-400">OLLAMA_NUM_PARALLEL=1</code> to avoid
            OOM crashes.
          </p>
          <p className="mt-2">
            For GPU-accelerated inference, Hetzner AX102 (RTX 3090) or a Vast.ai instance cuts generation time to
            50–80 tokens/sec.
          </p>
        </InfoCard>
      </div>

      <Accordion title="Pull Commands — All Recommended Models" defaultOpen accent="indigo">
        <CodeBlock code={modelPullCmds} lang="bash" label="bash" />
      </Accordion>

      <Accordion title="Test Ollama & LiteLLM Endpoints" accent="cyan">
        <CodeBlock code={ollamaTest} lang="bash" label="bash — API test" />
      </Accordion>

      <Accordion title="Custom Modelfile — Agency Assistant Persona" accent="amber">
        <p className="mb-2">
          Create bespoke personas using Ollama Modelfiles. Build client-specific assistants with locked system prompts
          and tuned parameters.
        </p>
        <CodeBlock code={modelfileCustom} lang="dockerfile" label="Modelfile" />
      </Accordion>
    </div>
  );
}

// ─── section: RAG ─────────────────────────────────────────────────────────────

function RAGSection() {
  const ragPython = `"""
RAG ingestion pipeline using Ollama embeddings + Qdrant
Requirements: pip install qdrant-client ollama langchain-community
"""
from pathlib import Path
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import ollama
import uuid

QDRANT_URL = "http://localhost:6333"
COLLECTION = "client_docs"
EMBED_MODEL = "nomic-embed-text"  # 768-dim vectors
CHUNK_SIZE = 800
CHUNK_OVERLAP = 100


def chunk_text(text: str) -> list[str]:
    """Split text into overlapping chunks."""
    chunks, start = [], 0
    while start < len(text):
        end = start + CHUNK_SIZE
        chunks.append(text[start:end])
        start = end - CHUNK_OVERLAP
    return chunks


def embed(text: str) -> list[float]:
    """Embed a string using Ollama nomic-embed-text."""
    resp = ollama.embeddings(model=EMBED_MODEL, prompt=text)
    return resp["embedding"]


def ingest_documents(folder: str, client_id: str = "default"):
    """Ingest all .txt/.md files from a folder into Qdrant."""
    qc = QdrantClient(url=QDRANT_URL)

    # Create collection if it doesn't exist
    existing = [c.name for c in qc.get_collections().collections]
    if COLLECTION not in existing:
        qc.create_collection(
            collection_name=COLLECTION,
            vectors_config=VectorParams(size=768, distance=Distance.COSINE),
        )

    points = []
    for path in Path(folder).glob("**/*.{txt,md,pdf}"):
        text = path.read_text(errors="ignore")
        for chunk in chunk_text(text):
            vec = embed(chunk)
            points.append(PointStruct(
                id=str(uuid.uuid4()),
                vector=vec,
                payload={"text": chunk, "source": str(path), "client": client_id},
            ))

    qc.upsert(collection_name=COLLECTION, points=points)
    print(f"Ingested {len(points)} chunks from {folder}")


def query_rag(question: str, client_id: str = "default", top_k: int = 5) -> str:
    """Retrieve relevant chunks and answer with Qwen via Ollama."""
    qc = QdrantClient(url=QDRANT_URL)
    q_vec = embed(question)

    results = qc.search(
        collection_name=COLLECTION,
        query_vector=q_vec,
        limit=top_k,
        query_filter={"must": [{"key": "client", "match": {"value": client_id}}]},
    )

    context = "\\n\\n".join(r.payload["text"] for r in results)
    prompt = f"""Use the context below to answer the question accurately.
Context:
{context}

Question: {question}
Answer:"""

    resp = ollama.chat(
        model="qwen3:7b",
        messages=[{"role": "user", "content": prompt}],
    )
    return resp["message"]["content"]


if __name__ == "__main__":
    # Ingest your client's documents
    ingest_documents("./client_docs/", client_id="client_abc")

    # Query
    answer = query_rag("What are our refund policies?", client_id="client_abc")
    print(answer)`;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Database className="h-5 w-5 text-emerald-400" />}
        title="RAG Pipeline — Qdrant + Ollama"
        badge="Vector Store"
        badgeColor="emerald"
        description="Ingest client documents into Qdrant and answer questions using local Qwen models. Full privacy — no data leaves your VPS."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            step: "1. Chunk",
            desc: "Split PDFs, Word docs, and Markdown files into 800-token overlapping chunks.",
            color: "text-amber-400",
          },
          {
            step: "2. Embed",
            desc: "Generate 768-dim vectors using nomic-embed-text via Ollama — zero cloud dependency.",
            color: "text-cyan-400",
          },
          {
            step: "3. Retrieve + Answer",
            desc: "Cosine search Qdrant for top-K chunks, inject into Qwen3 prompt, return answer.",
            color: "text-emerald-400",
          },
        ].map((s) => (
          <div key={s.step} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className={`text-xs font-black font-mono ${s.color}`}>{s.step}</span>
            <p className="text-[11px] text-slate-400">{s.desc}</p>
          </div>
        ))}
      </div>

      <Accordion title="Complete RAG Ingestion + Query Script" defaultOpen accent="emerald">
        <CodeBlock code={ragPython} lang="python" label="rag_pipeline.py" />
      </Accordion>

      <InfoCard title="Connecting Open WebUI RAG to Qdrant" color="cyan">
        <p>
          Open WebUI supports Qdrant natively. In Settings → Documents, set the vector DB to Qdrant and point it at{" "}
          <code className="text-cyan-400">http://qdrant:6333</code>. Users can upload docs directly in the chat
          interface and the system will auto-embed and retrieve them.
        </p>
        <p className="mt-2">
          Use the Python script above for bulk ingestion of existing client knowledge bases (contracts, SOPs, product
          docs).
        </p>
      </InfoCard>
    </div>
  );
}

// ─── section: agents ──────────────────────────────────────────────────────────

function AgentsSection() {
  const crewaiAgent = `"""
Multi-agent research crew using CrewAI + Ollama (via LiteLLM)
Requirements: pip install crewai langchain-community
"""
import os
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI

os.environ["OPENAI_API_BASE"] = "http://localhost:4000/v1"
os.environ["OPENAI_API_KEY"] = "your-litellm-master-key"

# Use your local Qwen model via LiteLLM proxy
llm = ChatOpenAI(model="qwen3-14b", temperature=0.3)


# ── Agents ─────────────────────────────────────────────

researcher = Agent(
    role="Senior Market Researcher",
    goal="Research the target company and compile key facts, products, and market position.",
    backstory="You are a meticulous analyst with deep expertise in competitive intelligence.",
    verbose=True,
    allow_delegation=False,
    llm=llm,
)

analyst = Agent(
    role="Business Analyst",
    goal="Analyze research findings and identify key opportunities and risks for the client.",
    backstory="You excel at synthesizing complex data into actionable strategic recommendations.",
    verbose=True,
    allow_delegation=False,
    llm=llm,
)

writer = Agent(
    role="Report Writer",
    goal="Write a professional, client-ready PDF-ready report from the analyst's findings.",
    backstory="You produce polished business reports that senior executives find immediately actionable.",
    verbose=True,
    allow_delegation=False,
    llm=llm,
)


# ── Tasks ──────────────────────────────────────────────

def build_research_crew(company_name: str, industry: str) -> str:
    research_task = Task(
        description=f"""
        Research {company_name} in the {industry} industry.
        Cover: key products, pricing, target market, online presence, and recent news.
        Output structured bullet points with sources.
        """,
        expected_output="Structured research notes with 15–20 bullet points.",
        agent=researcher,
    )

    analysis_task = Task(
        description="""
        Using the research notes, identify:
        1. Top 3 competitive advantages
        2. Top 3 weaknesses / risks
        3. 3 market opportunities we could exploit
        4. Recommended positioning against this competitor
        """,
        expected_output="Strategic analysis with 4 sections, each with 3 bullet points.",
        agent=analyst,
        context=[research_task],
    )

    report_task = Task(
        description="""
        Write a professional one-page client report (Markdown format) covering:
        - Executive Summary (2 sentences)
        - Research Findings (bullet list)
        - Strategic Analysis (4 sections)
        - Recommended Next Steps (3 actions)

        Use professional business language. Format cleanly with headers.
        """,
        expected_output="Complete Markdown report ready for client delivery.",
        agent=writer,
        context=[research_task, analysis_task],
    )

    crew = Crew(
        agents=[researcher, analyst, writer],
        tasks=[research_task, analysis_task, report_task],
        process=Process.sequential,
        verbose=2,
    )

    result = crew.kickoff()
    return result


if __name__ == "__main__":
    report = build_research_crew(
        company_name="Acme Corp",
        industry="B2B SaaS"
    )
    print(report)`;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Bot className="h-5 w-5 text-fuchsia-400" />}
        title="Custom AI Agents — CrewAI + Ollama"
        badge="Multi-Agent"
        badgeColor="fuchsia"
        description="Build production multi-agent systems using CrewAI routed through LiteLLM to your local Qwen models. Sell as deliverable reports or live client portals."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="Why CrewAI + Ollama" color="fuchsia">
          <p>
            CrewAI orchestrates role-based agent teams. By routing through LiteLLM proxy, your agents use local
            Qwen models with the standard OpenAI SDK — no API key required, no usage costs.
          </p>
        </InfoCard>
        <InfoCard title="Agent Patterns to Sell" color="indigo">
          <ul className="space-y-1">
            {[
              "Competitor research crew → PDF report",
              "Lead qualification agent → CRM enrichment",
              "Contract review agent → risk flags",
              "Content repurposing crew → multi-platform drafts",
              "Customer support agent with RAG knowledge base",
            ].map((item) => (
              <li key={item} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                <span className="text-fuchsia-400 mt-0.5 shrink-0">▸</span>
                {item}
              </li>
            ))}
          </ul>
        </InfoCard>
      </div>

      <Accordion title="Multi-Agent Research Crew — Complete Code" defaultOpen accent="fuchsia">
        <CodeBlock code={crewaiAgent} lang="python" label="research_crew.py" />
      </Accordion>

      <InfoCard title="Langfuse Tracing for Agents" color="rose">
        <p>
          Add LLM observability to your agent runs. Set{" "}
          <code className="text-cyan-400">LANGFUSE_PUBLIC_KEY</code> and{" "}
          <code className="text-cyan-400">LANGFUSE_SECRET_KEY</code> in your environment. LiteLLM automatically
          forwards traces to Langfuse — you'll see every agent call, token count, and latency in the Langfuse
          dashboard at <code className="text-cyan-400">http://your-vps:3001</code>.
        </p>
      </InfoCard>
    </div>
  );
}

// ─── section: automation ──────────────────────────────────────────────────────

function AutomationSection() {
  const webhookFlow = `// Activepieces: HTTP trigger → Ollama LLM → Email response
// Create this flow in the Activepieces UI at http://your-vps:8080

// Step 1: HTTP Trigger (Webhook)
// Method: POST
// Path: /ai-inquiry
// Returns: { "name": "...", "question": "...", "email": "..." }

// Step 2: Code block — call your local Ollama via LiteLLM
const response = await fetch('http://litellm:4000/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-litellm-master-key'
  },
  body: JSON.stringify({
    model: 'qwen3-7b',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful AI agency assistant. Be concise and professional.'
      },
      {
        role: 'user',
        content: \`Client name: \${trigger.body.name}\\nQuestion: \${trigger.body.question}\`
      }
    ]
  })
});

const data = await response.json();
const aiAnswer = data.choices[0].message.content;

// Step 3: Send Email (SMTP piece in Activepieces)
// To: trigger.body.email
// Subject: "Your AI Agency Response"
// Body: aiAnswer`;

  const schedFlow = `// Activepieces: Scheduled agent run every morning at 8am
// Runs your Python research crew and emails the report

// Step 1: Schedule trigger (Cron: 0 8 * * *)

// Step 2: HTTP Request piece
// URL: http://your-agent-api:5000/run-research-crew
// Method: POST
// Body: { "company": "Acme Corp", "industry": "SaaS" }

// Step 3: Gmail / SMTP piece
// To: client@example.com
// Subject: "Daily Competitive Intelligence Report"
// Body: {{step_2.body.report}}

// Step 4: Slack notification piece
// Channel: #agency-reports
// Message: "Report delivered to Acme Corp client ✅"`;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Workflow className="h-5 w-5 text-orange-400" />}
        title="Activepieces Automation Flows"
        badge="No-Code Automation"
        badgeColor="orange"
        description="Wire up AI-powered workflows without writing a backend. Activepieces self-hosted edition is free and connects directly to your Ollama stack."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: "Client Inquiry Bot",
            desc: "Webhook receives client questions → Qwen answers → email auto-response.",
            icon: "💬",
          },
          {
            title: "Scheduled Report Crew",
            desc: "8am daily: trigger CrewAI research agent → email PDF report to client.",
            icon: "📊",
          },
          {
            title: "Lead Enrichment",
            desc: "New form submission → Qwen qualifies lead → push to CRM + Slack alert.",
            icon: "🎯",
          },
        ].map((f) => (
          <div key={f.title} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="text-xl">{f.icon}</span>
            <span className="block text-xs font-black text-white">{f.title}</span>
            <p className="text-[11px] text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>

      <Accordion title="Client Inquiry Webhook Flow — Code" defaultOpen accent="orange">
        <p className="mb-2">
          In Activepieces, create a flow with an HTTP Trigger piece, a Code piece (JavaScript), and an Email piece.
          The Code piece calls your LiteLLM endpoint and returns the AI response.
        </p>
        <CodeBlock code={webhookFlow} lang="javascript" label="activepieces-flow.js" />
      </Accordion>

      <Accordion title="Scheduled Agent Run Flow" accent="amber">
        <CodeBlock code={schedFlow} lang="javascript" label="scheduled-report-flow.js" />
      </Accordion>

      <InfoCard title="Connecting Activepieces to Your Services" color="orange">
        <p>
          Since Activepieces runs in Docker on the same network, it can reach all your services by container name:{" "}
          <code className="text-cyan-400">http://litellm:4000</code>,{" "}
          <code className="text-cyan-400">http://qdrant:6333</code>, etc. No port mapping needed between internal
          services.
        </p>
        <p className="mt-2">
          Install the HTTP piece, Email piece, and Slack piece from the Activepieces marketplace to handle most
          agency automation use cases out of the box.
        </p>
      </InfoCard>
    </div>
  );
}

// ─── section: client demos ────────────────────────────────────────────────────

function ClientDemoSection() {
  const demoScript = `# Client Demo Script — 20-minute live walkthrough

## PART 1: The Private AI Chat (5 min)
"Open WebUI gives your team a ChatGPT-like interface — but it runs entirely
on your infrastructure. Your conversations never leave your server."

Demo: Chat with qwen3:14b, show model switching, show dark/light mode.

## PART 2: RAG Document Q&A (7 min)
"Upload your company handbook, SOPs, or product documentation.
Your AI can instantly answer questions about your own internal knowledge."

Demo:
1. Upload a PDF in Open WebUI Documents
2. Start a new chat with "Use your knowledge base"
3. Ask: "What is our refund policy?" → AI answers from the document

## PART 3: Automated AI Workflows (5 min)
"We build automations that run 24/7. This one monitors a form —
when a new lead arrives, AI qualifies them and emails a personalized response."

Demo: Submit a test form → show Activepieces run log → show email received

## PART 4: Pricing & Next Steps (3 min)
Setup fee:  $2,500 (one-time)
Monthly:    $500/mo (hosting + maintenance + updates)
Add-ons:    RAG ingestion, custom agent builds, ComfyUI media`;

  const proposalTemplate = `# AI Agency Proposal — [Client Name]
Prepared by: [Your Agency Name]
Date: [Date]

## Executive Summary
We will deploy a private, self-hosted AI infrastructure for [Client Name] that
eliminates dependency on third-party AI APIs while providing a complete suite of
AI tools tailored to your workflows.

## Deliverables

### Phase 1 — Foundation (Week 1–2)
- [ ] VPS provisioning and hardening
- [ ] Docker Compose stack deployment (Ollama, Open WebUI, Qdrant)
- [ ] LLM model configuration (Qwen3-14B for your use case)
- [ ] SSL/Nginx setup with your subdomain

### Phase 2 — Knowledge Base (Week 2–3)
- [ ] Document ingestion pipeline for your [X] internal documents
- [ ] Qdrant vector store setup with client isolation
- [ ] Open WebUI RAG configuration and testing
- [ ] User account provisioning

### Phase 3 — Automation (Week 3–4)
- [ ] Activepieces deployment and flow design
- [ ] [Specific automation 1, e.g., lead intake bot]
- [ ] [Specific automation 2, e.g., report generation]
- [ ] Testing and handoff

## Investment
| Item | Cost |
|------|------|
| Setup & deployment | $2,500 |
| Monthly maintenance | $500/mo |
| VPS (Hetzner AX41) | ~$60/mo (billed to you) |
| **Total Month 1** | **$3,060** |
| **Recurring monthly** | **$560** |

## What You Own
All infrastructure runs on your VPS. You own the server, the data, and the models.
We provide ongoing maintenance, model updates, and automation support.`;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Rocket className="h-5 w-5 text-rose-400" />}
        title="Client Demo & Proposal Templates"
        badge="Sales Tools"
        badgeColor="rose"
        description="Repeatable demo script and proposal template for selling self-hosted AI agency services to SMB clients."
      />

      <Accordion title="20-Minute Live Demo Script" defaultOpen accent="rose">
        <CodeBlock code={demoScript} lang="markdown" label="demo-script.md" />
      </Accordion>

      <Accordion title="Client Proposal Template (Markdown)" accent="amber">
        <CodeBlock code={proposalTemplate} lang="markdown" label="proposal-template.md" />
      </Accordion>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="Pricing Anchors" color="emerald">
          <ul className="space-y-1.5">
            {[
              { service: "Basic AI Chat Portal", price: "$1,500 setup + $300/mo" },
              { service: "RAG Knowledge Base", price: "$2,500 setup + $400/mo" },
              { service: "Full Agency Stack", price: "$4,000 setup + $600/mo" },
              { service: "Custom Agent Build", price: "$2,000–8,000 project" },
              { service: "ComfyUI Media Pipeline", price: "$1,500 setup + $200/mo" },
              { service: "Langfuse Reporting Dashboard", price: "$500 setup + $150/mo" },
            ].map((item) => (
              <li key={item.service} className="flex justify-between text-[11px] border-b border-slate-800 pb-1">
                <span className="text-slate-300">{item.service}</span>
                <span className="text-emerald-400 font-mono font-bold">{item.price}</span>
              </li>
            ))}
          </ul>
        </InfoCard>

        <InfoCard title="Client Objection Responses" color="cyan">
          <ul className="space-y-2">
            {[
              {
                q: '"Why not just use ChatGPT?"',
                a: "Your data never leaves your server. Zero per-message costs. Full control over the model.",
              },
              {
                q: '"Can it read our documents?"',
                a: "Yes — upload any PDF, Word, or text file. The AI answers questions from your own knowledge base.",
              },
              {
                q: '"What happens if AI improves?"',
                a: "We update to newer Qwen models as they release. No retraining cost. Just a docker pull.",
              },
              {
                q: '"Is it secure?"',
                a: "Runs on your VPS behind Nginx + SSL. Supabase auth for user management. Data never touches OpenAI servers.",
              },
            ].map((item) => (
              <div key={item.q} className="text-[11px] space-y-0.5">
                <span className="text-cyan-400 font-bold">{item.q}</span>
                <p className="text-slate-400">{item.a}</p>
              </div>
            ))}
          </ul>
        </InfoCard>
      </div>
    </div>
  );
}

// ─── section: security ────────────────────────────────────────────────────────

function SecuritySection() {
  const nginxConf = `# /etc/nginx/sites-available/ai-agency
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate     /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=ai:10m rate=10r/m;
    limit_req zone=ai burst=20 nodelay;

    # Open WebUI
    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host $host;
        proxy_read_timeout 300s;
    }

    # Activepieces (restrict to admin IP or VPN only)
    location /automations/ {
        allow 1.2.3.4;   # Your admin IP
        deny all;
        proxy_pass http://127.0.0.1:8080/;
    }

    # LiteLLM API (internal only — do NOT expose publicly)
    # Access via Docker network only: http://litellm:4000
}`;

  const firewallCmds = `# UFW firewall setup for your VPS
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Fail2ban — block repeated failed logins
sudo apt install fail2ban -y
sudo systemctl enable fail2ban --now

# Certbot — free SSL via Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com

# Auto-renew SSL
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet`;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Shield className="h-5 w-5 text-cyan-400" />}
        title="VPS Security & Nginx Setup"
        badge="Production Hardening"
        badgeColor="cyan"
        description="Lock down your VPS, set up SSL, configure Nginx as a reverse proxy, and apply firewall rules before going live with clients."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="Services to Expose vs. Keep Internal" color="amber">
          <table className="w-full text-[11px] font-mono">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="text-left pb-1">Service</th>
                <th className="text-left pb-1">Expose?</th>
              </tr>
            </thead>
            <tbody>
              {[
                { svc: "Open WebUI :3000", exp: "✅ via Nginx HTTPS" },
                { svc: "Activepieces :8080", exp: "⚠️ Admin IP only" },
                { svc: "Langfuse :3001", exp: "⚠️ Admin IP only" },
                { svc: "Ollama :11434", exp: "❌ Internal only" },
                { svc: "LiteLLM :4000", exp: "❌ Internal only" },
                { svc: "Qdrant :6333", exp: "❌ Internal only" },
                { svc: "ComfyUI :8188", exp: "⚠️ Admin IP only" },
              ].map((r) => (
                <tr key={r.svc} className="border-b border-slate-900">
                  <td className="py-1 text-cyan-400">{r.svc}</td>
                  <td className="py-1 text-slate-300">{r.exp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfoCard>

        <InfoCard title="Security Checklist" color="emerald">
          {[
            "SSH key auth only (disable password auth)",
            "UFW firewall: allow only 22, 80, 443",
            "Fail2ban for SSH + Nginx brute force",
            "Let's Encrypt SSL on all client-facing URLs",
            "Rotate Activepieces AP_ENCRYPTION_KEY on setup",
            "Docker network isolation (services on private bridge)",
            "Weekly docker image updates (watchtower or cron)",
            "Nightly borg/restic backups of Docker volumes",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-[11px] text-slate-400">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
              {item}
            </div>
          ))}
        </InfoCard>
      </div>

      <Accordion title="Nginx Reverse Proxy Config" defaultOpen accent="cyan">
        <CodeBlock code={nginxConf} lang="nginx" label="/etc/nginx/sites-available/ai-agency" />
      </Accordion>

      <Accordion title="Firewall + SSL Setup Commands" accent="emerald">
        <CodeBlock code={firewallCmds} lang="bash" label="bash — VPS hardening" />
      </Accordion>
    </div>
  );
}

// ─── shared subcomponents ─────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  badge,
  badgeColor,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
}) {
  const badgeColorMap: Record<string, string> = {
    amber: "bg-amber-400 text-slate-950",
    cyan: "bg-cyan-400 text-slate-950",
    indigo: "bg-indigo-500 text-white",
    emerald: "bg-emerald-400 text-slate-950",
    fuchsia: "bg-fuchsia-500 text-white",
    orange: "bg-orange-400 text-slate-950",
    rose: "bg-rose-500 text-white",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-black text-white">{title}</h3>
        <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full ${badgeColorMap[badgeColor]}`}>
          {badge}
        </span>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function InfoCard({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  const colorMap: Record<string, string> = {
    amber: "border-amber-700/30 text-amber-400",
    cyan: "border-cyan-700/30 text-cyan-400",
    indigo: "border-indigo-700/30 text-indigo-400",
    emerald: "border-emerald-700/30 text-emerald-400",
    rose: "border-rose-700/30 text-rose-400",
    fuchsia: "border-fuchsia-700/30 text-fuchsia-400",
    orange: "border-orange-700/30 text-orange-400",
    blue: "border-blue-700/30 text-blue-400",
  };

  return (
    <div className={`bg-slate-900 border rounded-xl p-5 space-y-2 ${colorMap[color]}`}>
      <h4 className="text-xs font-black font-mono uppercase">{title}</h4>
      <div className="text-xs text-slate-300 leading-relaxed font-sans">{children}</div>
    </div>
  );
}
