import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Loader2, 
  Clock, 
  Terminal, 
  Send, 
  Cpu, 
  Layers, 
  CheckCircle, 
  ArrowRight,
  BookOpen,
  Award,
  Video,
  Database,
  Plus,
  Trash2,
  FileText,
  Check,
  Edit2,
  Volume2,
  Tv,
  Download,
  Flame,
  Settings,
  HelpCircle
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  topic: string;
  duration: number; // in mins
  status: "Planning" | "Scripted" | "Filmed" | "Published";
  bullets: string;
  script: string;
}

interface Course {
  id: string;
  title: string;
  hoursSaved: number;
  dollarsSaved: number;
  lessons: Lesson[];
}

const DEFAULT_COURSES: Course[] = [
  {
    id: "course-1",
    title: "B2B Scale Architecture & Clonic Video Loops",
    hoursSaved: 18,
    dollarsSaved: 320,
    lessons: [
      {
        id: "lesson-1",
        title: "Introduction to Digital Clones & Rapid Video Leverage",
        topic: "Voice cloning via ElevenLabs + Instant HeyGen Avatar Lipsyncing",
        duration: 4,
        status: "Scripted",
        bullets: "Why traditional camera filming drains developer hours.\nTraining instant premium audio speaking cadence profiles.\nCreating verbal permissions release recordings for AI platforms.",
        script: `### Clonic Video Script: "Introduction to Digital Clones & Rapid Video Leverage"
*Production Ready • Estimated Duration: 4 minutes*

#### 🎬 1. The Power-Hook (0:00 - 0:45)
**[Visual Cue: Camera opens on Lovina's high-contrast dark theme background. The avatar stands centered, looking directly into the lens with absolute confidence. Polite arm crossover.]**

"Welcome back! If you are like most scaling coaches and high-ticket service operators, you are losing fifteen to twenty productive hours every week recording script takes, correcting syntax, and rendering frames. Today, we collapse that limit entirely."

---

#### 🛠️ 2. The Core Pipeline Delivery (0:45 - 3:00)
**[Visual Cue: Slide transition showing an overview diagram of CapyStack API payloads routed into HeyGen.]**

"First, understand standard voice synthesis. We construct high-fidelity audio clone identities that mirror your natural speak style. Then, we link the lip positions onto a simulated video canvas. This allows you to generate professional daily reels using nothing but automated text streams."

---

#### 🎯 3. Actionable Scale Blueprint & CTA (3:00 - 4:00)
**[Visual Cue: Camera zooms in gently to Lovina's avatar.]**

"No cameras, no microphones, and no editors needed. You write and deploy from the keyboard. Let's script your first module right now."`
      },
      {
        id: "lesson-2",
        title: "Routing Webhooks: Connecting CapyStack to n8n & Activepieces",
        topic: "Automated Omni-Publisher pipeline configurations",
        duration: 6,
        status: "Planning",
        bullets: "Initializing programmatic custom webhook trigger points. \nFormatting multi-channel payload arrays to destination nodes. \nRelaying files dynamically into ElevenLabs REST speech targets.",
        script: ""
      },
      {
        id: "lesson-3",
        title: "Generative Citation Strategies: Dominating Voice Search Engine Rankings",
        topic: "GEO, citation calibration, and ranking benchmarks",
        duration: 5,
        status: "Published",
        bullets: "How LLM indexers scrape brand references.\nConfiguring vocabulary parameters in CapyStack brand panels.\nDominating digital intelligence rankings.",
        script: ""
      }
    ]
  }
];

