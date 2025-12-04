export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ASSISTANT = 'ASSISTANT', // Technical Assistant
  JOURNAL = 'JOURNAL', // Reflective Journal
  CULTURE = 'CULTURE', // Cultural Validation
  COMMUNITY = 'COMMUNITY', // Community Feedback
  LIBRARY = 'LIBRARY', // Virtual Library
}

export interface AnalysisResult {
  status: 'success' | 'error' | 'loading' | 'idle';
  message: string;
  technicalData?: {
    tension: string;
    density: string;
    errors: string[];
    suggestions: string[];
  };
  culturalData?: {
    symbolName: string;
    meaning: string;
    accuracy: string;
    question: string;
  };
}

export interface JournalEntry {
  id: string;
  date: string;
  type: 'audio' | 'image' | 'text';
  content: string; // Text transcript or description
  emotions: string[];
  tags: string[];
  aiReflection: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  story: string;
  date: string;
  image: string; // Base64 string
  hasAudio: boolean; // Simulator flag for audio
}

export interface FeedbackData {
  category: string;
  score: number; // 0-100
  comments: string[];
}