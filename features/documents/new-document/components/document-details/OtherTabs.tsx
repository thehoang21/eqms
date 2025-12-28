import React, { useState, useEffect } from "react";
import { CheckCircle, Plus, Trash2, Book, Copy, Link2 } from "lucide-react";
import { Approver, Knowledge, ControlledCopy, RelatedDocument } from "./types";
import { Select } from "../../../../../components/ui/select/Select";

interface TabProps {
    onCountChange?: (count: number) => void;
}

export const ApproversTab: React.FC<TabProps> = ({ onCountChange }) => {
    // TODO: API Integration - Replace with API call
    // Example: const { data: approvers } = useQuery('approvers', fetchApprovers);
    const [approvers, setApprovers] = useState<Approver[]>([
        {
            id: "1",
            name: "Dr. Emily Parker",
            role: "Quality Director",
            email: "emily.parker@company.com",
            assignedDate: "2024-03-20",
            status: "Approved"
        },
        {
            id: "2",
            name: "Robert Martinez",
            role: "VP Operations",
            email: "robert.martinez@company.com",
            assignedDate: "2024-03-20",
            status: "Pending"
        },
        {
            id: "3",
            name: "Lisa Thompson",
            role: "Compliance Manager",
            email: "lisa.thompson@company.com",
            assignedDate: "2024-03-21",
            status: "Pending"
        }
    ]);

    useEffect(() => {
        onCountChange?.(approvers.length);
    }, [approvers.length, onCountChange]);

    const addApprover = () => {
        setApprovers([...approvers, {
            id: Date.now().toString(),
            name: "",
            email: "",
            role: "",
            order: approvers.length + 1
        }]);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Document Approvers</h3>
                <button onClick={addApprover} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                    <Plus className="h-4 w-4" />
                    Add Approver
                </button>
            </div>

            {approvers.length > 0 ? (
                <div className="space-y-3">
                    {approvers.map((approver, index) => (
                        <div key={approver.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                                {index + 1}
                            </div>
                            <input type="text" placeholder="Approver name" className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                            <input type="text" placeholder="Role" className="w-40 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                            <button onClick={() => setApprovers(approvers.filter(a => a.id !== approver.id))} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <CheckCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 font-medium">No Approvers Added</p>
                    <p className="text-xs text-slate-500 mt-1">Add approvers in sequential order for approval workflow</p>
                </div>
            )}
        </div>
    );
};

export const KnowledgesTab: React.FC<TabProps> = ({ onCountChange }) => {
    // TODO: API Integration - Replace with API call
    // Example: const { data: knowledges } = useQuery('knowledges', fetchKnowledges);
    const [knowledges, setKnowledges] = useState<Knowledge[]>([
        {
            id: "1",
            title: "ISO 9001:2015 Quality Management Systems",
            category: "Standards",
            description: "International standard for quality management",
            link: "https://iso.org/standard/62085.html"
        },
        {
            id: "2",
            title: "FDA 21 CFR Part 11",
            category: "Regulations",
            description: "Electronic Records and Electronic Signatures",
            link: "https://fda.gov/part11"
        },
        {
            id: "3",
            title: "Good Documentation Practices",
            category: "Training",
            description: "Best practices for pharmaceutical documentation",
            link: "#"
        },
        {
            id: "4",
            title: "CAPA Process Guidelines",
            category: "Procedures",
            description: "Corrective and Preventive Action procedures",
            link: "#"
        }
    ]);

    useEffect(() => {
        onCountChange?.(knowledges.length);
    }, [knowledges.length, onCountChange]);

    const addKnowledge = () => {
        setKnowledges([...knowledges, {
            id: Date.now().toString(),
            title: "",
            category: ""
        }]);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Document Knowledge Base</h3>
                <button onClick={addKnowledge} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                    <Plus className="h-4 w-4" />
                    Add Knowledge
                </button>
            </div>

            {knowledges.length > 0 ? (
                <div className="space-y-3">
                    {knowledges.map((knowledge) => (
                        <div key={knowledge.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <Book className="h-5 w-5 text-slate-400" />
                            <input type="text" placeholder="Knowledge title" className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                            <input type="text" placeholder="Category" className="w-48 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                            <button onClick={() => setKnowledges(knowledges.filter(k => k.id !== knowledge.id))} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <Book className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 font-medium">No Knowledge Items</p>
                    <p className="text-xs text-slate-500 mt-1">Add knowledge items associated with this document</p>
                </div>
            )}
        </div>
    );
};

export const ControlledCopiesTab: React.FC<TabProps> = ({ onCountChange }) => {
    // TODO: API Integration - Replace with API call
    // Example: const { data: copies } = useQuery('controlledCopies', fetchControlledCopies);
    const [copies, setCopies] = useState<ControlledCopy[]>([
        {
            id: "1",
            copyNumber: "CC-001",
            location: "Quality Lab - Building A",
            holder: "Lab Manager",
            distributedDate: "2024-03-25",
            status: "Active"
        },
        {
            id: "2",
            copyNumber: "CC-002",
            location: "Production Floor - Building B",
            holder: "Production Supervisor",
            distributedDate: "2024-03-25",
            status: "Active"
        }
    ]);

    useEffect(() => {
        onCountChange?.(copies.length);
    }, [copies.length, onCountChange]);

    const addCopy = () => {
        setCopies([...copies, {
            id: Date.now().toString(),
            copyNumber: `C-${(copies.length + 1).toString().padStart(3, '0')}`,
            location: "",
            holder: ""
        }]);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Controlled Copy Distribution</h3>
                <button onClick={addCopy} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                    <Plus className="h-4 w-4" />
                    Add Copy
                </button>
            </div>

            {copies.length > 0 ? (
                <div className="space-y-3">
                    {copies.map((copy) => (
                        <div key={copy.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <Copy className="h-5 w-5 text-slate-400" />
                            <input type="text" value={copy.copyNumber} readOnly className="w-32 px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-100 text-slate-500" />
                            <input type="text" placeholder="Location" className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                            <input type="text" placeholder="Copy holder" className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                            <button onClick={() => setCopies(copies.filter(c => c.id !== copy.id))} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <Copy className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 font-medium">No Controlled Copies</p>
                    <p className="text-xs text-slate-500 mt-1">Track physical or controlled copies of this document</p>
                </div>
            )}
        </div>
    );
};

export const RelatedDocumentsTab: React.FC<TabProps> = ({ onCountChange }) => {
    // TODO: API Integration - Replace with API call
    // Example: const { data: relatedDocs } = useQuery('relatedDocuments', fetchRelatedDocuments);
    const [relatedDocs, setRelatedDocs] = useState<RelatedDocument[]>([
        {
            id: "1",
            documentId: "DOC-SOP-001",
            title: "Standard Operating Procedure - Document Control",
            type: "SOP",
            relationship: "Parent",
            version: "2.0"
        },
        {
            id: "2",
            documentId: "DOC-FORM-025",
            title: "Document Review Form",
            type: "Form",
            relationship: "Reference",
            version: "1.5"
        },
        {
            id: "3",
            documentId: "DOC-WI-042",
            title: "Work Instruction - Quality Inspection",
            type: "Work Instruction",
            relationship: "Related",
            version: "3.1"
        },
        {
            id: "4",
            documentId: "DOC-POL-010",
            title: "Quality Management Policy",
            type: "Policy",
            relationship: "Parent",
            version: "1.0"
        },
        {
            id: "5",
            documentId: "DOC-TRN-015",
            title: "GMP Training Module",
            type: "Training",
            relationship: "Reference",
            version: "2.3"
        }
    ]);

    useEffect(() => {
        onCountChange?.(relatedDocs.length);
    }, [relatedDocs.length, onCountChange]);

    const relationshipOptions = [
        { label: "Reference", value: "Reference" },
        { label: "Supersedes", value: "Supersedes" },
        { label: "Related", value: "Related" },
        { label: "Attachment", value: "Attachment" },
        { label: "Parent", value: "Parent" }
    ];

    const addRelatedDoc = () => {
        setRelatedDocs([...relatedDocs, {
            id: Date.now().toString(),
            documentNumber: "",
            title: "",
            relationship: "Reference"
        }]);
    };

    const updateDocRelationship = (docId: string, relationship: string) => {
        setRelatedDocs(relatedDocs.map(doc => 
            doc.id === docId ? { ...doc, relationship } : doc
        ));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Related Documents</h3>
                <button onClick={addRelatedDoc} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
                    <Plus className="h-4 w-4" />
                    Add Document
                </button>
            </div>

            {relatedDocs.length > 0 ? (
                <div className="space-y-3">
                    {relatedDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <Link2 className="h-5 w-5 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Document #" 
                                defaultValue={doc.documentId}
                                className="w-40 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" 
                            />
                            <input 
                                type="text" 
                                placeholder="Document title" 
                                defaultValue={doc.title}
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" 
                            />
                            <div className="w-40">
                                <Select
                                    value={doc.relationship || "Reference"}
                                    onChange={(value) => updateDocRelationship(doc.id, value)}
                                    options={relationshipOptions}
                                    placeholder="Select type"
                                    enableSearch={false}
                                    triggerClassName="h-[42px]"
                                />
                            </div>
                            <button 
                                onClick={() => setRelatedDocs(relatedDocs.filter(d => d.id !== doc.id))} 
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <Link2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 font-medium">No Related Documents</p>
                    <p className="text-xs text-slate-500 mt-1">Link related documents, references, or attachments</p>
                </div>
            )}
        </div>
    );
};
