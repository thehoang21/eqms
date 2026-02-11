import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Bell,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  TrendingUp,
  PieChart
} from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/app/routes.constants';
import { Select } from '@/components/ui/select/Select';

// Mock Data
const MOCK_STATS = {
  documents: { total: 248, trend: 12, trendUp: true },
  pendingReviews: { total: 15, trend: 3, trendUp: false },
  openDeviations: { total: 8, trend: 2, trendUp: false },
  activeTasks: { total: 34, trend: 5, trendUp: true },
  completionRate: { total: 87, trend: 4, trendUp: true, suffix: '%' },
  avgCycleTime: { total: 3.2, trend: 0.5, trendUp: false, suffix: ' Days' },
};

const MOCK_CHART_DATA = {
  monthlyData: [
    { month: 'JAN', value: 120 },
    { month: 'FEB', value: 210 },
    { month: 'MAR', value: 285 },
    { month: 'APR', value: 145 },
    { month: 'MAY', value: 340 },
    { month: 'JUN', value: 275 },
    { month: 'JUL', value: 215 },
    { month: 'AUG', value: 205 },
    { month: 'SEP', value: 290 },
    { month: 'OCT', value: 335 },
    { month: 'NOV', value: 280 },
    { month: 'DEC', value: 125 },
  ]
};

const MOCK_ACTIVITIES = [
  { id: 1, type: 'document', title: 'SOP-QA-002 approved', time: '5 min ago', status: 'success' },
  { id: 2, type: 'task', title: 'CAPA-2024-001 assigned to you', time: '23 min ago', status: 'info' },
  { id: 3, type: 'deviation', title: 'DEV-2024-008 opened', time: '1 hour ago', status: 'warning' },
  { id: 4, type: 'document', title: 'FORM-QC-005 revision submitted', time: '2 hours ago', status: 'info' },
  { id: 5, type: 'training', title: 'GMP training completed', time: '5 hours ago', status: 'success' },
];

const MOCK_DEADLINES = [
  { id: 1, title: 'Review SOP-PROD-003', dueDate: 'Today', priority: 'high', module: 'Document Control' },
  { id: 2, title: 'Complete CAPA Investigation', dueDate: 'Tomorrow', priority: 'high', module: 'CAPA' },
  { id: 3, title: 'Approve Change Request CCR-045', dueDate: 'Jan 10', priority: 'medium', module: 'Change Control' },
  { id: 4, title: 'Training: Data Integrity', dueDate: 'Jan 12', priority: 'medium', module: 'Training' },
];

