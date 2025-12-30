export type QuestionType = "multiple_choice" | "essay";
export type TrainingType = "read_understand" | "test_certification";

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
}

export interface TrainingConfig {
    isRequired: boolean;
    trainingType: TrainingType;
    passingScore: number;
    maxAttempts: number;
    deadlineDays: number;
    questions: Question[];
}
