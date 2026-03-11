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