export default function AcademyTab() {
  // Core View tab toggler
  const [activeSubTab, setActiveSubTab] = useState<"copilot" | "creator">("copilot");

  // State log for Gemini strategic chat
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "copilot"; text: string }>>([
    {
      sender: "copilot",
      text: "### ⚙️ Integrate Your AI Stack\n\nSeamlessly connect your own preferred AI automation accounts to CapyStack. Use our **API & MCP integration nodes** to connect your workflows using your existing credentials, ensuring complete control over your assets and usage.\n\n**Select one of the rapid strategic consultation questions below or write your own question to start.**"
    }
  ]);

  // Course management states
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const stored = localStorage.getItem("capystack_custom_courses");
      return stored ? JSON.parse(stored) : DEFAULT_COURSES;
    } catch {
      return DEFAULT_COURSES;
    }
  });

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "course-1");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");

  // Create course form states
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseHours, setNewCourseHours] = useState(15);
  const [newCourseDollars, setNewCourseDollars] = useState(300);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  // Lesson Edit Form states
  const [editLessonTitle, setEditLessonTitle] = useState("");
  const [editLessonTopic, setEditLessonTopic] = useState("");
  const [editLessonDuration, setEditLessonDuration] = useState(5);
  const [editLessonBullets, setEditLessonBullets] = useState("");
  const [editLessonScript, setEditLessonScript] = useState("");
  const [editLessonStatus, setEditLessonStatus] = useState<"Planning" | "Scripted" | "Filmed" | "Published">("Planning");
  const [voiceTonePrompt, setVoiceTonePrompt] = useState("Authority speaker, systems key, professional pacing");

  // Script Generator loader state
  const [generatingScript, setGeneratingScript] = useState(false);

  // Sync back to localstorage on course updates
  useEffect(() => {
    localStorage.setItem("capystack_custom_courses", JSON.stringify(courses));
  }, [courses]);

  // Set initial default lesson when active course shifts
  const activeCourse = courses.find(c => c.id === selectedCourseId);
  useEffect(() => {
    if (activeCourse && activeCourse.lessons.length > 0) {
      const firstId = activeCourse.lessons[0].id;
      setSelectedLessonId(firstId);
    } else {
      setSelectedLessonId("");
    }
  }, [selectedCourseId]);

  // Populate lesson form states when selected lesson changes
  useEffect(() => {
    if (activeCourse) {
      const lesson = activeCourse.lessons.find(l => l.id === selectedLessonId);
      if (lesson) {
        setEditLessonTitle(lesson.title);
        setEditLessonTopic(lesson.topic);
        setEditLessonDuration(lesson.duration);
        setEditLessonBullets(lesson.bullets);
        setEditLessonScript(lesson.script);
        setEditLessonStatus(lesson.status);
      }
    }
  }, [selectedLessonId, selectedCourseId]);

  // Save selected course & lesson changes
  const handleSaveLessonChanges = () => {
    if (!activeCourse) return;
    const updatedLessons = activeCourse.lessons.map(l => {
      if (l.id === selectedLessonId) {
        return {
          ...l,
          title: editLessonTitle,
          topic: editLessonTopic,
          duration: editLessonDuration,
          bullets: editLessonBullets,
          script: editLessonScript,
          status: editLessonStatus
        };
      }
      return l;
    });

    const updatedCourses = courses.map(c => {
      if (c.id === selectedCourseId) {
        return { ...c, lessons: updatedLessons };
      }
      return c;
    });

    setCourses(updatedCourses);
  };

  // Add new Course trigger
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const newCourseObj: Course = {
      id: "course-" + Date.now(),
      title: newCourseTitle,
      hoursSaved: newCourseHours,
      dollarsSaved: newCourseDollars,
      lessons: [
        {
          id: "lesson-temp-1",
          title: "Introduction Module Draft",
          topic: "Course overview and target system scaling",
          duration: 5,
          status: "Planning",
          bullets: "List your course intro coordinates.\nHow automation steps apply.\nSaving hours outlines.",
          script: ""
        }
      ]
    };

    const nextCourses = [...courses, newCourseObj];
    setCourses(nextCourses);
    setSelectedCourseId(newCourseObj.id);
    setSelectedLessonId("lesson-temp-1");
    setNewCourseTitle("");
    setShowAddCourseModal(false);
  };

  // Add new lesson inside active course
  const handleAddLesson = () => {
    if (!activeCourse) return;
    const newLessonObj: Lesson = {
      id: "lesson-" + Date.now(),
      title: "Untitled New Lesson Draft",
      topic: "System overview, tools, and outbound hooks",
      duration: 5,
      status: "Planning",
      bullets: "Key value metric 1\nKey value metric 2\nAutomated script action triggers",
      script: ""
    };

    const updatedLessons = [...activeCourse.lessons, newLessonObj];
    const updatedCourses = courses.map(c => {
      if (c.id === selectedCourseId) {
        return { ...c, lessons: updatedLessons };
      }
      return c;
    });

    setCourses(updatedCourses);
    setSelectedLessonId(newLessonObj.id);
  };

  // Remove lesson of active course
  const handleDeleteLesson = (lessonId: string) => {
    if (!activeCourse) return;
    const updatedLessons = activeCourse.lessons.filter(l => l.id !== lessonId);
    const updatedCourses = courses.map(c => {
      if (c.id === selectedCourseId) {
        return { ...c, lessons: updatedLessons };
      }
      return c;
    });

    setCourses(updatedCourses);
    if (selectedLessonId === lessonId && updatedLessons.length > 0) {
      setSelectedLessonId(updatedLessons[0].id);
    }
  };

  // Run AI Lesson script generation
  const handleGenerateScriptAI = async () => {
    if (!editLessonTitle.trim() || !editLessonTopic.trim()) {
      alert("Please provide at least a lesson title and a core focus topic for the AI to generate a script.");
      return;
    }

    setGeneratingScript(true);
    try {
      const response = await fetch("/api/generate-lesson-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editLessonTitle,
          topic: editLessonTopic,
          duration: editLessonDuration,
          bullets: editLessonBullets,
          brandVoice: voiceTonePrompt
        })
      });

      if (response.ok) {
        const data = await response.json();
        setEditLessonScript(data.script);
        
        // Save automatically in local state
        const updatedLessons = activeCourse!.lessons.map(l => {
          if (l.id === selectedLessonId) {
            return {
              ...l,
              title: editLessonTitle,
              topic: editLessonTopic,
              duration: editLessonDuration,
              bullets: editLessonBullets,
              script: data.script,
              status: "Scripted"
            };
          }
          return l;
        });
        const updatedCourses = courses.map(c => {
          if (c.id === selectedCourseId) {
            return { ...c, lessons: updatedLessons };
          }
          return c;
        });
        setCourses(updatedCourses);
        setEditLessonStatus("Scripted");
      } else {
        alert("Oops! Failed to reach course script generator endpoint.");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting the script generation node.");
    } finally {
      setGeneratingScript(false);
    }
  };

  // Trigger strategy consult questions
  const handleAskQuestion = async (customText?: string) => {
    const textToQuery = customText || question;
    if (!textToQuery.trim() || loading) return;

    const userMsg = { sender: "user" as const, text: textToQuery };
    setChatLog(prev => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("/api/academy-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: textToQuery })
      });

      if (response.ok) {
        const data = await response.json();
        setChatLog(prev => [...prev, { sender: "copilot", text: data.answer }]);
      } else {
        setChatLog(prev => [...prev, { sender: "copilot", text: "⚠️ Failed to reach the Co-pilot Node. Ensure your container has a valid network route." }]);
      }
    } catch (err) {
      console.error(err);
      setChatLog(prev => [...prev, { sender: "copilot", text: "❌ An unexpected error occurred. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  // Basic markdown parser
  const renderStyledText = (text: string) => {
    return text.split("\n\n").map((paragraph, pIdx) => {
      if (paragraph.startsWith("```")) {
        const code = paragraph.replace(/```[a-z]*\n?/g, "").replace(/```$/g, "");
        return (
          <div key={pIdx} className="my-4 bg-slate-950 border border-slate-805 p-4 rounded-xl font-mono text-xs text-amber-300 overflow-x-auto relative">
            <span className="absolute right-3 top-3.5 text-[8px] tracking-wider uppercase font-extrabold text-slate-500">System Code Node</span>
            <pre className="whitespace-pre">{code}</pre>
          </div>
        );
      }

      if (paragraph.startsWith("### ")) {
        return (
          <h4 key={pIdx} className="text-base font-bold text-white mt-5 mb-2 border-b border-slate-800 pb-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
            {paragraph.replace("### ", "")}
          </h4>
        );
      }
      if (paragraph.startsWith("#### ")) {
        return (
          <h5 key={pIdx} className="text-sm font-bold text-amber-400 mt-4 mb-2">
            {paragraph.replace("#### ", "")}
          </h5>
        );
      }
      if (paragraph.startsWith("##### ")) {
        return (
          <h6 key={pIdx} className="text-xs font-bold text-slate-300 mt-3 mb-1 uppercase tracking-wider font-mono">
            {paragraph.replace("##### ", "")}
          </h6>
        );
      }

      if (paragraph.startsWith("- ") || paragraph.startsWith("* ") || /^\d+\.\s/.test(paragraph)) {
        return (
          <ul key={pIdx} className="space-y-1.5 pl-5 list-disc text-xs text-slate-300 leading-relaxed my-2">
            {paragraph.split("\n").map((line, lIdx) => {
              const cleanLine = line.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "");
              const boldMatch = cleanLine.split("**");
              if (boldMatch.length > 2) {
                return (
                  <li key={lIdx}>
                    {boldMatch[0]}
                    <strong className="text-white font-semibold">{boldMatch[1]}</strong>
                    {boldMatch.slice(2).join("")}
                  </li>
                );
              }
              return <li key={lIdx}>{cleanLine}</li>;
            })}
          </ul>
        );
      }

      const parts = paragraph.split("**");
      if (parts.length > 2) {
        return (
          <p key={pIdx} className="text-xs text-slate-300 leading-relaxed font-sans my-2.5">
            {parts.map((part, index) => 
              index % 2 === 1 ? <strong key={index} className="text-amber-300 font-bold">{part}</strong> : part
            )}
          </p>
        );
      }

      return (
        <p key={pIdx} className="text-xs text-slate-300 leading-relaxed font-sans my-2.5">
          {paragraph}
        </p>
      );
    });
  };

  // Curricula CSV/Text Export downloader
  const handleExportCourse = () => {
    if (!activeCourse) return;
    let text = `========================================================\n`;
    text += `COURSE EXPORT: ${activeCourse.title}\n`;
    text += `Target weekly hours saved for students: ${activeCourse.hoursSaved} Hrs\n`;
    text += `Student Subscription savings target: $${activeCourse.dollarsSaved}.00\n`;
    text += `========================================================\n\n`;

    activeCourse.lessons.forEach((l, i) => {
      text += `LESSON ${i + 1}: ${l.title}\n`;
      text += `Focus Topic: ${l.topic}\n`;
      text += `Status: ${l.status}\n`;
      text += `Duration: ${l.duration} minutes\n\n`;
      text += `[Core Bullets Outline]\n${l.bullets}\n\n`;
      text += `[Script Teleprompter Output]\n${l.script || "None designed yet."}\n\n`;
      text += `--------------------------------------------------------\n\n`;
    });

    const file = new Blob([text], { type: "text/plain" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = `${activeCourse.title.replace(/\s+/g, "_")}_Curriculum.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div id="academy-blueprint-workspace" className="space-y-6">
      
      {/* Mega Hero Intro Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 border border-slate-800 p-6 md:p-8 space-y-4">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-mono text-[10px] font-black uppercase rounded-full tracking-wider shadow-lg">
                Verified Authority & Course Portal 👑
              </span>
              <span className="text-xs text-slate-500 font-mono">Systems Academy Launch Suite</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight animate-fade-in">
              CapyStack Course Academy
            </h2>
            <p className="text-xs text-slate-350 max-w-2xl leading-relaxed">
              Plan and outline your proprietary coaching courses, draft lesson scripts using smart digital speech models, deploy custom voice and video configurations, and consult our 24/7 strategic launch co-pilot!
            </p>
          </div>

          <div className="shrink-0 bg-slate-950 border border-slate-800 px-5 py-4 rounded-2xl flex items-center gap-3.5 shadow-xl">
            <div className="h-10 w-10 rounded-full bg-amber-950 flex items-center justify-center text-amber-400 font-black animate-pulse">
              10x
            </div>
            <div>
              <span className="block text-[9px] text-slate-500 font-mono uppercase">Scale Capacity</span>
              <span className="text-xs text-white font-extrabold font-mono">Active Course Engine</span>
            </div>
          </div>
        </div>

        {/* Dynamic Nav Sub-tabs for seamless workflow splits */}
        <div className="pt-2 border-t border-slate-900 flex gap-2">
          <button
            onClick={() => setActiveSubTab("copilot")}
            className={`px-4.5 py-2.5 rounded-xl font-semibold text-xs transition duration-200 flex items-center gap-2 ${
              activeSubTab === "copilot"
                ? "bg-slate-800 text-white shadow-xl border border-slate-700"
                : "bg-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-amber-450" />
            Strategic Co-pilot Suite
          </button>

          <button
            onClick={() => setActiveSubTab("creator")}
            className={`px-4.5 py-2.5 rounded-xl font-semibold text-xs transition duration-200 flex items-center gap-2 relative ${
              activeSubTab === "creator"
                ? "bg-slate-800 text-white shadow-xl border border-slate-700"
                : "bg-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Video className="h-3.5 w-3.5 text-cyan-450" />
            Interactive Course Creator & Film Planner
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500" />
          </button>
        </div>
      </div>

      {activeSubTab === "copilot" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          
          {/* Left Column - Practical Training Curriculums & Playbooks */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Real Integration-Focused AI Stack card */}
            <div className="bg-slate-900 border border-indigo-500/80 p-5 rounded-2xl space-y-3 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl rounded-full pointer-events-none" />
              <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase font-sans">
                <span className="text-amber-500">⚙️</span> Integrate Your AI Stack
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Seamlessly connect your own preferred AI automation accounts to CapyStack. Use our API & MCP integration nodes to connect your workflows using your existing credentials, ensuring complete control over your assets and usage.
              </p>
            </div>

            {/* Hour saved & sub calculator */}
            <div className="bg-slate-900/90 border border-slate-850 p-5 rounded-2xl space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-mono uppercase tracking-widest font-black text-white">Optimize Production &amp; Consolidate Overheads</h4>
                <Flame className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-[11px] text-slate-450 leading-relaxed">
                By packaging authority lessons and giving away this detailed blueprint guide as a lead magnet, you educate your clients first, then offer a seamless 7-Day trial of CapyStack to collapse subscription expenditures.
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex justify-between items-center text-xs font-mono font-bold">
                <span className="text-slate-500">Video Production Time Optimized:</span>
                <span className="text-emerald-400">15+ hours Saved</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 flex justify-between items-center text-xs font-mono font-bold">
                <span className="text-slate-500">Consolidated Subscriptions Value:</span>
                <span className="text-cyan-400">-$300.00 / mo</span>
              </div>
            </div>

            {/* Section 1: The Automation Pipeline Guide */}
            <div className="bg-slate-900/90 border border-slate-800 px-5 py-6 rounded-2xl space-y-4 shadow-xl">
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
                <Clock className="h-4.5 w-4.5 text-amber-400" />
                <span>Automating Asset Production Pipelines</span>
              </h3>

              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                Traditional content preparation involves expensive editing software and manual render pipelines. You can bypass this completely using CapyStack API webhooks to pipe text outputs into clones.
              </p>

              <div className="space-y-4 pt-2">
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded">
                    1. Audio Vocal Cloning
                  </span>
                  <p className="text-[11px] text-slate-450 leading-relaxed">
                    Upload 10 minutes of background-noise-free vocal capture to **ElevenLabs Instant Voice Cloning**. Retain the returned **Voice ID** to trigger conversational voice audio automatically.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded">
                    2. Mouth-Synced Avatars
                  </span>
                  <p className="text-[11px] text-slate-450 leading-relaxed">
                    Upload a 4-minute camera recording of yourself to **HeyGen Instant Avatar**. The HeyGen API will lip-sync your ElevenLabs audio onto your avatar, creating custom vertical reels automatically.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded">
                    3. Automated Subtitles
                  </span>
                  <p className="text-[11px] text-slate-450 leading-relaxed">
                    Route HeyGen outputs to webhooks like **n8n / Make.com** and overlay styled captions using a rendering engine such as **Remotion** to generate a finished daily short.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: MCP Connecting Protocol Walkthrough */}
            <div className="bg-slate-900/90 border border-slate-800 px-5 py-6 rounded-2xl space-y-4 shadow-xl">
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
                <Cpu className="h-4.5 w-4.5 text-cyan-400" />
                <span>Hooking APIs & MCP Servers</span>
              </h3>

              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                **Model Context Protocol (MCP)** bridges local tools with cloud APIs. You and your students can expose CapyStack's Lead Scraper, Scorecard, and Publisher to local AI assistants inside Claude Desktop or Cursor!
              </p>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-slate-300 space-y-2">
                <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">Configuring MCP (Claude Desktop)</span>
                <p className="text-xs leading-relaxed font-sans text-slate-400">
                  To link local LLM instances, add the following to your desktop configuration located at <code className="bg-slate-900 text-cyan-400 px-1 py-0.5 rounded font-mono text-[10px]">%APPDATA%/Claude/claude_desktop_config.json</code>:
                </p>
                <pre className="bg-slate-950 p-3 rounded border border-slate-850 text-emerald-400 text-[10px] overflow-auto whitespace-pre animate-pulse-subtle">
{`"capystack-mcp": {
  "command": "npx",
  "args": ["-y", "@capystack/mcp-node"],
  "env": {
    "API_KEY": "sk_capy_live_token",
    "URL": "https://capystack-ais.run.app"
  }
}`}
                </pre>
              </div>
            </div>

          </div>

          {/* Right Column - Interactive AI Consulting & Copilot Sandbox */}
          <div className="lg:col-span-7 space-y-6 flex flex-col h-full">
            
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 flex flex-col flex-grow space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
              
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Terminal className="h-4.5 w-4.5 text-amber-400" />
                    <span>Interactive Strategy Console</span>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Ask custom consulting questions regarding campaign parameters, video scripting sequences, or student launch templates.
                  </p>
                </div>

                <span className="shrink-0 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 font-mono px-3 py-1 rounded-full uppercase font-black tracking-wider">
                  Model: Gemini 2.5 Flash
                </span>
              </div>

              {/* Prompt Shortcuts / Quick Consult click triggers */}
              <div className="space-y-2">
                <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black">
                  Rapid Strategic Consult Shortcuts:
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleAskQuestion("Can I use my ElevenLabs voice and HeyGen video clones with CapyStack to save 10-20 hours a week?")}
                    className="text-left text-[11px] bg-slate-950 hover:bg-slate-850 p-2.5 rounded-xl border border-slate-850 hover:border-amber-500/40 text-slate-350 hover:text-white transition group relative"
                  >
                    <span className="block text-[9px] text-amber-405 font-mono mb-1 font-semibold">🎬 TIME-SAVER CLONES</span>
                    "Deploy my Voice and Video avatar clones inside CapyStack..."
                  </button>

                  <button
                    onClick={() => handleAskQuestion("How can I link custom webhooks, SDK APIs, and Model Context Protocol (MCP) clients to CapyStack?")}
                    className="text-left text-[11px] bg-slate-950 hover:bg-slate-850 p-2.5 rounded-xl border border-slate-850 hover:border-cyan-500/40 text-slate-350 hover:text-white transition group"
                  >
                    <span className="block text-[9px] text-cyan-405 font-mono mb-1 font-semibold">⚙️ API & MCP CONNECTORS</span>
                    "Connect MCP servers and n8n REST webhook nodes..."
                  </button>

                  <div
                    className="text-left text-[11px] bg-indigo-950/20 p-2.5 rounded-xl border border-indigo-900/40 text-slate-300 relative flex flex-col justify-between"
                  >
                    <div>
                      <span className="block text-[9px] text-indigo-400 font-mono mb-1 font-extrabold uppercase tracking-wider">🎁 Active Promo Trial Codes</span>
                      <p className="text-[10px] text-slate-400 leading-normal font-sans">
                        Activate your 7-day all-access trial using code: <strong className="text-white font-mono font-black select-all bg-indigo-950 border border-indigo-800 px-1 rounded">CAPYSTACK</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Console Log Console Panel */}
              <div className="flex-grow bg-slate-950 border border-slate-850 rounded-2xl p-4 h-[380px] overflow-y-auto space-y-4 shadow-inner relative">
                {chatLog.map((log, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${log.sender === "user" ? "justify-end animate-fade-in-right" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-4.5 text-xs select-text ${
                      log.sender === "user" 
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-semibold rounded-br-none shadow-md"
                        : "bg-slate-900 border border-slate-805 text-slate-200 rounded-bl-none shadow-lg"
                    }`}>
                      {log.sender === "copilot" ? (
                        <div className="space-y-2 prose-xs font-sans prose-invert select-text">
                          {renderStyledText(log.text)}
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap font-sans font-semibold leading-relaxed">{log.text}</p>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start items-center gap-3 bg-slate-900 border border-slate-805 p-4 rounded-2xl max-w-[80%] rounded-bl-none animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin text-amber-400 shrink-0" />
                    <span className="text-[11px] text-slate-400 font-mono tracking-widest uppercase">Consulting AI Knowledge Node...</span>
                  </div>
                )}
              </div>

              {/* Action Bar Input Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskQuestion();
                }}
                className="flex gap-2 bg-slate-950 border border-slate-850 p-2 rounded-2xl shadow-xl shrink-0"
              >
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask custom question: e.g. How do I setup premium Stripe billing?"
                  className="flex-grow bg-transparent text-xs border-none outline-none focus:ring-0 text-white pl-3 text-slate-200 placeholder-slate-500 font-sans"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black p-3.5 rounded-xl transition flex items-center justify-center shrink-0 shadow-lg"
                >
                  {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin text-slate-950" /> : <Send className="h-4.5 w-4.5 text-slate-950" />}
                </button>
              </form>

            </div>

          </div>

        </div>
      ) : (
        /* ==================== 🎬 DYNAMIC COURSE CREATOR TAB ==================== */
        <div className="space-y-6 animate-fade-in">
          
          {/* Top Courses Select & Configuration Header */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
            
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-slate-400 font-semibold uppercase">Active Custom Course:</span>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-amber-400 shadow-md"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>

              <button
                onClick={() => setShowAddCourseModal(true)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold px-3 py-2 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5 text-amber-450" />
                Create New Course
              </button>
            </div>

            {activeCourse && (
              <div className="flex flex-wrap gap-4 text-xs font-mono">
                <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-900 flex items-center gap-2">
                  <span className="text-slate-500">Hours Saved:</span>
                  <input
                    type="number"
                    value={activeCourse.hoursSaved}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setCourses(courses.map(c => c.id === selectedCourseId ? { ...c, hoursSaved: val } : c));
                    }}
                    className="w-10 bg-transparent text-amber-400 font-bold border-none p-0 outline-none focus:ring-0 text-center"
                  />
                  <span className="text-slate-500">hrs</span>
                </div>

                <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-900 flex items-center gap-2">
                  <span className="text-slate-500">Subscription Cash Saved:</span>
                  <span className="text-cyan-400">$</span>
                  <input
                    type="number"
                    value={activeCourse.dollarsSaved}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setCourses(courses.map(c => c.id === selectedCourseId ? { ...c, dollarsSaved: val } : c));
                    }}
                    className="w-12 bg-transparent text-cyan-400 font-bold border-none p-0 outline-none focus:ring-0 text-center"
                  />
                </div>

                <button
                  onClick={handleExportCourse}
                  className="bg-gradient-to-r from-cyan-950 to-slate-950 border border-cyan-800 text-cyan-300 font-bold px-3 py-2 rounded-xl transition hover:opacity-90 flex items-center gap-1.5"
                  title="Export complete course script guides into organized TXT curriculum"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export Blueprint
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Box: Lessons Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
                
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                      Course Lessons
                    </h3>
                    <p className="text-[10px] text-slate-500 font-sans">
                      Outline modules you plan to film or generate speaking scripts for.
                    </p>
                  </div>

                  <button
                    onClick={handleAddLesson}
                    className="p-2 bg-slate-950 hover:bg-slate-850 rounded-xl border border-slate-800/80 text-amber-450 hover:text-white transition shadow"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Lessons list display selector */}
                {activeCourse && activeCourse.lessons.length > 0 ? (
                  <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                    {activeCourse.lessons.map((lesson, idx) => {
                      const isSelected = lesson.id === selectedLessonId;
                      let statusBadge = "bg-slate-950 text-slate-500 border border-slate-900";
                      if (lesson.status === "Scripted") statusBadge = "bg-indigo-950 text-indigo-400 border border-indigo-900/50";
                      if (lesson.status === "Filmed") statusBadge = "bg-amber-950 text-amber-400 border border-amber-900/50";
                      if (lesson.status === "Published") statusBadge = "bg-emerald-950 text-emerald-400 border border-emerald-900/50";

                      return (
                        <div
                          key={lesson.id}
                          className={`p-3.5 rounded-xl border transition duration-200 text-left relative group ${
                            isSelected
                              ? "bg-gradient-to-r from-slate-950 to-slate-900 border-amber-500/40 shadow-md"
                              : "bg-slate-950/40 border-slate-850 hover:border-slate-800 hover:bg-slate-900/50"
                          }`}
                        >
                          <div 
                            onClick={() => setSelectedLessonId(lesson.id)}
                            className="space-y-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-550 font-mono font-bold">L{idx + 1}</span>
                              <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${statusBadge}`}>
                                {lesson.status}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono ml-auto">
                                {lesson.duration}m
                              </span>
                            </div>

                            <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-405 line-clamp-1">
                              {lesson.title || "Untitled Lesson"}
                            </h4>
                            <p className="text-[10px] text-slate-500 line-clamp-1">
                              {lesson.topic || "Explain parameters & target pipelines"}
                            </p>
                          </div>

                          {/* Quick delete selector */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Sure you want to delete lesson: ${lesson.title}?`)) {
                                handleDeleteLesson(lesson.id);
                              }
                            }}
                            className="absolute right-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-950/50 text-slate-500 hover:text-rose-450 rounded transition duration-150"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-950/40 border border-slate-900 rounded-xl space-y-2">
                    <p className="text-xs text-slate-550 font-sans">No lessons delineated yet in this course folder.</p>
                    <button
                      onClick={handleAddLesson}
                      className="text-[11px] underline text-amber-500"
                    >
                      Click to initialize Lesson 1
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Box: Lesson Editor & AI Script Architect */}
            <div className="lg:col-span-8">
              {activeCourse && selectedLessonId ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />
                  
                  {/* Editor Header Settings */}
                  <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-slate-950 text-slate-400 font-mono px-2 py-0.5 rounded-lg border border-slate-850">
                          Active Lesson Node Scripting Panel
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {selectedLessonId}</span>
                      </div>
                      <h3 className="text-base font-black text-white">
                        Curriculum Details & Clonic Script Writer
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-slate-500">Workflow Status:</span>
                      <select
                        value={editLessonStatus}
                        onChange={(e) => {
                          setEditLessonStatus(e.target.value as any);
                          // Sync immediately on focus change
                          setCourses(courses.map(c => c.id === selectedCourseId ? {
                            ...c,
                            lessons: c.lessons.map(l => l.id === selectedLessonId ? { ...l, status: e.target.value as any } : l)
                          } : c));
                        }}
                        className="bg-slate-950 text-amber-450 border border-slate-800/80 px-2.5 py-1.5 rounded-lg font-bold"
                      >
                        <option value="Planning">Planning</option>
                        <option value="Scripted">Scripted</option>
                        <option value="Filmed">Filmed</option>
                        <option value="Published">Published</option>
                      </select>
                    </div>
                  </div>

                  {/* Input Fields Layout Container Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-500 font-mono uppercase font-black">Lesson Module Title</label>
                      <input
                        type="text"
                        value={editLessonTitle}
                        onChange={(e) => setEditLessonTitle(e.target.value)}
                        className="bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400 w-full"
                        placeholder="e.g. Setting up Clonic Video Pipelines"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-500 font-mono uppercase font-black">Core Subject Focus Topic</label>
                      <input
                        type="text"
                        value={editLessonTopic}
                        onChange={(e) => setEditLessonTopic(e.target.value)}
                        className="bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400 w-full"
                        placeholder="e.g. ElevenLabs Instant Voice + HeyGen lip positions"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="space-y-1.5 md:col-span-3">
                      <label className="block text-[10px] text-slate-500 font-mono uppercase font-black">Video Target Minutes</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={editLessonDuration}
                        onChange={(e) => setEditLessonDuration(parseInt(e.target.value) || 3)}
                        className="bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400 w-full text-center"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-9">
                      <label className="block text-[10px] text-slate-500 font-mono uppercase font-black">Bullet Outlines / Core Lesson Points (One per line)</label>
                      <textarea
                        rows={3}
                        value={editLessonBullets}
                        onChange={(e) => setEditLessonBullets(e.target.value)}
                        className="bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-white outline-none focus:border-amber-400 w-full font-sans leading-relaxed"
                        placeholder="Why manual recorded media triggers massive business leaks&#10;How HeyGen creates instant 4K mouth syncs Programmatically&#10;Connecting API triggers"
                      />
                    </div>
                  </div>

                  {/* AI Script Architect Tool Suite Block */}
                  <div className="border border-indigo-950 bg-slate-950/50 p-4.5 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-850">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-205">AI Digital Speech Writer Nodes</h4>
                          <p className="text-[10px] text-slate-500">Translates outlines into pristine voice recordings formatted with HeyGen camera triggers.</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateScriptAI}
                        disabled={generatingScript}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-450 hover:to-orange-450 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 shadow-lg"
                      >
                        {generatingScript ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Formatting speech...
                          </>
                        ) : (
                          <>
                            <Tv className="h-3.5 w-3.5" />
                            Generate Clonic Script 🪄
                          </>
                        )}
                      </button>
                    </div>

                    {/* Custom Voice Settings input fields block */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                      <div>
                        <label className="block text-[9px] text-slate-550 font-mono uppercase mb-1">Speaker voice tone prompt bias:</label>
                        <input
                          type="text"
                          value={voiceTonePrompt}
                          onChange={(e) => setVoiceTonePrompt(e.target.value)}
                          className="bg-slate-950 border border-slate-900 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 w-full"
                          placeholder="Educator systems authority, high-ticket, low verbal gaps"
                        />
                      </div>
                      <div className="flex items-center gap-4 bg-slate-950/80 p-2.5 rounded-xl border border-slate-900">
                        <Volume2 className="h-4 w-4 text-indigo-400 shrink-0" />
                        <div className="flex-grow space-y-1">
                          <div className="flex justify-between text-[9px] font-mono text-slate-500">
                            <span>Clarity Bias (ElevenLabs)</span>
                            <span>85%</span>
                          </div>
                          <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-[85%]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual script output & teleprompter dashboard */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase">
                      <span>🎬 Teleprompter Speaking Script output</span>
                      <span>Markdown Ready</span>
                    </div>

                    <textarea
                      rows={12}
                      value={editLessonScript}
                      onChange={(e) => setEditLessonScript(e.target.value)}
                      className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-xs text-slate-200 outline-none focus:border-cyan-400 w-full font-mono leading-relaxed"
                      placeholder="### Clonic Video Script: ...&#10;&#10;Write out your custom teleprompter script, or click 'Generate Clonic Script' above to optimize using Gemini's world-class media director agent automatically."
                    />
                  </div>

                  {/* Action Confirmation buttons */}
                  <div className="pt-2 border-t border-slate-800 flex justify-between gap-3">
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Changes are securely persisted to local database containers automatically.
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        handleSaveLessonChanges();
                        alert("Lesson blueprint adjustments securely locked to your Active Course catalog!");
                      }}
                      className="bg-slate-950 hover:bg-slate-850 text-white font-bold text-xs px-5 py-2.5 rounded-xl border border-slate-800 transition shadow"
                    >
                      Save Lesson Blueprint Changes
                    </button>
                  </div>

                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-802 p-12 rounded-3xl text-center space-y-4">
                  <BookOpen className="h-12 w-12 text-slate-650 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-200">No active lesson selected</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Select or add a modular workflow catalog lesson on the left to review script prompts, map media, and run AI speech calibration modules.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Core instruction panel card */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 font-mono">STEP 1: OUTLINE TOPICS</span>
              <p className="text-[11px] text-slate-400leading-relaxed leading-normal">
                Map out lesson titles and focused takeaways matching your students' technical scale arrays. Determine weekly saved hours metrics.
              </p>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-bold text-cyan-400 font-mono">STEP 2: RENDER TRANSCRIPTS</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Click the Generate button to optimize outlines. The model produces teleprompter readings injected with dynamic camera cues for HeyGen lipsync tracks.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-rose-450 font-mono">STEP 3: EXPORT BLUEPRINTS</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Export files cleanly or download course curricula to provide premium buyers or training cohorts as a high-value onboarding giveaway.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* CREATE NEW COURSE MODAL VIEW SCREEN */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCourse}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative select-none animate-fade-in-up"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                Create Custom Course
              </h4>
              <button
                type="button"
                onClick={() => setShowAddCourseModal(false)}
                className="text-slate-500 hover:text-white font-mono text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="space-y-1.5">
                <label className="block text-[10px] text-slate-400 uppercase font-mono">Course Title / Curriculum Name</label>
                <input
                  type="text"
                  required
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3 w-full text-white outline-none focus:border-amber-400"
                  placeholder="e.g. n8n Node Masters Course"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase font-mono">Time Saved (Hrs / Wk)</label>
                  <input
                    type="number"
                    min="1"
                    value={newCourseHours}
                    onChange={(e) => setNewCourseHours(parseInt(e.target.value) || 10)}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3 w-full text-white outline-none text-center"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase font-mono">Tool cost saved ($ / mo)</label>
                  <input
                    type="number"
                    min="1"
                    value={newCourseDollars}
                    onChange={(e) => setNewCourseDollars(parseInt(e.target.value) || 300)}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3 w-full text-white outline-none text-center"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs p-3.5 rounded-xl w-full transition shadow-lg shrink-0"
            >
              Add Course Curriculum
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
