// Field Assessment Types

export interface AssessmentQuestion {
  id: string;
  fieldId: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-3)
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic?: string;
}

export interface AssessmentAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeSpent?: number; // in seconds
}

export interface AssessmentResult {
  userId: string;
  fieldId: string;
  fieldName: string;
  score: number; // Percentage (0-100)
  totalQuestions: number;
  correctAnswers: number;
  answers: AssessmentAnswer[];
  status: 'passed' | 'needs_improvement';
  attemptDate: Date;
  timeSpent?: number; // Total time in seconds
  questionsWithAnswers?: AssessmentQuestion[];
}

export interface FieldAssessmentStatus {
  fieldId: string;
  hasAttempted: boolean;
  hasPassed: boolean;
  score?: number;
  lastAttemptDate?: Date;
  attemptsCount: number;
}

export interface AssessmentConfig {
  fieldId: string;
  enabled: boolean;
  passingScore: number; // Percentage (default: 75)
  questionsCount: number; // Number of questions (default: 10)
  timeLimit?: number; // Time limit in minutes (optional)
  allowRetake: boolean;
  retakeCooldown?: number; // Hours before retake allowed
}

export interface FieldIntroContent {
  fieldId: string;
  fieldName: string;
  shortDescription: string;
  aboutField: string;
  whatAreSpecializations: string;
  whatAreCareerPaths: string;
  whyCertificationsMatter: string;
  whyProjectsMatter: string;
}
