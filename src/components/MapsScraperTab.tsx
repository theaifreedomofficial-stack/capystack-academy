import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  Search, 
  Loader2, 
  Bookmark, 
  Star, 
  Phone, 
  Globe, 
  Mail, 
  Download, 
  History, 
  Copy, 
  Check, 
  Trash2, 
  ExternalLink, 
  HelpCircle,
  Sparkles,
  Layers,
  Send,
  Navigation
} from "lucide-react";
import { GoogleMapsLead, MapsScrapeHistory } from "../types";

export default function MapsScraperTab() {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  
  const [leads, setLeads] = useState<GoogleMapsLead[]>([]);
  const [bookmarks, setBookmarks] = useState<GoogleMapsLead[]>(() => {
    const cached = localStorage.getItem("deepreach_maps_bookmarks");
    return cached ? JSON.parse(cached) : [];
  });
  const [history, setHistory] = useState<MapsScrapeHistory[]>(() => {
    const cached = localStorage.getItem("deepreach_maps_history");
    return cached ? JSON.parse(cached) : [
      { id: "hist_1", timestamp: "2026-06-18 14:20", keyword: "plumber", city: "Atlanta", state: "GA", resultsCount: 8 },
      { id: "hist_2", timestamp: "2026-06-18 16:45", keyword: "dental clinic", city: "Dallas", state: "TX", resultsCount: 10 }
    ];
  });

  const [copiedLeadId, setCopiedLeadId] = useState<string | null>(null);
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"results" | "bookmarks">("results");

  useEffect(() => {
    localStorage.setItem("deepreach_maps_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("deepreach_maps_history", JSON.stringify(history));
  }, [history]);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || !city.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/scrape-maps-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: keyword.trim(),
          city: city.trim(),
          state: stateCode.trim().toUpperCase() || "US",
          limit: limit
        })
      });

      if (response.ok) {
        const data: GoogleMapsLead[] = await response.json();
        setLeads(data);
        setActiveSubTab("results");

        // Add to history list
        const newQuery: MapsScrapeHistory = {
          id: `hist_${Date.now()}`,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
          keyword: keyword.trim(),
          city: city.trim(),
          state: stateCode.toUpperCase() || "US",
          resultsCount: data.length
        };
        setHistory(prev => [newQuery, ...prev.slice(0, 9)]);
      }
    } catch (err) {
      console.error("Maps Scraping error:", err);
    } finally {
      setLoading(false);
    }
  };

  const reRunQuery = (hist: MapsScrapeHistory) => {
    setKeyword(hist.keyword);
    setCity(hist.city);
    setStateCode(hist.state);
    // Auto click trigger simulated
    setTimeout(() => {
      const form = document.getElementById("maps-scraper-form") as HTMLFormElement;
      if (form) form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }, 100);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleBookmarkToggle = (lead: GoogleMapsLead) => {
    const isBookmarked = bookmarks.some(b => b.id === lead.id);
    if (isBookmarked) {
      setBookmarks(prev => prev.filter(b => b.id !== lead.id));
    } else {
      setBookmarks(prev => [...prev, lead]);
    }
  };

  const handleCopyPhone = (leadId: string, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedLeadId(leadId);
    setTimeout(() => setCopiedLeadId(null), 2000);
  };

  const handleCopyEmail = (leadId: string, email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmailId(leadId);
    setTimeout(() => setCopiedEmailId(null), 2000);
  };

  const exportCSV = (targetLeads: GoogleMapsLead[]) => {
    if (targetLeads.length === 0) return;
    const headers = ["Business Name", "Phone", "Email", "Website", "Address", "Google Rating (Stars)", "Reviews Count"];
    const rows = targetLeads.map(l => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.website}"`,
      `"${l.address.replace(/"/g, '""')}"`,
      l.stars,
      l.reviewsCount
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Maps_Prospects_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter leads based on live search term
  const activeSources = activeSubTab === "results" ? leads : bookmarks;
  const filteredLeads = activeSources.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="google-maps-prospector-tab" className="space-y-6">
      
      {/* Introduction banner */}
      <div className="bg-gradient-to-r from-teal-950/40 via-slate-900/40 to-sky-950/40 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="relative space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded uppercase font-mono font-bold">
              Mike Futia Blueprint
            </span>
            <span className="text-xs text-sky-400 font-mono tracking-widest font-semibold uppercase">
              VIBE-CODED Claude Maps Extraction Node
            </span>
          </div>
          <h2 className="text-xl font-black text-white">
            📍 Google Maps Lead Gen Prospecting Scraper
          </h2>
          <p className="text-sm text-slate-450 max-w-3xl leading-relaxed">
            Eliminate the laborious manual grind of searching Google Maps, clicking listings, and copy-pasting numbers. Input a target business type, specify your target town or city, and fetch high-intent local agencies, plumbers, dentists, or realtors in seconds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Parameters and Scraper Search query */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Navigation className="h-4 w-4 text-emerald-400" />
              Scrape Parameters
            </h3>

            <form id="maps-scraper-form" onSubmit={handleScrape} className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Business Type (Keyword)</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. plumber, dentist, realtor"
                  className="w-full text-xs rounded-xl bg-slate-950 border border-slate-800 p-3 text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-semibold font-sans">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Dallas, Orlando"
                    className="w-full text-xs rounded-xl bg-slate-950 border border-slate-800 p-3 text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-semibold">State Code</label>
                  <input
                    type="text"
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    placeholder="e.g. TX, FL"
                    className="w-full text-xs rounded-xl bg-slate-950 border border-slate-800 p-3 text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-semibold flex justify-between">
                  <span>List Max Results Limit</span>
                  <span className="font-mono text-cyan-400 font-bold">{limit} listings</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black text-xs py-3.5 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                    <span>Pulling Maps Listings...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Run Claude Code Scraper</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Search History widget block */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <History className="h-3.5 w-3.5 text-slate-400" />
                History tracker
              </h4>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-[10px] text-slate-500 hover:text-rose-450 hover:underline font-mono"
                >
                  Clear all
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <span className="text-xs text-slate-600 block text-center py-2 italic">No past searches yet.</span>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                {history.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => reRunQuery(h)}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 hover:border-emerald-800/40 transition-all text-left text-xs cursor-pointer group flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <span className="block font-bold text-slate-350 capitalize group-hover:text-emerald-400 transition">
                        {h.keyword}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {h.city}, {h.state} • {h.resultsCount} leads
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-550 shrink-0 font-mono font-semibold">{h.timestamp.split(" ")[1]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right column: Results interactive tables & bookmark logs */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          {/* Header tabs switcher inside right grid panel */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-900 border border-slate-800 p-3.5 rounded-xl gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSubTab("results")}
                className={`text-xs px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 transition ${
                  activeSubTab === "results" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Active Scrape Results ({leads.length})</span>
              </button>

              <button
                onClick={() => setActiveSubTab("bookmarks")}
                className={`text-xs px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 transition ${
                  activeSubTab === "bookmarks" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Bookmark className="h-3.5 w-3.5 text-yellow-500" />
                <span>Bookmarked Leads ({bookmarks.length})</span>
              </button>
            </div>

            {activeSources.length > 0 && (
              <button
                onClick={() => exportCSV(activeSources)}
                className="text-xs bg-slate-950 hover:bg-slate-850 text-slate-300 font-bold px-3.5 py-2 rounded-lg border border-slate-800 flex items-center gap-2 transition"
                title="Download spreadsheet"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export as CSV</span>
              </button>
            )}
          </div>

          {/* Filtering Search Bar */}
          {activeSources.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search listings by business name or zip code address..."
                className="w-full text-xs bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          {/* Core Content View */}
          <div className="flex-1 min-h-[460px]">
            {filteredLeads.length === 0 ? (
              <div className="h-full bg-slate-950/20 border border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center min-h-[460px]">
                <MapPin className="h-12 w-12 text-slate-650 mb-3 animate-pulse" />
                <h4 className="text-sm font-semibold text-slate-300">
                  {searchTerm ? "Search Filter Returned Nothing" : "No Maps Scraper Results"}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto">
                  {searchTerm 
                    ? "Try erasing some characters or searching for simple matches." 
                    : "Use the Scrape Parameters panel on the left to input target categories and trigger the extraction pipeline."
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLeads.map((lead) => {
                  const isSaved = bookmarks.some(b => b.id === lead.id);
                  return (
                    <div 
                      key={lead.id} 
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 hover:bg-slate-900/80 transition duration-300 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        {/* Title and Save button */}
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-extrabold text-white leading-snug">{lead.name}</h4>
                          <button
                            onClick={() => handleBookmarkToggle(lead)}
                            className={`p-1.5 rounded-lg border transition ${
                              isSaved 
                                ? "bg-amber-950/40 text-amber-400 border-amber-900/40" 
                                : "bg-slate-950 text-slate-400 border-slate-850 hover:border-slate-800"
                            }`}
                            title={isSaved ? "Remove from saved bookmarked" : "Save bookmark"}
                          >
                            <Bookmark className="h-3.5 w-3.5 fill-current" />
                          </button>
                        </div>

                        {/* Stars and address info */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center text-amber-400">
                            {[...Array(5)].map((_, idx) => (
                              <Star 
                                key={idx} 
                                className={`h-3 w-3 ${idx < Math.floor(lead.stars) ? 'fill-current' : 'opacity-20'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold font-mono text-amber-400">{lead.stars}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({lead.reviewsCount} organic reviews)</span>
                        </div>

                        <p className="text-[11px] text-slate-400 font-sans flex items-start gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                          <span>{lead.address}</span>
                        </p>
                      </div>

                      {/* Contact capabilities and action links */}
                      <div className="bg-slate-950 rounded-xl p-3 space-y-2 text-xs">
                        
                        {/* Phone */}
                        <div className="flex items-center justify-between text-slate-350">
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-slate-500" />
                            <span>{lead.phone}</span>
                          </div>
                          <button
                            onClick={() => handleCopyPhone(lead.id, lead.phone)}
                            className="text-[10px] text-indigo-400 hover:underline font-mono"
                          >
                            {copiedLeadId === lead.id ? "Copied!" : "Copy Number"}
                          </button>
                        </div>

                        {/* Email */}
                        <div className="flex items-center justify-between text-slate-350">
                          <div className="flex items-center gap-1.5 truncate pr-2">
                            <Mail className="h-3 w-3 text-slate-500 shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                          <button
                            onClick={() => handleCopyEmail(lead.id, lead.email)}
                            className="text-[10px] text-indigo-400 hover:underline font-mono"
                          >
                            {copiedEmailId === lead.id ? "Copied!" : "Copy Email"}
                          </button>
                        </div>

                        {/* Website URL link */}
                        <div className="flex items-center justify-between text-slate-350 pt-1 border-t border-slate-900">
                          <span className="text-[10px] text-slate-500 font-mono">Website URL:</span>
                          <a 
                            href={lead.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-mono transition"
                          >
                            <span>Visit site</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
