import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckSquare,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  FolderOpen,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  Bell,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  BookOpen,
  ClipboardCheck,
  FileCheck,
} from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { IconRadarFilled } from '@tabler/icons-react';

// Mock Data
const MOCK_STATS = {
  documents: { total: 248, trend: 12, trendUp: true },
  pendingReviews: { total: 15, trend: 3, trendUp: false },
  openDeviations: { total: 8, trend: 2, trendUp: false },
  activeTasks: { total: 34, trend: 5, trendUp: true },
  completionRate: { total: 87, trend: 4, trendUp: true },
  avgCycleTime: { total: 3.2, trend: 0.5, trendUp: false },
};

const MOCK_CHART_DATA = {
  timeline: [
    { month: 'Jan', documents: 42, tasks: 65, deviations: 8 },
    { month: 'Feb', documents: 38, tasks: 58, deviations: 5 },
    { month: 'Mar', documents: 45, tasks: 72, deviations: 12 },
    { month: 'Apr', documents: 52, tasks: 68, deviations: 7 },
    { month: 'May', documents: 48, tasks: 75, deviations: 9 },
    { month: 'Jun', documents: 55, tasks: 82, deviations: 6 },
  ],
  documentStatus: [
    { name: 'Effective', value: 145, color: 'bg-emerald-500' },
    { name: 'Pending Review', value: 28, color: 'bg-amber-500' },
    { name: 'Pending Approval', value: 18, color: 'bg-blue-500' },
    { name: 'Draft', value: 42, color: 'bg-slate-400' },
    { name: 'Archive', value: 15, color: 'bg-red-500' },
  ],
  tasksByModule: [
    { module: 'Document Control', count: 12, color: 'bg-emerald-500' },
    { module: 'CAPA', count: 8, color: 'bg-blue-500' },
    { module: 'Change Control', count: 6, color: 'bg-purple-500' },
    { module: 'Training', count: 5, color: 'bg-amber-500' },
    { module: 'Deviation', count: 3, color: 'bg-red-500' },
  ],
};

const MOCK_ACTIVITIES = [
  { id: 1, type: 'document', title: 'SOP-QA-002 approved', time: '5 min ago', status: 'success' },
  { id: 2, type: 'task', title: 'CAPA-2024-001 assigned to you', time: '23 min ago', status: 'info' },
  { id: 3, type: 'deviation', title: 'DEV-2024-008 opened', time: '1 hour ago', status: 'warning' },
  { id: 4, type: 'document', title: 'FORM-QC-005 revision submitted', time: '2 hours ago', status: 'info' },
  { id: 5, type: 'training', title: 'GMP training completed', time: '5 hours ago', status: 'success' },
];

const MOCK_DEADLINES = [
  { id: 1, title: 'Review SOP-PROD-003', dueDate: '2024-01-06', priority: 'high', module: 'Document Control' },
  { id: 2, title: 'Complete CAPA Investigation', dueDate: '2024-01-08', priority: 'high', module: 'CAPA' },
  { id: 3, title: 'Approve Change Request CCR-045', dueDate: '2024-01-10', priority: 'medium', module: 'Change Control' },
  { id: 4, title: 'Training: Data Integrity', dueDate: '2024-01-12', priority: 'medium', module: 'Training' },
];

