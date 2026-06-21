import React, { useState } from "react";
import { Terminal, Copy, Check, ExternalLink, HelpCircle, Code, Layers, Share2, Shield, Settings, Sliders, Play, PlayCircle, Cpu, Zap } from "lucide-react";

export default function DeveloperCenterTab() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (sectionId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const makePayloadExample = `{
  "userId": "usr_9921",
  "brandName": "CapyStack Coaching",
  "textInput": "Learn to scale systems using automated webhook pipelines.",
  "channelTargets": ["TwitterX", "LinkedIn", "Medium"],
  "syncColorCode": "#10B981"
}`;

  const n8nWorkflowExample = `{
  "meta": {
    "instanceId": "capystack_n8n_instance_8829"
  },
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "capystack-webhook-bridge",
        "options": {}
      },
      "id": "node-webhook-listener",
      "name": "Webhook Listener Node",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.elevenlabs.io/v1/text-to-speech/voice-id-here",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            { "name": "xi-api-key", "value": "={{$env.ELEVENLABS_API_KEY}}" }
          ]
        },
        "sendBody": true,
        "contentType": "json",
        "bodyParameters": {
          "parameters": [
            { "name": "text", "value": "={{$json.body.textInput}}" }
          ]
        }
      },
      "id": "node-elevenlabs-voiceover",
      "name": "ElevenLabs TTS Speech Call",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [450, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.heygen.com/v2/avatar/generate",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            { "name": "X-Api-Key", "value": "={{$env.HEYGEN_API_KEY}}" }
          ]
        },
        "sendBody": true,
        "contentType": "json",
        "bodyParameters": {
          "parameters": [
            { "name": "video_title", "value": "CapyStack Auto Reel" },
            { "name": "avatar_id", "value": "capystack-custom-avatar-id" },
            { "name": "audio_url", "value": "={{$json.body.audioUrl}}" }
          ]
        }
      },
      "id": "node-heygen-avatar",
      "name": "HeyGen Lipsync Video Engine",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [650, 300]
    }
  ],
  "connections": {
    "Webhook Listener Node": {
      "main": [
        [ { "node": "ElevenLabs TTS Speech Call", "type": "main", "index": 0 } ]
      ]
    },
    "ElevenLabs TTS Speech Call": {
      "main": [
        [ { "node": "HeyGen Lipsync Video Engine", "type": "main", "index": 0 } ]
      ]
    }
  }
}`;

  const activepiecesExample = `// Activepieces Brand Code Step Parser
export const codeStep = async (inputs) => {
  const capystackData = inputs.webhookBody;
  
  // Format target output structure for multi-posting channels
  return {
    postTitle: \`⚡ Authority System Scale | \${capystackData.brandName}\`,
    speechBody: capystackData.textInput,
    channels: capystackData.channelTargets,
    syndicationHex: capystackData.syncColorCode || "#10B981",
    timestamp: new Date().toISOString()
  };
};`;

  const mcpSchemaExample = `{
  "mcpVersion": "1.0.0",
  "name": "capystack-mcp-ai-server",
  "description": "Automated SEO/GEO citation analyzer, omni-social publisher, and local target lead prospect harvester",
  "tools": [
    {
      "name": "score_geo_content",
      "description": "Grades how likely an article is to obtain references and citations inside Gemini search models",
      "inputSchema": {
        "type": "object",
        "properties": {
          "content": { "type": "string", "description": "Raw text content to analyze and optimize" }
        },
        "required": ["content"]
      }
    },
    {
      "name": "scrape_maps_leads",
      "description": "Harvests active small business maps records along with target social coordinates",
      "inputSchema": {
        "type": "object",
        "properties": {
          "city": { "type": "string", "description": "Target geographic city" },
          "niche": { "type": "string", "description": "Business vertical (e.g. plumber, dentist, realtor)" }
        },
        "required": ["city", "niche"]
      }
    }
  ]
}`;

  const claudeDesktopConfig = `{
  "mcpServers": {
    "capystack-tools-node": {
      "command": "npx",
      "args": ["-y", "@capystack/mcp-server"],
      "env": {
        "CAPYSTACK_API_KEY": "sk_capy_live_your_token_here",
        "CAPYSTACK_SERVER_URL": "https://ais-dev-h66labxtxydwsep5z5o4tn-397474250777.us-west1.run.app"
      }
    }
  }
}`;

  return (
    <div id="developer-center-tab" className="space-y-6">
      {/* Page Title Header */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>⚙️</span> Developer API, n8n, Activepieces & MCP Protocols
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Supercharge your brand automation. Connect ready-made Make.com payload listeners, load n8n workflows, deploy custom code steps inside Activepieces, or mount Model Context Protocol (MCP) server endpoints into tools like Claude Desktop or personal coding agents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Integration blueprints */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* n8n Workflow JSON */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                n8n Workflow Integration Flow Blueprint
              </h3>
              <button
                onClick={() => handleCopy("n8n", n8nWorkflowExample)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800"
              >
                {copiedSection === "n8n" ? (
                  <span className="text-emerald-400 font-bold">✓ Copied Code</span>
                ) : (
                  <span>Copy n8n Node JSON</span>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              To trigger daily automated speech vocal recordings and lipsync video files, copy and paste this pre-engineered <strong>n8n workspace connection pipeline</strong> directly into your n8n workflows.
            </p>

            <div className="p-4 bg-slate-950 rounded-xl space-y-3">
              <span className="block text-[10px] font-mono text-slate-500 uppercase">n8n HttpRequest & Webhook JSON Schema</span>
              <pre className="text-xs text-amber-300 overflow-auto font-mono max-h-44">{n8nWorkflowExample}</pre>
            </div>

            <div className="bg-amber-950/20 border border-amber-900/30 p-3 rounded-xl text-xs text-amber-400/90 leading-normal">
              <strong>n8n Setup:</strong> Paste this directly onto your n8n canvas using CMD+V. Set up variables for <code className="bg-slate-900 text-white px-1 font-mono">ELEVENLABS_API_KEY</code> and <code className="bg-slate-900 text-white px-1 font-mono">HEYGEN_API_KEY</code> to enable hands-free dynamic audio/video rendering.
            </div>
          </div>

          {/* Activepieces Flow Script */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-pink-400" />
                Activepieces Webhook & Custom Code Step
              </h3>
              <button
                onClick={() => handleCopy("activepieces", activepiecesExample)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800"
              >
                {copiedSection === "activepieces" ? (
                  <span className="text-emerald-400 font-bold">✓ Copied Code</span>
                ) : (
                  <span>Copy Code Step</span>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              For setups using <strong>Activepieces</strong>, route the CapyStack webhook through a custom JavaScript Code module first to format elements prior to syndicating across social streams.
            </p>

            <div className="p-4 bg-slate-950 rounded-xl">
              <span className="block text-[10px] font-mono text-slate-500 uppercase">activepieces-parser-step.js</span>
              <pre className="text-xs text-pink-300 overflow-auto font-mono max-h-36 mt-2">{activepiecesExample}</pre>
            </div>
          </div>

          {/* Model Context Protocol (MCP) Section */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-400" />
                Model Context Protocol (MCP) Schema & Setup
              </h3>
              <button
                onClick={() => handleCopy("mcp", mcpSchemaExample)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800"
              >
                {copiedSection === "mcp" ? (
                  <span className="text-emerald-400 font-bold">✓ Copied Manifest</span>
                ) : (
                  <span>Copy Manifest</span>
                )}
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Integrate this suite directly into custom developer terminal tools (such as <strong>Claude Code</strong> or <strong>Claude Desktop</strong>). By mounting this MCP JSON-RPC Server metadata profile, AI agents can inspect competitor stats, score citations, and look for leads on autopilot right inside your command-line terminal workspace.
            </p>

            <div className="p-4 bg-slate-950 rounded-xl space-y-4">
              <div>
                <span className="block text-[10px] font-mono text-slate-500 uppercase">mcp-server-manifest.json</span>
                <pre className="text-xs text-indigo-300 overflow-auto font-mono max-h-44 mt-2">{mcpSchemaExample}</pre>
              </div>

              <div className="border-t border-slate-900 pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">Claude Desktop config: %APPDATA%/Claude/claude_desktop_config.json</span>
                  <button
                    onClick={() => handleCopy("mcp_config", claudeDesktopConfig)}
                    className="text-[9px] text-indigo-400 hover:text-indigo-300"
                  >
                    {copiedSection === "mcp_config" ? "Copied Config!" : "Copy config block"}
                  </button>
                </div>
                <pre className="text-[11px] text-emerald-400 overflow-auto font-mono max-h-36 bg-slate-950 p-3 rounded-lg border border-slate-850">{claudeDesktopConfig}</pre>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Interactive API Blueprint / Swagger-style panel */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Make.com Container */}
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold uppercase text-slate-450 tracking-widest">Incoming Listener Webhook</span>
              <button
                onClick={() => handleCopy("make_payload", makePayloadExample)}
                className="text-[10px] text-cyan-400"
              >
                {copiedSection === "make_payload" ? "Copied" : "Copy Payload"}
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-normal font-sans">
              Send CapyStack copy variables into your designated inbound webhook channels on Make/Activepieces using this JSON structure:
            </p>
            <pre className="bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-[11px] text-cyan-300 max-h-36 overflow-auto">{makePayloadExample}</pre>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
              Production Router Registry
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Deploying on custom hardware or a digital private server? These endpoints are bound and fully active in our back-end server layer:
            </p>

            <div className="space-y-3.5">
              
              {/* Endpoint 1 */}
              <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded-md font-mono font-bold">POST</span>
                  <span className="text-[11px] text-slate-350 font-mono">/api/extract-brand</span>
                </div>
                <p className="text-[10px] text-slate-500">Extract brand voice parameters and accents from raw bios in 1 click.</p>
              </div>

              {/* Endpoint 2 */}
              <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded-md font-mono font-bold">POST</span>
                  <span className="text-[11px] text-slate-350 font-mono">/api/repurpose-content</span>
                </div>
                <p className="text-[10px] text-slate-500">Formulates LinkedIn longforms, X threads, and Claude Code scripts with voice conformity.</p>
              </div>

              {/* Endpoint 3 */}
              <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded-md font-mono font-bold">POST</span>
                  <span className="text-[11px] text-slate-350 font-mono">/api/generate-website</span>
                </div>
                <p className="text-[10px] text-slate-500">Builds fully customizable responsive landing page website models dynamically.</p>
              </div>

              {/* Endpoint 4 */}
              <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded-md font-mono font-bold">POST</span>
                  <span className="text-[11px] text-slate-350 font-mono">/api/scrape-leads</span>
                </div>
                <p className="text-[10px] text-slate-500">Scrapes social listener feeds to isolate client opportunities with curated pitches.</p>
              </div>

              {/* Endpoint 5 */}
              <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded-md font-mono font-bold">POST</span>
                  <span className="text-[11px] text-slate-350 font-mono">/api/academy-copilot</span>
                </div>
                <p className="text-[10px] text-slate-500">Powers real-time custom training consult guides for coaching programs.</p>
              </div>

            </div>

            {/* Micro sandbox notice */}
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5 text-center">
              <Shield className="h-4 w-4 text-emerald-400 mx-auto" />
              <span className="block text-[10px] font-mono text-slate-400 font-bold uppercase">Sandbox Security Enabled</span>
              <p className="text-[9px] text-slate-500 leading-normal">
                Credentials are secure. All outbound webhook requests from the server support standard HMAC signature verification tags.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
