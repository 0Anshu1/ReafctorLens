import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface AnalysisResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  language: string;
  overallScore?: number;
  level?: number;
  summary?: string;
  refactorTypes?: RefactorType[];
  files?: FileChange[];
  riskFlags?: RiskFlag[];
  suggestedNextSteps?: string[];
  createdAt: string;
  completedAt?: string;
  processingTimeMs?: number;
  error?: {
    message: string;
    stack: string;
    timestamp: string;
  };
  results?: {
    overallScore: number;
    level: number;
    summary: string;
    refactorTypes: RefactorType[];
    files: FileChange[];
    riskFlags: RiskFlag[];
    suggestedNextSteps: string[];
    metrics?: {
      totalLinesChanged?: number;
      filesModified?: number;
      newDependencies?: string[];
      removedDependencies?: string[];
      cyclomaticComplexityDelta?: number;
      testCoverageDelta?: number;
    };
  };
}

export interface RefactorType {
  type: string;
  level: number;
  evidence: string[];
  confidence: number;
}

export interface FileChange {
  filePath: string;
  changes: {
    textDiff: string;
    astDiffSummary: string;
    impactScore: number;
    linesAdded: number;
    linesRemoved: number;
    linesModified: number;
  };
  refactorTypes: RefactorType[];
}

export interface RiskFlag {
  type: 'security' | 'license' | 'compatibility' | 'performance' | 'maintainability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  suggestion: string;
}

interface AnalysisState {
  currentAnalysis: AnalysisResult | null;
  analysisHistory: AnalysisResult[];
  isLoading: boolean;
  error: string | null;
}

type AnalysisAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_ANALYSIS'; payload: AnalysisResult | null }
  | { type: 'ADD_ANALYSIS_TO_HISTORY'; payload: AnalysisResult }
  | { type: 'UPDATE_ANALYSIS'; payload: AnalysisResult };

const initialState: AnalysisState = {
  currentAnalysis: null,
  analysisHistory: [],
  isLoading: false,
  error: null,
};

const analysisReducer = (state: AnalysisState, action: AnalysisAction): AnalysisState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CURRENT_ANALYSIS':
      return { ...state, currentAnalysis: action.payload };
    case 'ADD_ANALYSIS_TO_HISTORY':
      return {
        ...state,
        analysisHistory: [action.payload, ...state.analysisHistory],
      };
    case 'UPDATE_ANALYSIS':
      return {
        ...state,
        currentAnalysis: action.payload,
        analysisHistory: state.analysisHistory.map(analysis =>
          analysis.id === action.payload.id ? action.payload : analysis
        ),
      };
    default:
      return state;
  }
};

interface AnalysisContextType {
  state: AnalysisState;
  dispatch: React.Dispatch<AnalysisAction>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

interface AnalysisProviderProps {
  children: ReactNode;
}

export const AnalysisProvider: React.FC<AnalysisProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(analysisReducer, initialState);

  return (
    <AnalysisContext.Provider value={{ state, dispatch }}>
      {children}
    </AnalysisContext.Provider>
  );
};

