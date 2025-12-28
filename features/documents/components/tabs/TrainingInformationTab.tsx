import React from "react";
import { GraduationCap } from "lucide-react";

export const TrainingInformationTab: React.FC = () => {
  return (
    <div className="py-12 text-center">
      <GraduationCap className="h-12 w-12 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-500 text-sm">
        Training information content will be displayed here
      </p>
    </div>
  );
};
