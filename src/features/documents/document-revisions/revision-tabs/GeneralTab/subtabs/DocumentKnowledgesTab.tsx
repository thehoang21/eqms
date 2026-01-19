import React, { useState } from "react";
import { BookOpen, Plus, X } from "lucide-react";
import { Button } from '@/components/ui/button/Button';

interface Knowledge {
    id: string;
    title: string;
    description: string;
}

export const DocumentKnowledgesTab: React.FC = () => {
    const [knowledges, setKnowledges] = useState<Knowledge[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newKnowledge, setNewKnowledge] = useState({ title: "", description: "" });

    const handleAddKnowledge = () => {
        if (newKnowledge.title.trim()) {
            const knowledge: Knowledge = {
                id: Date.now().toString(),
                title: newKnowledge.title,
                description: newKnowledge.description
            };
            setKnowledges([...knowledges, knowledge]);
            setNewKnowledge({ title: "", description: "" });
            setIsAdding(false);
        }
    };

    const handleRemoveKnowledge = (id: string) => {
        setKnowledges(knowledges.filter(k => k.id !== id));
    };

    return (
        <div className="space-y-4">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                    Add knowledge base articles or references related to this document
                </p>
                {!isAdding && (
                    <Button
                        onClick={() => setIsAdding(true)}
                        variant="default"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Knowledge
                    </Button>
                )}
            </div>

            {/* Add Knowledge Form */}
            {isAdding && (
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-3">
                    <div>
                        <label className="text-xs md:text-sm font-medium text-slate-700 block mb-1.5">
                            Title<span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            type="text"
                            value={newKnowledge.title}
                            onChange={(e) => setNewKnowledge({ ...newKnowledge, title: e.target.value })}
                            placeholder="Enter knowledge title"
                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="text-xs md:text-sm font-medium text-slate-700 block mb-1.5">
                            Description
                        </label>
                        <textarea
                            value={newKnowledge.description}
                            onChange={(e) => setNewKnowledge({ ...newKnowledge, description: e.target.value })}
                            placeholder="Enter description (optional)"
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            onClick={handleAddKnowledge}
                            size="sm"
                            disabled={!newKnowledge.title.trim()}
                        >
                            Add
                        </Button>
                        <Button
                            onClick={() => {
                                setIsAdding(false);
                                setNewKnowledge({ title: "", description: "" });
                            }}
                            variant="outline"
                            size="sm"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Knowledges List */}
            {knowledges.length > 0 ? (
                <div className="space-y-2">
                    {knowledges.map((knowledge) => (
                        <div
                            key={knowledge.id}
                            className="flex items-start justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-start gap-3 flex-1">
                                <BookOpen className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">{knowledge.title}</p>
                                    {knowledge.description && (
                                        <p className="text-xs text-slate-500 mt-1">{knowledge.description}</p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemoveKnowledge(knowledge.id)}
                                className="p-1 hover:bg-slate-200 rounded transition-colors flex-shrink-0"
                            >
                                <X className="h-4 w-4 text-slate-600" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-slate-500">
                    <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm">No knowledge articles added yet</p>
                </div>
            )}
        </div>
    );
};
