import React from 'react';

interface StatusBadgeProps {
  status?: number; // 0..9 for all_status, or 1..4 for single status
  type?: 'all' | 'qsa' | 'qa' | 'consultant' | 'admin';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status = 0, type = 'all', className = '' }) => {
  if (type === 'all') {
    switch (status) {
      case 1:
        return <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200/70 shadow-2xs ${className}`}>QSA Approved</span>;
      case 2:
        return <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200/70 shadow-2xs ${className}`}>QSA Disapproved</span>;
      case 3:
        return <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200/70 shadow-2xs ${className}`}>In Progress</span>;
      case 4:
        return <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70 shadow-2xs ${className}`}>QA Approved</span>;
      case 5:
        return <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200/70 shadow-2xs ${className}`}>QA Disapproved</span>;
      case 6:
        return <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200/70 shadow-2xs ${className}`}>QA Incomplete</span>;
      case 7:
        return <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs ${className}`}>Admin Approved</span>;
      case 8:
        return <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-red-50 text-red-700 border border-red-200/70 shadow-2xs ${className}`}>Admin Disapproved</span>;
      case 9:
        return <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200/70 shadow-2xs ${className}`}>Admin Incomplete</span>;
      default:
        return <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs ${className}`}>Pending Submission</span>;
    }
  }

  // Single Role Statuses
  switch (status) {
    case 1:
      return <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 ${className}`}>Approved</span>;
    case 2:
      return <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200/70 ${className}`}>Disapproved</span>;
    case 3:
      return <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200/70 ${className}`}>In Progress</span>;
    case 4:
      return <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200/70 ${className}`}>Incomplete</span>;
    default:
      return <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${className}`}>Pending Submission</span>;
  }
};
