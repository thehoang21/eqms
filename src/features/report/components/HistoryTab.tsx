import { useState, useMemo } from 'react';
import {
  FileBarChart,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  FileX,
  Search,
  MoreVertical,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { Select } from '@/components/ui/select/Select';
import { TablePagination } from '@/components/ui/table/TablePagination';
import { cn } from '@/components/ui/utils';
import type { ReportType, ReportStatus } from '../types';
import { getTypeColor } from '../types';
import { MOCK_REPORT_HISTORY } from '../data';

/**
 * Custom hook managing the History tab.
 * Returns `filterElement` (renders inside the unified card) and `contentElement` (renders below).
 */
export function useHistoryTab() {
  const [historySearch, setHistorySearch] = useState('');
  const [historyType, setHistoryType] = useState<ReportType | 'All'>('All');
  const [historyStatus, setHistoryStatus] = useState<ReportStatus | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Action Dropdown
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, showAbove: false });

  const filteredHistory = useMemo(() => {
    return MOCK_REPORT_HISTORY.filter((report) => {
      const matchesSearch = report.reportName.toLowerCase().includes(historySearch.toLowerCase());
      const matchesType = historyType === 'All' || report.type === historyType;
      const matchesStatus = historyStatus === 'All' || report.status === historyStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [historySearch, historyType, historyStatus]);

  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredHistory.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredHistory, currentPage]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const handleDropdownToggle = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (openDropdownId === id) {
      setOpenDropdownId(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();

      const menuHeight = 200;
      const menuWidth = 200;
      const safeMargin = 8;

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const shouldShowAbove = spaceBelow < menuHeight && spaceAbove > menuHeight;

      let top: number;
      if (shouldShowAbove) {
        top = rect.top + window.scrollY - 4;
      } else {
        top = rect.bottom + window.scrollY + 4;
      }

      const viewportWidth = window.innerWidth;
      let left = rect.right + window.scrollX - menuWidth;

      if (left + menuWidth > viewportWidth - safeMargin) {
        left = viewportWidth - menuWidth - safeMargin + window.scrollX;
      }
      if (left < safeMargin + window.scrollX) {
        left = safeMargin + window.scrollX;
      }

      setDropdownPosition({ top, left, showAbove: shouldShowAbove });
      setOpenDropdownId(id);
    }
  };

  const handleDownloadReport = (id: string) => {
    console.log('Downloading report:', id);
    setOpenDropdownId(null);
  };

  const handlePreviewReport = (id: string) => {
    console.log('Previewing report:', id);
    setOpenDropdownId(null);
  };

  const handleRegenerateReport = (id: string) => {
    console.log('Regenerating report:', id);
    setOpenDropdownId(null);
  };

  const handleDeleteReport = (id: string) => {
    console.log('Deleting report:', id);
    setOpenDropdownId(null);
  };

  // --- Filter section (inside the unified card) ---
  const filterElement = (
    <div className="p-4 lg:p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-2 xl:col-span-6">
          <label className="text-xs sm:text-sm font-medium text-slate-700 mb-1.5 block">
            Search Reports
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Search by report name..."
              className="w-full h-9 pl-10 pr-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="xl:col-span-3">
          <Select
            label="Report Type"
            value={historyType}
            onChange={(value) => setHistoryType(value as ReportType | 'All')}
            options={[
              { label: 'All Types', value: 'All' },
              { label: 'Document', value: 'Document' },
              { label: 'Training', value: 'Training' },
              { label: 'Deviation', value: 'Deviation' },
              { label: 'CAPA', value: 'CAPA' },
              { label: 'Change Control', value: 'Change Control' },
              { label: 'Audit', value: 'Audit' },
              { label: 'Compliance', value: 'Compliance' },
            ]}
          />
        </div>

        <div className="xl:col-span-3">
          <Select
            label="Status"
            value={historyStatus}
            onChange={(value) => setHistoryStatus(value as ReportStatus | 'All')}
            options={[
              { label: 'All Status', value: 'All' },
              { label: 'Completed', value: 'Completed' },
              { label: 'In Progress', value: 'In Progress' },
              { label: 'Failed', value: 'Failed' },
            ]}
          />
        </div>
      </div>
    </div>
  );

  // --- Content section (below the unified card) ---
  const contentElement = (
    <div className="border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-[60px]">
                No.
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Report Name
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Type
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Format
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Generated Date
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                Generated By
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                Period
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                File Size
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="sticky right-0 bg-slate-50 py-3.5 px-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider z-40 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {paginatedHistory.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center">
                  <FileBarChart className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No reports found</p>
                  <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
                </td>
              </tr>
            ) : (
              paginatedHistory.map((report, index) => (
                <tr key={report.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap text-slate-500">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <div className="font-medium text-slate-900">{report.reportName}</div>
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                        getTypeColor(report.type)
                      )}
                    >
                      {report.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap">
                    {report.format}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap">
                    {report.generatedDate}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap hidden lg:table-cell">
                    {report.generatedBy}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap hidden lg:table-cell">
                    {report.period}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-slate-600 whitespace-nowrap hidden md:table-cell">
                    {report.fileSize}
                  </td>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                        report.status === 'Completed' &&
                          'bg-emerald-50 text-emerald-700 border-emerald-200',
                        report.status === 'In Progress' &&
                          'bg-blue-50 text-blue-700 border-blue-200',
                        report.status === 'Failed' && 'bg-red-50 text-red-700 border-red-200'
                      )}
                    >
                      {report.status === 'Completed' && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {report.status === 'In Progress' && <Clock className="h-3.5 w-3.5" />}
                      {report.status === 'Failed' && <FileX className="h-3.5 w-3.5" />}
                      {report.status}
                    </span>
                  </td>
                  <td
                    onClick={(e) => e.stopPropagation()}
                    className="sticky right-0 bg-white py-3.5 px-4 text-sm text-center z-30 whitespace-nowrap before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[1px] before:bg-slate-200 shadow-[-4px_0_12px_-4px_rgba(0,0,0,0.05)] group-hover:bg-slate-50"
                  >
                    <button
                      onClick={(e) => handleDropdownToggle(report.id, e)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors"
                      aria-label="More actions"
                    >
                      <MoreVertical className="h-4 w-4 text-slate-600" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredHistory.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredHistory.length}
          itemsPerPage={itemsPerPage}
          showItemsPerPageSelector={false}
        />
      )}
    </div>
  );

  // --- Dropdown Portal ---
  const dropdownPortal = openDropdownId
    ? createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 animate-in fade-in duration-150"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDropdownId(null);
            }}
            aria-hidden="true"
          />
          {/* Menu */}
          <div
            className="fixed z-50 min-w-[160px] w-[200px] max-w-[90vw] max-h-[300px] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              transform: dropdownPosition.showAbove ? 'translateY(-100%)' : 'none',
            }}
          >
            <div className="py-1">
              {(() => {
                const report = MOCK_REPORT_HISTORY.find((r) => r.id === openDropdownId);
                const isCompleted = report?.status === 'Completed';
                return (
                  <>
                    {isCompleted && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewReport(openDropdownId);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
                        >
                          <Eye className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium">Preview Report</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadReport(openDropdownId);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
                        >
                          <Download className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium">Download</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRegenerateReport(openDropdownId);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 active:bg-slate-100 transition-colors text-slate-500"
                    >
                      <RefreshCw className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">Regenerate</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReport(openDropdownId);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-red-50 active:bg-red-100 transition-colors text-red-600"
                    >
                      <Trash2 className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">Delete Report</span>
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </>,
        document.body
      )
    : null;

  return {
    filterElement,
    contentElement: (
      <>
        {contentElement}
        {dropdownPortal}
      </>
    ),
  };
}
