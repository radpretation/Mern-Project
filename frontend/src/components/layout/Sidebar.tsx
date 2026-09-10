import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShieldAlert,
  FileCheck2,
  Archive,
  FileSpreadsheet,
  FileText,
  Settings,
  FolderLock,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserType } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const userType = user?.userType;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs transition ${
      isActive
        ? 'bg-sky-50 text-sky-600 font-bold border border-sky-200 shadow-2xs'
        : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50/60 font-medium'
    }`;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 bottom-0 left-0 z-40 w-64 h-[calc(100vh-4rem)] shrink-0 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          {/* Admin Navigation */}
          {userType === UserType.ADMIN && (
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Administration
              </p>
              <NavLink to="/admin/dashboard" className={linkClass}>
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard Overview</span>
              </NavLink>
              <NavLink to="/admin/customers" className={linkClass}>
                <Users className="w-4 h-4 shrink-0" />
                <span>Customers Management</span>
              </NavLink>
              <NavLink to="/admin/assessors" className={linkClass}>
                <UserCheck className="w-4 h-4 shrink-0" />
                <span>Auditors (QSA / QA / Cons)</span>
              </NavLink>

              <p className="px-3 pt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Frameworks & Projects
              </p>
              <NavLink to="/admin/compliances" className={linkClass}>
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Compliance Projects</span>
              </NavLink>
              <NavLink to="/admin/questionnaires" className={linkClass}>
                <FileCheck2 className="w-4 h-4 shrink-0" />
                <span>Questionnaires / Controls</span>
              </NavLink>
              <NavLink to="/admin/archives" className={linkClass}>
                <Archive className="w-4 h-4 shrink-0" />
                <span>Archived Processes</span>
              </NavLink>
            </div>
          )}

          {/* Customer Navigation */}
          {userType === UserType.CUSTOMER && (
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Customer Workspace
              </p>
              <NavLink to="/customer/dashboard" className={linkClass}>
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>My Audit Processes</span>
              </NavLink>
              <NavLink to="/customer/reports" className={linkClass}>
                <Award className="w-4 h-4 shrink-0" />
                <span>Attestations & Reports</span>
              </NavLink>
            </div>
          )}

          {/* QSA Navigation */}
          {userType === UserType.QSA && (
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                QSA Assessment Portal
              </p>
              <NavLink to="/qsa/dashboard" className={linkClass}>
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Assigned Audits</span>
              </NavLink>
            </div>
          )}

          {/* QA Navigation */}
          {userType === UserType.QA && (
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quality Assurance Portal
              </p>
              <NavLink to="/qa/dashboard" className={linkClass}>
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>QA Review Engagements</span>
              </NavLink>
            </div>
          )}

          {/* Consultant Navigation */}
          {userType === UserType.CONSULTANT && (
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Consultant Portal
              </p>
              <NavLink to="/consultant/dashboard" className={linkClass}>
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Client Consultations</span>
              </NavLink>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100">
            <NavLink to="/profile" className={linkClass}>
              <Settings className="w-4 h-4 shrink-0" />
              <span>Profile & Password</span>
            </NavLink>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium">
            <FolderLock className="w-3.5 h-3.5 text-slate-400" />
            <span>Encrypted Audit Vault v2.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
