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
import { Question, QuestionOption } from "../../../types";

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
                "bg-white rounded-xl border-2 transition-all duration-200",
                isActive
                    ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg"
                    : "border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md",
                isDragging && "opacity-50 cursor-grabbing scale-95",
                isDragOver && "border-emerald-400 ring-2 ring-emerald-400/30 bg-emerald-50/30"
            )}
        >
            {/* Question Header */}
            <div
                className={cn(
                    "flex items-center gap-3 p-4 cursor-pointer transition-colors",
                    isActive ? "bg-emerald-50/50" : "hover:bg-slate-50/50"
                )}
                onClick={onToggle}
            >
                <GripVertical className="h-5 w-5 text-slate-400 cursor-grab shrink-0" />
                
                <div className="flex items-center gap-2 shrink-0">
                    <div className={cn(
                        "h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold",
                        isActive ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                    )}>
                        {index + 1}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        {question.type === "multiple_choice" ? (
                            <ListChecks className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : (
                            <AlignLeft className="h-4 w-4 text-blue-600 shrink-0" />
                        )}
                        <span className="text-sm font-medium text-slate-900 truncate">
                            {question.text || "Untitled Question"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span className={cn(
                        "text-xs font-semibold px-3 py-1.5 rounded-full",
                        isActive 
                            ? "bg-emerald-600 text-white" 
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    )}>
                        {question.points.toFixed(2)} pts
                    </span>
                </div>
            </div>

            {/* Question Body (Expanded) */}
            {isActive && (
                <div className="px-4 pb-4 space-y-5 border-t-2 border-slate-100 bg-slate-50/30">
                    {/* Question Type Selector */}
                    <div className="pt-4">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 block">
                            Question Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => onUpdate({ type: "multiple_choice" })}
                                className={cn(
                                    "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all text-sm font-medium",
                                    question.type === "multiple_choice"
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/30"
                                )}
                            >
                                <ListChecks className="h-4 w-4" />
                                <span>Multiple Choice</span>
                            </button>
                            <button
                                onClick={() => onUpdate({ type: "essay" })}
                                className={cn(
                                    "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all text-sm font-medium",
                                    question.type === "essay"
                                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50/30"
                                )}
                            >
                                <AlignLeft className="h-4 w-4" />
                                <span>Essay</span>
                            </button>
                        </div>
                    </div>

                    {/* Question Text */}
                    <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 block">
                            Question Text
                        </label>
                        <textarea
                            value={question.text}
                            onChange={(e) => onUpdate({ text: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none text-sm bg-white transition-all"
                            placeholder="Enter your question here..."
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 block">
                            Image (Optional)
                        </label>
                        {question.imageUrl ? (
                            <div className="relative rounded-lg overflow-hidden border-2 border-slate-200 bg-white">
                                <img
                                    src={question.imageUrl}
                                    alt="Question"
                                    className="w-full h-48 object-contain bg-slate-50"
                                />
                                <button
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center gap-2 h-32 border-2 border-dashed border-slate-300 rounded-lg hover:border-emerald-400 transition-all cursor-pointer bg-white hover:bg-emerald-50/50 group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <ImageIcon className="h-8 w-8 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                <span className="text-sm font-medium text-slate-600 group-hover:text-emerald-600 transition-colors">Click to upload image</span>
                                <span className="text-xs text-slate-400">PNG, JPG up to 5MB</span>
                            </label>
                        )}
                    </div>

                    {/* Options (for multiple choice) */}
                    {question.type === "multiple_choice" && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Answer Options
                                </label>
                                <button
                                    onClick={addOption}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add Option
                                </button>
                            </div>
                            <div className="space-y-2">
                                {question.options?.map((option, idx) => (
                                    <div key={option.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border-2 border-slate-200 hover:border-slate-300 transition-all">
                                        <button
                                            onClick={() => updateOption(option.id, { isCorrect: !option.isCorrect })}
                                            className="shrink-0 transition-transform hover:scale-110"
                                            title={option.isCorrect ? "Correct answer" : "Mark as correct"}
                                        >
                                            {option.isCorrect ? (
                                                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                            ) : (
                                                <Circle className="h-6 w-6 text-slate-300 hover:text-slate-400" />
                                            )}
                                        </button>
                                        <div className={cn(
                                            "h-6 w-6 rounded flex items-center justify-center text-xs font-bold shrink-0",
                                            option.isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                                        )}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <input
                                            type="text"
                                            value={option.text}
                                            onChange={(e) => updateOption(option.id, { text: e.target.value })}
                                            className="flex-1 h-9 px-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm bg-slate-50 focus:bg-white transition-all"
                                            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                        />
                                        <button
                                            onClick={() => removeOption(option.id)}
                                            className="shrink-0 p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove option"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                                {(!question.options || question.options.length === 0) && (
                                    <div className="flex items-center gap-3 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                                        <span className="text-sm font-medium text-amber-700">Please add at least one answer option</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Points */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 block">
                                Points Value
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.01"
                                value={question.points}
                                onChange={(e) => onUpdate({ points: parseFloat(e.target.value) || 0 })}
                                className="w-full h-11 px-4 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm font-medium bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Delete Button */}
                    <div className="pt-2 border-t-2 border-slate-200">
                        <button
                            onClick={onRemove}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border-2 border-red-200 hover:border-red-300 transition-all text-sm font-semibold"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Question
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
