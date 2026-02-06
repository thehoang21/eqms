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
import { cn } from '@/components/ui/utils';
import { Question, QuestionOption } from "../types";

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
                className="flex items-start gap-2 md:gap-4 p-3 md:p-4 cursor-pointer"
                onClick={onToggle}
            >
                <GripVertical className="h-4 w-4 md:h-5 md:w-5 text-slate-400 cursor-grab shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                        <span className="text-xs md:text-sm font-semibold text-slate-900">
                            Q{index + 1}
                        </span>
                        {question.type === "multiple_choice" ? (
                            <ListChecks className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-600 shrink-0" />
                        ) : (
                            <AlignLeft className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-600 shrink-0" />
                        )}
                        <span className="text-xs md:text-sm text-slate-600 truncate flex-1">
                            {question.text}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        {question.points.toFixed(2)}pt
                    </span>
                </div>
            </div>

            {/* Question Body (Expanded) */}
            {isActive && (
                <div className="px-3 md:px-4 pb-3 md:pb-4 space-y-3 md:space-y-4 border-t border-slate-100">
                    {/* Question Type Selector */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-3 md:pt-4">
                        <button
                            onClick={() => onUpdate({ type: "multiple_choice" })}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm flex-1",
                                question.type === "multiple_choice"
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                    : "border-slate-200 text-slate-600 hover:border-emerald-300"
                            )}
                        >
                            <ListChecks className="h-4 w-4" />
                            <span className="font-medium">Multiple Choice</span>
                        </button>
                        <button
                            onClick={() => onUpdate({ type: "essay" })}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm flex-1",
                                question.type === "essay"
                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                    : "border-slate-200 text-slate-600 hover:border-blue-300"
                            )}
                        >
                            <AlignLeft className="h-4 w-4" />
                            <span className="font-medium">Essay</span>
                        </button>
                    </div>

                    {/* Question Text */}
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                            Question
                        </label>
                        <textarea
                            value={question.text}
                            onChange={(e) => onUpdate({ text: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none text-sm"
                            placeholder="Enter question text..."
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                            Image (Optional)
                        </label>
                        {question.imageUrl ? (
                            <div className="relative">
                                <img
                                    src={question.imageUrl}
                                    alt="Question"
                                    className="w-full h-48 object-contain border border-slate-200 rounded-lg bg-slate-50"
                                />
                                <button
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex items-center justify-center gap-2 h-24 border-2 border-dashed border-slate-300 rounded-lg hover:border-emerald-400 transition-colors cursor-pointer bg-slate-50 hover:bg-emerald-50/30">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <ImageIcon className="h-5 w-5 text-slate-400" />
                                <span className="text-sm text-slate-600">Upload image</span>
                            </label>
                        )}
                    </div>

                    {/* Options (for multiple choice) */}
                    {question.type === "multiple_choice" && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Options
                                </label>
                                <button
                                    onClick={addOption}
                                    className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add Option
                                </button>
                            </div>
                            <div className="space-y-2">
                                {question.options?.map((option) => (
                                    <div key={option.id} className="flex items-start gap-2">
                                        <button
                                            onClick={() => updateOption(option.id, { isCorrect: !option.isCorrect })}
                                            className="mt-2.5 shrink-0"
                                        >
                                            {option.isCorrect ? (
                                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                            ) : (
                                                <Circle className="h-5 w-5 text-slate-300" />
                                            )}
                                        </button>
                                        <input
                                            type="text"
                                            value={option.text}
                                            onChange={(e) => updateOption(option.id, { text: e.target.value })}
                                            className="flex-1 h-10 px-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                                            placeholder="Option text..."
                                        />
                                        <button
                                            onClick={() => removeOption(option.id)}
                                            className="mt-2 text-red-600 hover:text-red-700 shrink-0"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                                {(!question.options || question.options.length === 0) && (
                                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <AlertCircle className="h-4 w-4 text-amber-600" />
                                        <span className="text-sm text-amber-700">Please add at least one option</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Points */}
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                            Points
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.01"
                            value={question.points}
                            onChange={(e) => onUpdate({ points: parseFloat(e.target.value) || 0 })}
                            className="w-full h-10 px-3 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                        />
                    </div>

                    {/* Delete Button */}
                    <button
                        onClick={onRemove}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Question
                    </button>
                </div>
            )}
        </div>
    );
};
