import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconSmartHome } from "@tabler/icons-react";
import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button/Button";
import { TrainingConfig, TrainingType, TrainingFile, TrainingMethod, Recurrence } from "../../types";
import { BasicInfoTab } from "./BasicInfoTab";
import { DocumentTab } from "./DocumentTab";
import { ConfigTab } from "./ConfigTab";

type TabType = "basic-info" | "document-training" | "training-config";

const TABS: { id: TabType; label: string }[] = [
    { id: "basic-info", label: "Basic Information" },
    { id: "document-training", label: "Document Training" },
    { id: "training-config", label: "Training Configuration" },
];

export const CreateCourseView: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>("basic-info");

    // Basic Training Info
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [trainingType, setTrainingType] = useState<TrainingType>("GMP");
    const [trainingMethod, setTrainingMethod] = useState<TrainingMethod>("Read & Understood");
    const [instructorType, setInstructorType] = useState<"internal" | "external">("internal");
    const [instructor, setInstructor] = useState("");
    const [scheduledDate, setScheduledDate] = useState("");
    const [duration, setDuration] = useState(4);
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState(30);

    // Linked document
    const [linkedDocumentId, setLinkedDocumentId] = useState("");
    const [linkedDocumentTitle, setLinkedDocumentTitle] = useState("");

    // Recurrence
    const [recurrence, setRecurrence] = useState<Recurrence>({ enabled: false, intervalMonths: 12 });

    // Evidence upload
    const [evidenceFiles, setEvidenceFiles] = useState<File[]>([])

    // Distribution List
    const [distributionList, setDistributionList] = useState<string[]>([]);

    // Training Materials
    const [trainingFiles, setTrainingFiles] = useState<TrainingFile[]>([]);

    // Quiz Configuration
    const [hasQuiz, setHasQuiz] = useState(false);
    const [config, setConfig] = useState<TrainingConfig>({
        trainingType: "test_certification",
        passingScore: 7,
        maxAttempts: 3,
        trainingPeriodDays: 7,
        distributionList: [],
        questions: []
    });

    const handleSave = () => {
        if (!title.trim()) {
            alert("Please enter training title");
            return;
        }

        console.log({
            title,
            description,
            trainingType,
            instructor,
            scheduledDate,
            duration,
            location,
            capacity,
            trainingFiles: trainingFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
            hasQuiz,
            config: hasQuiz ? config : undefined,
        });

        navigate("/training-management/courses-list");
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "basic-info":
                return (
                    <BasicInfoTab
                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                        trainingType={trainingType}
                        setTrainingType={setTrainingType}
                        trainingMethod={trainingMethod}
                        setTrainingMethod={setTrainingMethod}
                        instructorType={instructorType}
                        setInstructorType={setInstructorType}
                        instructor={instructor}
                        setInstructor={setInstructor}
                        scheduledDate={scheduledDate}
                        setScheduledDate={setScheduledDate}
                        duration={duration}
                        setDuration={setDuration}
                        location={location}
                        setLocation={setLocation}
                        capacity={capacity}
                        setCapacity={setCapacity}
                        distributionList={distributionList}
                        setDistributionList={setDistributionList}
                        recurrence={recurrence}
                        setRecurrence={setRecurrence}
                        linkedDocumentId={linkedDocumentId}
                        setLinkedDocumentId={setLinkedDocumentId}
                        linkedDocumentTitle={linkedDocumentTitle}
                        setLinkedDocumentTitle={setLinkedDocumentTitle}
                        evidenceFiles={evidenceFiles}
                        setEvidenceFiles={setEvidenceFiles}
                    />
                );
            case "document-training":
                return (
                    <DocumentTab
                        trainingFiles={trainingFiles}
                        setTrainingFiles={setTrainingFiles}
                    />
                );
            case "training-config":
                return (
                    <ConfigTab
                        trainingMethod={trainingMethod}
                        hasQuiz={hasQuiz}
                        setHasQuiz={setHasQuiz}
                        config={config}
                        setConfig={setConfig}
                    />
                );
            default:
                return null;
        }
    };

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
                        <span className="hidden sm:inline">Training Management</span>
                        <span className="sm:hidden">...</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="hidden sm:inline">Course Inventory</span>
                        <span className="sm:hidden">...</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-slate-700 font-medium">Create Training</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/training-management/courses-list")}
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

            {/* Tab Container */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Tab Navigation */}
                <div className="border-b border-slate-200">
                    <div className="flex overflow-x-auto">
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 md:px-6 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors border-r border-slate-200 last:border-r-0",
                                        isActive
                                            ? "border-b-emerald-600 text-emerald-700 bg-emerald-50/50"
                                            : "border-b-transparent text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                                    )}
                                >
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="animate-in fade-in duration-200">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};
