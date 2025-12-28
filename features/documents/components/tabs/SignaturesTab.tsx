import React from "react";
import { FileSignature } from "lucide-react";

export const SignaturesTab: React.FC = () => {
  return (
    <div className="py-12 text-center">
      <FileSignature className="h-12 w-12 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-500 text-sm">
        Signatures content will be displayed here
      </p>
    </div>
  );
};