const QUICK_ACTIONS = [
  { label: 'New Document', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { label: 'Report Incident', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  { label: 'Schedule Audit', icon: CheckSquare, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { label: 'System Alert', icon: Bell, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
];

const Counter = ({ value, suffix = '' }: { value: number | string, suffix?: string }) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (typeof value === 'string' && value.includes('.')) {
      return latest.toFixed(1) + suffix;
    }
    return Math.round(latest) + suffix;
  });

  useEffect(() => {
    const controls = animate(count, numericValue, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [numericValue]);

  return <motion.span>{rounded}</motion.span>;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

export const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chartPeriod, setChartPeriod] = useState('month');

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get user's full name
  const getUserFullName = () => {
    if (!user) return 'User';
    return `${user.firstName} ${user.lastName}`.trim() || user.username;
  };

  // Custom Tooltip for Chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200">
          <p className="text-sm font-semibold text-slate-900">{data.payload.month}</p>
          <p className="text-xs text-slate-600">
            {data.value.toLocaleString()} documents
          </p>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis values
  const formatYAxis = (value: number) => {
    if (value >= 1000) return `${value / 1000}k`;
    return String(value);
  };

  return (
    <motion.div
      className="space-y-6 w-full flex-1 flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome & Quick Actions Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Banner */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-lg">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{getGreeting()}, {getUserFullName()} 👋</h1>
            <p className="text-slate-300 max-w-xl mb-6 text-lg">
              Here is what's happening in your Quality Management System today. You have <span className="text-white font-semibold">12 pending tasks</span> requiring your attention.
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(ROUTES.MY_TASKS)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm transition-colors shadow-lg shadow-emerald-900/20"
              >
                View My Tasks
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium text-sm backdrop-blur-sm transition-colors border border-white/10"
              >
                Latest Deviations
              </motion.button>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
           <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Quick Actions</h2>
            <p className="text-sm text-slate-500 mb-4">Common tasks and shortcuts</p>
           </div>
           <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((action, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02, backgroundColor: "var(--bg-hover)" }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center gap-2 group",
                    "bg-white hover:border-emerald-200 border-slate-100",
                    action.border
                  )}
                  style={{ "--bg-hover": "var(--slate-50)" } as React.CSSProperties}
                >
                  <div className={cn("p-2 rounded-lg", action.bg, action.color)}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                    {action.label}
                  </span>
                </motion.button>
              ))}
           </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Documents',
            value: MOCK_STATS.documents.total,
            trend: 12,
            icon: FileText,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
          },
          {
            title: 'Pending Reviews',
            value: MOCK_STATS.pendingReviews.total,
            trend: -2,
            icon: AlertCircle,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
          },
          {
            title: 'Deviations',
            value: MOCK_STATS.openDeviations.total,
            trend: 5,
            icon: AlertTriangle,
            color: 'text-red-600',
            bg: 'bg-red-50'
          },
          {
            title: 'Completion Rate',
            value: 98,
            suffix: '%',
            trend: 3,
            icon: CheckCircle2,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-2.5 rounded-lg", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center text-xs font-bold px-2 py-1 rounded-full",
                stat.trend > 0 ? "text-emerald-700 bg-emerald-50" : "text-amber-700 bg-amber-50"
              )}>
                {stat.trend > 0 ? "+" : ""}{stat.trend}%
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                <Counter value={stat.value} suffix={stat.suffix || ''} />
              </h3>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Document Trend Chart */}
        <motion.div 
          variants={itemVariants}
          className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <PieChart className="h-5 w-5 text-emerald-600" />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-slate-900">Overall Document Activity</h3>
                  <p className="text-sm text-slate-500">Monthly document creation trends</p>
               </div>
            </div>
            <div className="w-full md:w-32">
              <Select
                value={chartPeriod}
                onChange={setChartPeriod}
                options={[
                  { label: 'Month', value: 'month' },
                  { label: 'Quarter', value: 'quarter' },
                  { label: 'Year', value: 'year' },
                ]}
                enableSearch={false}
                triggerClassName="text-sm"
              />
            </div>
          </div>

          <div className="p-6 flex-1 min-h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={MOCK_CHART_DATA.monthlyData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                      <stop offset="100%" stopColor="#34d399" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e2e8f0" 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                    tickFormatter={formatYAxis}
                    dx={-10}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#barGradient)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right Column Stack */}
        <div className="space-y-6">
           {/* Deadlines Widget */}
           <motion.div 
             variants={itemVariants} 
             className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
           >
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                 <h3 className="font-bold text-slate-900 flex items-center gap-2">
                   <Clock className="h-4 w-4 text-slate-500" />
                   Priority Deadlines
                 </h3>
                 <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">3 High</span>
              </div>
              <div className="divide-y divide-slate-100">
                 {MOCK_DEADLINES.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                       <div className="flex items-start gap-3">
                          <div className={cn(
                             "w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0 border",
                             item.priority === 'high' ? "bg-red-50 border-red-100 text-red-600" : "bg-amber-50 border-amber-100 text-amber-600"
                          )}>
                             <span className="text-[10px] font-bold uppercase">{item.dueDate.substring(0, 3)}</span>
                             <span className="text-sm font-bold leading-none">{idx + 10}</span>
                          </div>
                          <div>
                             <p className="text-sm font-semibold text-slate-900 line-clamp-1">{item.title}</p>
                             <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xs text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">{item.module}</span>
                                {item.priority === 'high' && (
                                   <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide flex items-center gap-1">
                                      <AlertCircle className="h-3 w-3" /> Critical
                                   </span>
                                )} 
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                 <button className="text-xs font-medium text-slate-600 hover:text-slate-900">View all deadlines</button>
              </div>
           </motion.div>
        
        {/* Recent Activity Widget */}
        <motion.div 
           variants={itemVariants} 
           className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
           <div className="p-5 border-b border-slate-100 bg-slate-50/50">
               <h3 className="font-bold text-slate-900 flex items-center gap-2">
                   <Activity className="h-4 w-4 text-slate-500" />
                   Recent Activity
               </h3>
           </div>
           <div className="p-5">
              <div className="relative">
                 <div className="absolute top-0 bottom-0 left-[7px] w-px bg-slate-200" />
                 <div className="space-y-6">
                    {MOCK_ACTIVITIES.slice(0, 4).map((activity, idx) => (
                       <div key={idx} className="relative pl-8">
                          <div className={cn(
                             "absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ring-1",
                             activity.status === 'success' ? "bg-emerald-500 ring-emerald-100" :
                             activity.status === 'warning' ? "bg-amber-500 ring-amber-100" :
                             "bg-blue-500 ring-blue-100"
                          )} />
                          <p className="text-sm text-slate-900 font-medium">{activity.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </motion.div>
        </div>
      </div>
    </motion.div>

  );
};