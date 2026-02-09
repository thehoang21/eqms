import React from "react";

interface SignatureEntry {
  id: string;
  name: string;
  signedOn: string; // dd/MM/yyyy HH:mm:ss
}

interface ReviewSignaturesTabProps {
  type: "reviewers" | "approvers";
  signatures?: SignatureEntry[];
}

// Mock data
const MOCK_REVIEWERS: SignatureEntry[] = [
  { id: "1", name: "Nguyen Van A", signedOn: "15/01/2026 09:30:45" },
  { id: "2", name: "Tran Thi B", signedOn: "15/01/2026 10:15:22" },
  { id: "3", name: "Le Van C", signedOn: "" },
];

const MOCK_APPROVERS: SignatureEntry[] = [
  { id: "1", name: "Pham Thi D", signedOn: "" },
];

export const ReviewSignaturesTab: React.FC<ReviewSignaturesTabProps> = ({
  type,
  signatures: externalSignatures,
}) => {
  const isReviewers = type === "reviewers";
  const signatures = externalSignatures ?? (isReviewers ? MOCK_REVIEWERS : MOCK_APPROVERS);

  return (
    <div className="space-y-4">
      {/* Table */}
      {signatures.length > 0 ? (
        <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-16">
                    No.
                  </th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Name
                  </th>
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    Signed On
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {signatures.map((sig, index) => (
                  <tr key={sig.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-sm text-slate-500 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      <span className="font-medium text-slate-900">{sig.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                      {sig.signedOn ? (
                        <span className="text-slate-700">{sig.signedOn}</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-sm font-medium text-slate-500">
            No {isReviewers ? "reviewers" : "approvers"} assigned
          </p>
        </div>
      )}
    </div>
  );
};
