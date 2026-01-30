import React, { useState } from "react";
import { Plus, HelpCircle, Save } from "lucide-react";
import { cn } from '@/components/ui/utils';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { TrainingConfig, Question } from "./types";
import { redistributePoints } from "./utils";
import { TrainingConfigSection } from "./TrainingConfigSection";
import { QuestionCard } from "./QuestionCard";

export const TrainingTab: React.FC = () => {
    const [config, setConfig] = useState<TrainingConfig>({
        isRequired: false,
        trainingType: "test_certification",
        passingScore: 7,
        maxAttempts: 3,
        trainingPeriodDays: 7,
        questions: []
    });

    const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
    const [draggedQuestionId, setDraggedQuestionId] = useState<string | null>(null);
    const [dragOverQuestionId, setDragOverQuestionId] = useState<string | null>(null);

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

    const totalPoints = config.questions.reduce((sum, q) => sum + q.points, 0);
    const isTestMode = config.trainingType === "test_certification";

    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="flex items-center justify-between font-semibold text-slate-900">
                <Checkbox
                    id="requires-training"
                    label="Requires Training?"
                    checked={config.isRequired}
                    onChange={(checked) => setConfig({ ...config, isRequired: checked })}
                />
            </div>

            {config.isRequired && (
                <>
                    {/* Training Configuration */}
                    <TrainingConfigSection
                        config={config}
                        onUpdate={(updates) => setConfig({ ...config, ...updates })}
                    />

                    {/* Quiz Builder - Only show for Test & Certification */}
                    {isTestMode && (
                        <div className="space-y-3 lg:space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <h3 className="text-base lg:text-lg font-semibold text-slate-900">Quiz Questions</h3>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                    <div className="text-xs lg:text-sm font-medium text-slate-600">
                                        Total Points: <span className={cn(totalPoints === 10 ? "text-emerald-600" : totalPoints > 10 ? "text-red-600" : "text-amber-600")}>{totalPoints.toFixed(2)}</span> / 10
                                    </div>
                                    <button
                                        onClick={addQuestion}
                                        className="flex items-center justify-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs lg:text-sm font-medium w-full sm:w-auto"
                                    >
                                        <Plus className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                        <span>Add Question</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 lg:space-y-4">
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

                                {config.questions.length === 0 && (
                                    <div className="text-center py-6 lg:py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                        <HelpCircle className="h-10 w-10 lg:h-12 lg:w-12 text-slate-300 mx-auto mb-2 lg:mb-3" />
                                        <h3 className="text-base lg:text-lg font-medium text-slate-900">No Questions Added</h3>
                                        <p className="text-xs lg:text-sm text-slate-500 mb-3 lg:mb-4 px-4">Start building your training quiz by adding questions.</p>
                                        <button
                                            onClick={addQuestion}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs lg:text-sm font-medium"
                                        >
                                            Create First Question
                                        </button>
                                    </div>
                                )}
                            </div>

                            {config.questions.length > 0 && (
                                <div className="flex justify-end pt-4 lg:pt-6 border-t border-slate-200 mt-4 lg:mt-6">
                                    <button
                                        onClick={() => { }}
                                        className="flex items-center justify-center gap-1.5 lg:gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-xs lg:text-sm font-medium shadow-sm w-full sm:w-auto"
                                    >
                                        <Save className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                        <span>Save Quiz</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// Re-export types for convenience
export type { TrainingConfig, Question, QuestionType, QuestionOption } from "./types";
