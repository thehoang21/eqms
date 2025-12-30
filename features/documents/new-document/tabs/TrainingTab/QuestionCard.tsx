import React from "react";
import {
    GripVertical,
    CheckCircle2,
    Circle,
    AlignLeft,
    ListChecks,
    Trash2,
    Plus,
    X,
    Image as ImageIcon,
    AlertCircle
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { Question, QuestionOption } from "./types";

interface QuestionCardProps {
    question: Question;
    index: number;
    isActive: boolean;
    isDragging?: boolean;
    isDragOver?: boolean;
    onToggle: () => void;
    onUpdate: (updates: Partial<Question>) => void;
    onRemove: () => void;
    onDragStart?: () => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDrop?: (e: React.DragEvent) => void;
    onDragEnd?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    index,
    isActive,
    isDragging = false,
    isDragOver = false,
    onToggle,
    onUpdate,
    onRemove,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd
}) => {
    const addOption = () => {
        const newOption: QuestionOption = {
            id: `opt-${Date.now()}`,
            text: `Option ${(question.options?.length || 0) + 1}`,
            isCorrect: false
        };
        onUpdate({ options: [...(question.options || []), newOption] });
    };

    const updateOption = (optionId: string, updates: Partial<QuestionOption>) => {
        if (!question.options) return;
        const newOptions = question.options.map(opt =>
            opt.id === optionId ? { ...opt, ...updates } : opt
        );
        onUpdate({ options: newOptions });
    };

    const removeOption = (optionId: string) => {
        if (!question.options) return;
        onUpdate({ options: question.options.filter(opt => opt.id !== optionId) });
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            onUpdate({ imageUrl: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        onUpdate({ imageUrl: undefined });
    };

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            className={cn(
                "bg-white rounded-xl border transition-all duration-200",
                isActive
                    ? "border-emerald-500 ring-1 ring-emerald-500 shadow-md"
                    : "border-slate-200 shadow-sm hover:border-emerald-300",
                isDragging && "opacity-50 cursor-grabbing",
                isDragOver && "border-emerald-400 ring-2 ring-emerald-400 bg-emerald-50/20"
            )}
        >
            {/* Question Header */}
            <div
                className="flex items-start gap-4 p-4 cursor-pointer"
                onClick={onToggle}
            >
                <div className="mt-1 text-slate-400 cursor-grab active:cursor-grabbing" title="Drag to reorder">
                    <GripVertical className="h-5 w-5" />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-bold text-slate-900">Question {index + 1}</span>
                        <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            question.type === "multiple_choice"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-purple-50 text-purple-700"
                        )}>
                            {question.type === "multiple_choice" ? "Multiple Choice" : "Essay"}
                        </span>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {question.points} pts
                        </span>
                    </div>
                    <p className="text-slate-600 text-sm line-clamp-1">{question.text}</p>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            {/* Question Editor (Expanded) */}
            {isActive && (
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-sm font-medium text-slate-700">Question Text</label>
                            <input
                                type="text"
                                value={question.text}
                                onChange={(e) => onUpdate({ text: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                                placeholder="Enter your question here..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Points</label>
                            <input
                                type="number"
                                step="0.01"
                                value={question.points}
                                readOnly
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed outline-none"
                                title="Points are auto-calculated based on total questions"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Question Image (Optional)</label>
                        {question.imageUrl ? (
                            <div className="relative inline-block">
                                <img
                                    src={question.imageUrl}
                                    alt="Question illustration"
                                    className="max-w-md max-h-64 rounded-lg border border-slate-200 object-contain"
                                />
                                <button
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-emerald-400 hover:bg-emerald-50/50 transition-all cursor-pointer w-fit">
                                <ImageIcon className="h-5 w-5 text-slate-400" />
                                <span className="text-sm font-medium text-slate-600">Upload Image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    {/* Question Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Question Type</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => onUpdate({ type: "multiple_choice" })}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all",
                                    question.type === "multiple_choice"
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200"
                                )}
                            >
                                <ListChecks className="h-4 w-4" />
                                Multiple Choice
                            </button>
                            <button
                                onClick={() => onUpdate({ type: "essay" })}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all",
                                    question.type === "essay"
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200"
                                )}
                            >
                                <AlignLeft className="h-4 w-4" />
                                Essay / Free Text
                            </button>
                        </div>
                    </div>

                    {/* Options for Multiple Choice */}
                    {question.type === "multiple_choice" && (
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700">Answer Options</label>
                                <span className="text-xs text-slate-500 italic">Multiple correct answers allowed</span>
                            </div>
                            <div className="space-y-2">
                                {question.options?.map((option) => (
                                    <div key={option.id} className="flex items-center gap-3">
                                        <button
                                            onClick={() => updateOption(option.id, { isCorrect: !option.isCorrect })}
                                            className={cn(
                                                "shrink-0 transition-colors",
                                                option.isCorrect ? "text-emerald-600" : "text-slate-300 hover:text-slate-400"
                                            )}
                                            title="Mark as correct answer"
                                        >
                                            {option.isCorrect ? (
                                                <CheckCircle2 className="h-5 w-5" />
                                            ) : (
                                                <Circle className="h-5 w-5" />
                                            )}
                                        </button>
                                        <input
                                            type="text"
                                            value={option.text}
                                            onChange={(e) => updateOption(option.id, { text: e.target.value })}
                                            className={cn(
                                                "flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white text-sm",
                                                option.isCorrect ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200"
                                            )}
                                            placeholder="Option text..."
                                        />
                                        <button
                                            onClick={() => removeOption(option.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={addOption}
                                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 mt-2"
                            >
                                <Plus className="h-3 w-3" />
                                Add Option
                            </button>
                        </div>
                    )}

                    {/* Essay Configuration */}
                    {question.type === "essay" && (
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-800">
                                <p className="font-medium">Manual Grading Required</p>
                                <p className="mt-1">Essay questions cannot be auto-graded. A trainer or manager will need to review and grade the answer manually.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
