export interface CompetitorAnalysis {
  competitor: string;
  industry: string;
  seoScore: number;
  geoScore: number;
  topKeywords: Array<{
    keyword: string;
    trafficVolume: string;
    difficulty: 'Low' | 'Medium' | 'High';
    intent: string;
  }>;
  aiCitations: Array<{
    source: string;
    coveragePct: number;
    tone: 'Positive' | 'Neutral' | 'Critical';
    isMainCitation: boolean;
  }>;
  strengths: string[];
  weaknesses: string[];
  geoOpportunities: Array<{
    topic: string;
    strategy: string;
    priority: 'High' | 'Medium' | 'Low';
  }>;
}

export interface GEOSEOScoreResult {
  urlOrContent: string;
  traditionalSeoScore: number;
  geoScore: number;
  overallGrade: string;
  metrics: {
    authoritySignals: number; // 0-100
    citationDirectness: number; // 0-100
    entityAlignment: number; // 0-100
    readabilityAndFlow: number; // 0-100
    structuredDataScore: number; // 0-100
  };
  aiPlatformsScore: Array<{
    platform: string; // Gemini, ChatGPT, Perplexity, Claude, Copilot
    citationProbability: number; // 0-100
    viabilityStatus: 'Strong Citation' | 'Moderate Citation' | 'Low Citation';
  }>;
  geoBoostActions: Array<{
    category: 'Structured Data' | 'Authoritativeness' | 'Entity optimization' | 'Citation proofing';
    action: string;
    impact: 'Critical' | 'High' | 'Medium';
    revisedFragment: string;
  }>;
  summaryFeedback: string;
}

export interface RepurposeResult {
  originalText: string;
  title: string;
  xThread: Array<{
    postNumber: number;
    text: string;
    characterCount: number;
  }>;
  linkedInPost: string;
  mediumArticle: string;
  webhookPayload: string; // Structured JSON automation delivery
  claudeCodeCommand: string; // Ready automation script instructions
  marketingHooks: string[];
}

export interface BrandProfile {
  brandName: string;
  tagline: string;
  voiceTone: string;
  targetAudience: string;
  accentColor: string; // hex
  secondaryColor: string; // hex
  vocabulary: string[];
  prohibitedWords: string[];
  suggestedBioUsable: string;
}

export interface AIWebsiteTemplate {
  title: string;
  subtitle: string;
  heroHeader: string;
  heroButtonText: string;
  features: Array<{ icon: string; title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
  ctaHeader: string;
  ctaText: string;
  socialLinks: { twitter: string; linkedin: string; github: string };
  metaTitle: string;
  metaDescription: string;
  fonts: { headings: string; body: string };
}

export interface SocialLeadProspect {
  id: string;
  platform: 'X/Twitter' | 'LinkedIn' | 'Reddit' | 'Web/Blog';
  userHandle: string;
  userName: string;
  userBio: string;
  postContent: string;
  expressedNeed: string;
  relevanceScore: number; // 0-100
  recommendedPitch: string;
  engagementTriggerUrl: string;
  leadStatus: 'New' | 'Saved' | 'Contacted';
}

export interface GoogleMapsLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  stars: number;
  reviewsCount: number;
  latitude?: number;
  longitude?: number;
}

export interface MapsScrapeHistory {
  id: string;
  timestamp: string;
  keyword: string;
  city: string;
  state: string;
  resultsCount: number;
}



