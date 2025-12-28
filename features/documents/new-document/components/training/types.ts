// Training module types
export type QuestionType = "multiple_choice" | "essay";

export interface QuestionOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id: string;
    text: string;
    type: QuestionType;
    points: number;
    imageUrl?: string;
    options?: QuestionOption[];
    correctAnswer?: string;
}

export interface TrainingConfig {
    isRequired: boolean;
    passingScore: number;
    maxAttempts: number;
    deadlineDays: number;
    questions: Question[];
}
