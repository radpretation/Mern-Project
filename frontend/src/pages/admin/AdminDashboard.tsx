import React, { useEffect, useState } from 'react';
import { Users, UserCheck, ShieldCheck, FileCheck, Layers, Archive, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/dashboard-stats')
      .then((res) => setStats(res.data.stats))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const cards = [
    {
      title: 'Active Customers',
      value: stats?.totalCustomers ?? '...',
      icon: Users,
      link: '/admin/customers',
    },
    {
      title: 'Qualified Security Assessors (QSA)',
      value: stats?.totalQsa ?? '...',
      icon: UserCheck,
      link: '/admin/assessors?type=2',
    },
    {
      title: 'Quality Assurance Reviewers (QA)',
      value: stats?.totalQa ?? '...',
      icon: ShieldCheck,
      link: '/admin/assessors?type=3',
    },
    {
      title: 'Compliance Consultants',
      value: stats?.totalConsultants ?? '...',
      icon: UserCheck,
      link: '/admin/assessors?type=4',
    },
    {
      title: 'Active Compliance Projects',
      value: stats?.totalComplianceProjects ?? '...',
      icon: FileCheck,
      link: '/admin/compliances',
    },
    {
      title: 'Audited Customer Processes',
      value: stats?.totalActiveProcesses ?? '...',
      icon: Layers,
      link: '/admin/customers',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Super Administrator Dashboard</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Master control center for cybersecurity assessments, multi-tenant engagements, and assessor assignments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={i}
              to={c.link}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-sky-400 shadow-2xs hover:shadow-xs transition group relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{c.title}</p>
                  <h3 className="text-3xl font-black text-slate-900">{c.value}</h3>
                </div>
                <div className="p-3 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 shadow-2xs">
                  <Icon className="w-5 h-5 text-sky-600" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-sky-600 font-semibold group-hover:text-sky-700">
                <span>Manage records</span>
                <ArrowUpRight className="w-4 h-4 text-sky-600 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
