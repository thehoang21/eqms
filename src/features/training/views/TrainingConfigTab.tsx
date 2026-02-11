import React, { useState } from "react";
import { Plus, AlertCircle } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button/Button";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { TrainingConfig, Question } from "../types";
import { redistributePoints } from "../utils/trainingHelpers";
import { TrainingConfigSection } from "../components/TrainingConfigSection";
import { QuestionCard } from "../components/QuestionCard";

interface TrainingConfigTabProps {
    hasQuiz: boolean;
    setHasQuiz: (v: boolean) => void;
    config: TrainingConfig;
    setConfig: React.Dispatch<React.SetStateAction<TrainingConfig>>;
}

export const TrainingConfigTab: React.FC<TrainingConfigTabProps> = ({
    hasQuiz,
    setHasQuiz,
    config,
    setConfig,
}) => {
    const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
    const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(null);
    const [dragOverQuestionId, setDragOverQuestionId] = useState<string | null>(null);

    const totalPoints = config.questions.reduce((sum, q) => sum + q.points, 0);
    const isTestMode = config.trainingType === "test_certification";

    const addQuestion = () => {
        const newQuestion: Question = {
            id: Date.now().toString(),
            text: "New Question",
            type: "multiple_choice",
            points: 10,
            options: [
                { id: `opt-${Date.now()}-1`, text: "Option 1", isCorrect: true },
                { id: `opt-${Date.now()}-2`, text: "Option 2", isCorrect: false },
            ]
        };
        setConfig(prev => {
            const updatedQuestions = redistributePoints([...prev.questions, newQuestion]);
            return { ...prev, questions: updatedQuestions };
        });
        setActiveQuestionId(newQuestion.id);
    };

    const removeQuestion = (id: string) => {
        setConfig(prev => {
            const filteredQuestions = prev.questions.filter(q => q.id !== id);
            const updatedQuestions = redistributePoints(filteredQuestions);
            return { ...prev, questions: updatedQuestions };
        });
    };

    const updateQuestion = (id: string, updates: Partial<Question>) => {
        setConfig(prev => ({
            ...prev,
            questions: prev.questions.map(q => q.id === id ? { ...q, ...updates } : q)
        }));
    };

    const reorderQuestions = (fromIndex: number, toIndex: number) => {
        setConfig(prev => {
            const newQuestions = [...prev.questions];
            const [movedQuestion] = newQuestions.splice(fromIndex, 1);
            newQuestions.splice(toIndex, 0, movedQuestion);
            return { ...prev, questions: newQuestions };
        });
    };

    const handleDragStart = (questionId: string) => {
        setDraggedQuestionId(questionId);
    };

    const handleDragOver = (e: React.DragEvent, questionId: string) => {
        e.preventDefault();
        setDragOverQuestionId(questionId);
    };

    const handleDrop = (e: React.DragEvent, targetQuestionId: string) => {
        e.preventDefault();

        if (!draggedQuestionId || draggedQuestionId === targetQuestionId) {
            setDraggedQuestionId(null);
            setDragOverQuestionId(null);
            return;
        }

        const fromIndex = config.questions.findIndex(q => q.id === draggedQuestionId);
        const toIndex = config.questions.findIndex(q => q.id === targetQuestionId);

        if (fromIndex !== -1 && toIndex !== -1) {
            reorderQuestions(fromIndex, toIndex);
        }

        setDraggedQuestionId(null);
        setDragOverQuestionId(null);
    };

    const handleDragEnd = () => {
        setDraggedQuestionId(null);
        setDragOverQuestionId(null);
    };

    return (
        <div className="p-4 lg:p-6 space-y-6">
            {/* Quiz Toggle */}
            <div>
                <Checkbox
                    id="has-quiz"
                    label="Include Quiz/Test"
                    checked={hasQuiz}
                    onChange={setHasQuiz}
                />
                <p className="text-xs text-slate-500 mt-1.5 ml-6">
                    Enable this option to add a quiz or certification test to the training course.
                </p>
            </div>

            {/* Quiz Configuration Section */}
            {hasQuiz && (
                <>
                    <div className="border-t border-slate-200 pt-6">
                        <TrainingConfigSection
                            config={config}
                            onUpdate={(updates) => setConfig(prev => ({ ...prev, ...updates }))}
                        />
                    </div>

                    {/* Quiz Builder - Only show for Test & Certification */}
                    {isTestMode && (
                        <div className="border-t border-slate-200 pt-6">
                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <h3 className="text-base lg:text-lg font-semibold text-slate-900">Quiz Questions</h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                        <div className="text-xs lg:text-sm font-medium text-slate-600">
                                            Total Points: <span className={cn(totalPoints === 10 ? "text-emerald-600" : totalPoints > 10 ? "text-red-600" : "text-amber-600")}>{totalPoints.toFixed(2)}</span> / 10
                                        </div>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={addQuestion}
                                            className="gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Question
                                        </Button>
                                    </div>
                                </div>

                                {config.questions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <AlertCircle className="h-12 w-12 text-slate-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                            No Questions Yet
                                        </h3>
                                        <p className="text-sm text-slate-500 mb-6">
                                            Add questions to create your training quiz
                                        </p>
                                        <Button
                                            variant="default"
                                            onClick={addQuestion}
                                            className="gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add First Question
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {config.questions.map((question, index) => (
                                            <QuestionCard
                                                key={question.id}
                                                question={question}
                                                index={index}
                                                isActive={activeQuestionId === question.id}
                                                isDragging={draggedQuestionId === question.id}
                                                isDragOver={dragOverQuestionId === question.id}
                                                onToggle={() => setActiveQuestionId(question.id === activeQuestionId ? null : question.id)}
                                                onUpdate={(updates) => updateQuestion(question.id, updates)}
                                                onRemove={() => removeQuestion(question.id)}
                                                onDragStart={() => handleDragStart(question.id)}
                                                onDragOver={(e) => handleDragOver(e, question.id)}
                                                onDrop={(e) => handleDrop(e, question.id)}
                                                onDragEnd={handleDragEnd}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