export const DashboardView: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line' | 'polar' | 'radar'>('bar');

  const maxDocValue = Math.max(...MOCK_CHART_DATA.timeline.map(d => d.documents));
  const maxTaskValue = Math.max(...MOCK_CHART_DATA.tasksByModule.map(d => d.count));
  const totalDocStatus = MOCK_CHART_DATA.documentStatus.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {[
          {
            title: 'Total Documents',
            value: MOCK_STATS.documents.total,
            trend: MOCK_STATS.documents.trend,
            trendUp: MOCK_STATS.documents.trendUp,
            icon: FileText,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
          {
            title: 'Pending Reviews',
            value: MOCK_STATS.pendingReviews.total,
            trend: MOCK_STATS.pendingReviews.trend,
            trendUp: MOCK_STATS.pendingReviews.trendUp,
            icon: AlertCircle,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
          },
          {
            title: 'Open Deviations',
            value: MOCK_STATS.openDeviations.total,
            trend: MOCK_STATS.openDeviations.trend,
            trendUp: MOCK_STATS.openDeviations.trendUp,
            icon: AlertTriangle,
            color: 'text-red-600',
            bg: 'bg-red-50',
          },
          {
            title: 'Active Tasks',
            value: MOCK_STATS.activeTasks.total,
            trend: MOCK_STATS.activeTasks.trend,
            trendUp: MOCK_STATS.activeTasks.trendUp,
            icon: CheckSquare,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          },
          {
            title: 'Completion Rate',
            value: `${MOCK_STATS.completionRate.total}%`,
            trend: MOCK_STATS.completionRate.trend,
            trendUp: MOCK_STATS.completionRate.trendUp,
            icon: Activity,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
          },
          {
            title: 'Avg Cycle Time',
            value: `${MOCK_STATS.avgCycleTime.total} Days`,
            trend: MOCK_STATS.avgCycleTime.trend,
            trendUp: MOCK_STATS.avgCycleTime.trendUp,
            icon: Clock,
            color: 'text-cyan-600',
            bg: 'bg-cyan-50',
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow cursor-default"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', card.bg)}>
                    <card.icon className={cn('h-5 w-5', card.color)} />
                  </div>
                  <p className="text-sm font-medium text-slate-600">{card.title}</p>
                </div>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-bold text-slate-900">{card.value}</h3>
                  <div className={cn(
                    'flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full',
                    card.trendUp ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                  )}>
                    {card.trendUp ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    <span>{card.trend}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Status & Tasks Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Document Status Chart */}
        <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Document Status</h3>
            <p className="text-sm text-slate-500 mt-1">Distribution and trends</p>
          </div>
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setChartType('bar')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap rounded-md',
                chartType === 'bar'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Bar</span>
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap rounded-md',
                chartType === 'pie'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Pie</span>
            </button>
            <button
              onClick={() => setChartType('line')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap rounded-md',
                chartType === 'line'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Line</span>
            </button>
            <button
              onClick={() => setChartType('polar')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap rounded-md',
                chartType === 'polar'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Polar</span>
            </button>
            <button
              onClick={() => setChartType('radar')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap rounded-md',
                chartType === 'radar'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              <IconRadarFilled className="h-4 w-4" />
              <span className="hidden sm:inline">Radar</span>
            </button>
          </div>
        </div>

        {/* Chart Content */}
        <div className="space-y-6">
          {chartType === 'bar' && (
            <div className="space-y-4">
              {MOCK_CHART_DATA.documentStatus.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="text-slate-900 font-semibold">{item.value}</span>
                  </div>
                  <div className="h-8 bg-slate-50 rounded-lg overflow-hidden flex items-center">
                    <div
                      className={cn('h-full flex items-center justify-end pr-3', item.color)}
                      style={{ width: `${(item.value / totalDocStatus) * 100}%` }}
                    >
                      {item.value > totalDocStatus * 0.15 && (
                        <span className="text-xs font-medium text-white">{item.value}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {chartType === 'line' && (
            <div className="relative h-64">
              <svg viewBox="0 0 600 240" className="w-full h-full">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="40"
                    y1={40 + i * 50}
                    x2="580"
                    y2={40 + i * 50}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                ))}
                {/* Line path */}
                <polyline
                  points={MOCK_CHART_DATA.documentStatus
                    .map((item, idx) => {
                      const x = 80 + idx * 120;
                      const y = 240 - (item.value / totalDocStatus) * 180;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Data points */}
                {MOCK_CHART_DATA.documentStatus.map((item, idx) => {
                  const x = 80 + idx * 120;
                  const y = 240 - (item.value / totalDocStatus) * 180;
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="6" fill="white" stroke="#10b981" strokeWidth="3" />
                      <text x={x} y="230" textAnchor="middle" fontSize="12" fill="#64748b">
                        {item.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {chartType === 'pie' && (
            <div className="relative h-100 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full max-w-sm h-auto">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#f1f5f9" strokeWidth="40" />
                {(() => {
                  let currentAngle = -90;
                  const colors: { [key: string]: string } = {
                    'bg-emerald-500': '#10b981',
                    'bg-amber-500': '#f59e0b',
                    'bg-blue-500': '#3b82f6',
                    'bg-slate-400': '#94a3b8',
                    'bg-red-500': '#ef4444',
                  };
                  return MOCK_CHART_DATA.documentStatus.map((item, idx) => {
                    const percentage = (item.value / totalDocStatus) * 100;
                    const angle = (percentage / 100) * 360;
                    const startAngle = currentAngle;
                    currentAngle += angle;

                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (currentAngle * Math.PI) / 180;
                    const largeArc = angle > 180 ? 1 : 0;

                    const x1 = 100 + 80 * Math.cos(startRad);
                    const y1 = 100 + 80 * Math.sin(startRad);
                    const x2 = 100 + 80 * Math.cos(endRad);
                    const y2 = 100 + 80 * Math.sin(endRad);

                    return (
                      <path
                        key={idx}
                        d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={colors[item.color]}
                        opacity="0.9"
                      />
                    );
                  });
                })()}
                <circle cx="100" cy="100" r="50" fill="white" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <p className="text-3xl font-bold text-slate-900">{totalDocStatus}</p>
                <p className="text-sm text-slate-500">Total</p>
              </div>
            </div>
          )}

          {chartType === 'polar' && (
            <div className="relative h-100 flex items-center justify-center">
              <svg viewBox="0 0 300 300" className="w-full max-w-md h-auto">
                {/* Concentric circles */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <circle
                    key={i}
                    cx="150"
                    cy="150"
                    r={i * 24}
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                ))}
                {/* Polar segments */}
                {(() => {
                  const colors: { [key: string]: string } = {
                    'bg-emerald-500': '#10b981',
                    'bg-amber-500': '#f59e0b',
                    'bg-blue-500': '#3b82f6',
                    'bg-slate-400': '#94a3b8',
                    'bg-red-500': '#ef4444',
                  };
                  const maxValue = Math.max(...MOCK_CHART_DATA.documentStatus.map(d => d.value));
                  let currentAngle = -90;
                  
                  return MOCK_CHART_DATA.documentStatus.map((item, idx) => {
                    const angleStep = 360 / MOCK_CHART_DATA.documentStatus.length;
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + angleStep;
                    currentAngle = endAngle;

                    const radius = (item.value / maxValue) * 120;
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;

                    const x1 = 150 + radius * Math.cos(startRad);
                    const y1 = 150 + radius * Math.sin(startRad);
                    const x2 = 150 + radius * Math.cos(endRad);
                    const y2 = 150 + radius * Math.sin(endRad);

                    return (
                      <path
                        key={idx}
                        d={`M 150 150 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
                        fill={colors[item.color]}
                        opacity="0.8"
                        stroke="white"
                        strokeWidth="2"
                      />
                    );
                  });
                })()}
              </svg>
            </div>
          )}

          {chartType === 'radar' && (
            <div className="relative h-100 flex items-center justify-center">
              <svg viewBox="0 0 300 300" className="w-full max-w-md h-auto">
                {/* Radar grid */}
                {[1, 2, 3, 4, 5].map((level) => {
                  const radius = level * 24;
                  const points = MOCK_CHART_DATA.documentStatus.map((_, idx) => {
                    const angle = (idx * 360 / MOCK_CHART_DATA.documentStatus.length - 90) * Math.PI / 180;
                    const x = 150 + radius * Math.cos(angle);
                    const y = 150 + radius * Math.sin(angle);
                    return `${x},${y}`;
                  }).join(' ');
                  return (
                    <polygon
                      key={level}
                      points={points}
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                  );
                })}
                {/* Axis lines */}
                {MOCK_CHART_DATA.documentStatus.map((item, idx) => {
                  const angle = (idx * 360 / MOCK_CHART_DATA.documentStatus.length - 90) * Math.PI / 180;
                  const x = 150 + 120 * Math.cos(angle);
                  const y = 150 + 120 * Math.sin(angle);
                  return (
                    <line
                      key={idx}
                      x1="150"
                      y1="150"
                      x2={x}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                    />
                  );
                })}
                {/* Data polygon */}
                <polygon
                  points={MOCK_CHART_DATA.documentStatus
                    .map((item, idx) => {
                      const maxValue = Math.max(...MOCK_CHART_DATA.documentStatus.map(d => d.value));
                      const radius = (item.value / maxValue) * 120;
                      const angle = (idx * 360 / MOCK_CHART_DATA.documentStatus.length - 90) * Math.PI / 180;
                      const x = 150 + radius * Math.cos(angle);
                      const y = 150 + radius * Math.sin(angle);
                      return `${x},${y}`;
                    })
                    .join(' ')}
                  fill="#10b981"
                  fillOpacity="0.3"
                  stroke="#10b981"
                  strokeWidth="2"
                />
                {/* Data points */}
                {MOCK_CHART_DATA.documentStatus.map((item, idx) => {
                  const maxValue = Math.max(...MOCK_CHART_DATA.documentStatus.map(d => d.value));
                  const radius = (item.value / maxValue) * 120;
                  const angle = (idx * 360 / MOCK_CHART_DATA.documentStatus.length - 90) * Math.PI / 180;
                  const x = 150 + radius * Math.cos(angle);
                  const y = 150 + radius * Math.sin(angle);
                  const labelX = 150 + 135 * Math.cos(angle);
                  const labelY = 150 + 135 * Math.sin(angle);
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#64748b"
                        fontWeight="500"
                      >
                        {item.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* Legend */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-5 gap-3">
            {MOCK_CHART_DATA.documentStatus.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={cn('h-3 w-3 rounded-full', item.color)}></div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-600">{item.name}</span>
                  <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>

        {/* Tasks by Module */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Tasks by Module</h3>
              <p className="text-sm text-slate-500 mt-1">Active workload</p>
            </div>
            <FolderOpen className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {MOCK_CHART_DATA.tasksByModule.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.module}</span>
                  <span className="text-slate-900 font-semibold">{item.count}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full transition-all', item.color)}
                    style={{ width: `${(item.count / maxTaskValue) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activities & Deadlines Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Activities</h3>
              <p className="text-sm text-slate-500 mt-1">Latest system events</p>
            </div>
            <Activity className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {MOCK_ACTIVITIES.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 group hover:bg-slate-50 p-3 rounded-lg transition-colors">
                <div
                  className={cn(
                    'h-10 w-10 rounded-full flex items-center justify-center shrink-0',
                    activity.status === 'success' && 'bg-emerald-50 text-emerald-600',
                    activity.status === 'warning' && 'bg-amber-50 text-amber-600',
                    activity.status === 'info' && 'bg-blue-50 text-blue-600'
                  )}
                >
                  {activity.status === 'success' && <CheckCircle2 className="h-5 w-5" />}
                  {activity.status === 'warning' && <AlertTriangle className="h-5 w-5" />}
                  {activity.status === 'info' && <Bell className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Upcoming Deadlines</h3>
              <p className="text-sm text-slate-500 mt-1">Tasks requiring attention</p>
            </div>
            <Calendar className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            {MOCK_DEADLINES.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full shrink-0',
                      item.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'
                    )}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.module}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-semibold text-slate-900">{item.dueDate}</p>
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1',
                      item.priority === 'high'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-amber-50 text-amber-700'
                    )}
                  >
                    {item.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};