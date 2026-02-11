import React from "react";

interface SignatureRecord {
  actionBy: string;
  actionByName: string;
  actionOn: string;
  actionOnValue: string;
}

const mockSignatures: SignatureRecord[] = [
  {
    actionBy: "Submitted By",
    actionByName: "Gilad Kigel",
    actionOn: "Submitted On (Date - Time)",
    actionOnValue: "2025-12-12 07:46:36"
  },
  {
    actionBy: "Rejected By",
    actionByName: "",
    actionOn: "Rejected On (Date - Time)",
    actionOnValue: ""
  },
  {
    actionBy: "Reviewed By",
    actionByName: "Jane Smith",
    actionOn: "Reviewed On (Date - Time)",
    actionOnValue: "2025-12-11 16:30:45"
  },
  {
    actionBy: "Approved By",
    actionByName: "John Doe",
    actionOn: "Approved On (Date - Time)",
    actionOnValue: "2025-12-12 09:15:20"
  },
    {
    actionBy: "Published By",
    actionByName: "Gilad Kigel",
    actionOn: "Published On (Date - Time)",
    actionOnValue: "2025-12-12 07:47:19"
  }
];

export const SignaturesTab: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
        {mockSignatures.map((record, index) => (
          <React.Fragment key={index}>
            {/* Action By Column */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                {record.actionBy}
              </label>
              <div className="h-10 px-3 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-900 flex items-center">
                {record.actionByName}
              </div>
            </div>

            {/* Action On Column */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                {record.actionOn}
              </label>
              <div className="h-10 px-3 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-900 flex items-center">
                {record.actionOnValue}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
