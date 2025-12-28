import { Question } from "./types";

export const redistributePoints = (questions: Question[]): Question[] => {
    if (questions.length === 0) return questions;
    const pointsPerQuestion = Math.round((10 / questions.length) * 100) / 100;
    return questions.map(q => ({ ...q, points: pointsPerQuestion }));
};
