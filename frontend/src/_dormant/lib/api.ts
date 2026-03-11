const API_BASE = "/api";

const getCache = new Map<string, { data: unknown; ts: number }>();
const GET_CACHE_TTL = 60_000;

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const isGet = !options?.method || options.method === "GET";

  if (isGet) {
    const cached = getCache.get(endpoint);
    if (cached && Date.now() - cached.ts < GET_CACHE_TTL) {
      return cached.data as T;
    }
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "অনুরোধ ব্যর্থ হয়েছে" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  const data = await res.json();

  if (isGet) {
    getCache.set(endpoint, { data, ts: Date.now() });
    if (getCache.size > 200) {
      const oldest = getCache.keys().next().value;
      if (oldest) getCache.delete(oldest);
    }
  }

  return data as T;
}

export interface Chapter {
  id: string;
  name: string;
  order: number;
  symptomCount: number;
  symptoms: SymptomSummary[];
}

export interface SymptomSummary {
  id: string;
  name: string;
  hasSubSymptoms: boolean;
  subSymptomCount: number;
}

export interface SymptomDetail {
  symptom: {
    id: string;
    name: string;
    type: string;
    subSymptoms?: { id: string; name: string }[];
  };
  breadcrumb: { id: string; name: string }[];
  remedies: RemedyMatch[];
}

export interface RemedyMatch {
  id: string;
  name: string;
  abbr: string;
  strength: number;
  description: string;
}

export interface RemedySummary {
  id: string;
  name: string;
  abbr: string;
  description: string;
  symptomCount: number;
}

export interface RemedyDetail {
  remedy: {
    id: string;
    name: string;
    abbr: string;
    description: string;
    commonSymptoms: string[];
    dosage: string;
    modalities: { worse: string[]; better: string[] };
    relatedRemedies: { id: string; name: string; abbr: string }[];
  };
}

export interface AIAnalysis {
  analysis: string;
  remedies: {
    name: string;
    abbr: string;
    confidence: number;
    explanation: string;
    dosage: string;
    keyFeatures: string[];
    brief?: string;
  }[];
  precautions: string;
}

export interface ChatResponse {
  message: string;
  remedies: {
    name: string;
    abbr: string;
    confidence: number;
    brief: string;
  }[];
  precautions: string;
}

export interface ConsultResponse {
  message: string;
  stage: "gathering" | "analyzing" | "recommendation";
  questionsAsked: number;
  symptomsCollected: string[];
  recommendation: null | {
    primaryRemedy: {
      name: string;
      abbr: string;
      confidence: number;
      explanation: string;
      dosage: string;
      keyIndications: string[];
    };
    alternativeRemedies: {
      name: string;
      abbr: string;
      confidence: number;
      brief: string;
    }[];
    generalAdvice: string;
    whenToSeekHelp: string;
  };
}

export interface SearchResult {
  symptoms: { id: string; name: string; type: string; chapter: string; parent?: string }[];
  remedies: { id: string; name: string; abbr: string; type: string }[];
}

export interface RankedRemedy {
  rank: number;
  id: string;
  name: string;
  abbr: string;
  description: string;
  dosage: string;
  modalities: { worse: string[]; better: string[] };
  totalScore: number;
  symptomsCovered: number;
  totalSymptoms: number;
  maxGrade: number;
  confidence: number;
  coverageDetails: { symptomId: string; symptomName: string; grade: number }[];
}

export interface RankingResult {
  totalSymptomsAnalyzed: number;
  totalRemediesFound: number;
  rankedRemedies: RankedRemedy[];
}

export const api = {
  getSymptoms: () => fetchAPI<{ chapters: Chapter[] }>("/symptoms"),

  getSymptomById: (id: string) => fetchAPI<SymptomDetail>(`/symptoms/${id}`),

  searchSymptoms: (q: string) =>
    fetchAPI<{ results: SearchResult["symptoms"] }>(`/symptoms/search?q=${encodeURIComponent(q)}`),

  getRemedies: () => fetchAPI<{ remedies: RemedySummary[] }>("/remedies"),

  getRemedyById: (id: string) => fetchAPI<RemedyDetail>(`/remedies/${id}`),

  searchRemedies: (q: string) =>
    fetchAPI<{ results: SearchResult["remedies"] }>(`/remedies/search?q=${encodeURIComponent(q)}`),

  analyzeSymptoms: (symptoms: string[], language: string = "bn") =>
    fetchAPI<AIAnalysis>("/analyze-symptoms", {
      method: "POST",
      body: JSON.stringify({ symptoms, language }),
    }),

  chat: (message: string, language: string = "bn") =>
    fetchAPI<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify({ message, language }),
    }),

  consult: (history: { role: string; content: string }[], language: string = "bn") =>
    fetchAPI<ConsultResponse>("/consult", {
      method: "POST",
      body: JSON.stringify({ history, language }),
    }),

  rankRemedies: (symptomIds: string[], topN: number = 20) =>
    fetchAPI<RankingResult>("/rank-remedies", {
      method: "POST",
      body: JSON.stringify({ symptomIds, topN }),
    }),
};
