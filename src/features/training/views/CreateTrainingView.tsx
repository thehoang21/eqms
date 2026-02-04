import React, { useState } from "react";
import { Plus, Save, X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IconSmartHome } from "@tabler/icons-react";
import { cn } from '@/components/ui/utils';
import { Button } from '@/components/ui/button/Button';
import { Checkbox } from '@/components/ui/checkbox/Checkbox';
import { Select } from '@/components/ui/select/Select';
import { DateTimePicker } from '@/components/ui/datetime-picker/DateTimePicker';
import { Input, Textarea } from '@/components/ui/form/ResponsiveForm';
import { TrainingConfig, Question, TrainingType } from "../types";
import { redistributePoints } from "../utils/trainingHelpers";
import { TrainingConfigSection } from "../components/TrainingConfigSection";
import { QuestionCard } from "../components/QuestionCard";

export const CreateTrainingView: React.FC = () => {
    const navigate = useNavigate();
    
    // Basic Training Info
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [trainingType, setTrainingType] = useState<TrainingType>("GMP");
    const [instructor, setInstructor] = useState("");
    const [scheduledDate, setScheduledDate] = useState("");
    const [duration, setDuration] = useState(4);
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState(30);
    const [isMandatory, setIsMandatory] = useState(false);
    const [hasQuiz, setHasQuiz] = useState(false);
    
    // Quiz Configuration
    const [config, setConfig] = useState<TrainingConfig>({
        trainingType: "test_certification",
        passingScore: 7,
        maxAttempts: 3,
        trainingPeriodDays: 7,
        distributionList: [],
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

    const handleSave = () => {
        // Validate required fields
        if (!title.trim()) {
            alert("Please enter training title");
            return;
        }
        
        // Save logic here
        console.log({
            title,
            description,
            trainingType,
            instructor,
            scheduledDate,
            duration,
            location,
            capacity,
            isMandatory,
            hasQuiz,
            config: hasQuiz ? config : undefined
        });
        
        // Navigate back
        navigate("/training-management/courses");
    };

    const totalPoints = config.questions.reduce((sum, q) => sum + q.points, 0);
    const isTestMode = config.trainingType === "test_certification";

    return (
        <div className="space-y-6 w-full flex-1 flex flex-col">
            {/* Header: Title + Breadcrumb + Action Buttons */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-4">
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-slate-900">
                        Create New Training
                    </h1>
                    <div className="flex items-center gap-1.5 text-slate-500 mt-1 text-xs whitespace-nowrap overflow-x-auto">
                        <IconSmartHome className="h-4 w-4" />
                        <span className="text-slate-400 mx-1">/</span>
                        <button
                            onClick={() => navigate("/training-management/courses")}
                            className="hover:text-slate-700 transition-colors"
                        >
                            Training Management
                        </button>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-slate-700 font-medium">Create Training</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/training-management/courses")}
                        size="sm"
                        className="whitespace-nowrap gap-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleSave}
                        size="sm"
                        className="whitespace-nowrap gap-2"
                    >
                        Save
                    </Button>
                </div>
            </div>

            {/* Basic Information Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 lg:p-5">
                <h2 className="text-base lg:text-lg font-semibold text-slate-900 mb-3 lg:mb-4">
                    Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="md:col-span-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700">
                                Training Title <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., GMP Basic Training"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700">
                                Description
                            </label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="Describe the training objectives and content..."
                            />
                        </div>
                    </div>

                    {/* Training Type */}
                    <div>
                        <Select
                            label="Training Type"
                            value={trainingType}
                            onChange={setTrainingType}
                            options={[
                                { label: "GMP", value: "GMP" },
                                { label: "Safety", value: "Safety" },
                                { label: "Technical", value: "Technical" },
                                { label: "Compliance", value: "Compliance" },
                                { label: "SOP", value: "SOP" },
                                { label: "Software", value: "Software" },
                            ]}
                        />
                    </div>

                    {/* Instructor */}
                    <div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700">
                                Instructor
                            </label>
                            <Input
                                type="text"
                                value={instructor}
                                onChange={(e) => setInstructor(e.target.value)}
                                placeholder="Instructor name"
                            />
                        </div>
                    </div>

                    {/* Scheduled Date */}
                    <div>
                        <DateTimePicker
                            label="Scheduled Date"
                            value={scheduledDate}
                            onChange={setScheduledDate}
                            placeholder="Select date and time"
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700">
                                Duration (hours)
                            </label>
                            <Input
                                type="number"
                                min={1}
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700">
                                Location
                            </label>
                            <Input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g., Training Room A"
                            />
                        </div>
                    </div>

                    {/* Capacity */}
                    <div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700">
                                Capacity
                            </label>
                            <Input
                                type="number"
                                min={1}
                                value={capacity}
                                onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                            />
                        </div>
                    </div>

                    {/* Mandatory */}
                    <div className="md:col-span-2">
                        <Checkbox
                            id="mandatory"
                            label="Mandatory Training"
                            checked={isMandatory}
                            onChange={setIsMandatory}
                        />
                    </div>
                </div>
            </div>

            {/* Quiz Configuration Toggle */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 lg:p-5">
                <Checkbox
                    id="has-quiz"
                    label="Include Quiz/Test"
                    checked={hasQuiz}
                    onChange={setHasQuiz}
                />
            </div>

            {/* Quiz Configuration Section */}
            {hasQuiz && (
                <>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 lg:p-5">
                        <TrainingConfigSection
                            config={config}
                            onUpdate={(updates) => setConfig({ ...config, ...updates })}
                        />
                    </div>

                    {/* Quiz Builder - Only show for Test & Certification */}
                    {isTestMode && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 lg:p-5">
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
