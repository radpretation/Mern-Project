import React, { useEffect, useState } from 'react';
import { Layers, ArrowRight, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'sonner';

export const CustomerDashboard: React.FC = () => {
  const [processes, setProcesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/customer/dashboard')
      .then((res) => setProcesses(res.data.processes))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load processes.'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Customer Audit Workspace</h2>
        <p className="text-sm text-slate-500 font-medium">
          Select an active audit process to upload evidence, converse with assessors, or inspect framework progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading audit processes...</div>
        ) : processes.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            No active audit processes currently configured for your organization.
          </div>
        ) : (
          processes.map((p) => (
            <Link
              key={p._id}
              to={`/customer/processes/${p._id}`}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-sky-400 shadow-2xs hover:shadow-xs transition group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                  <Layers className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-sky-600 transition">
                    {p.processName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Audit Scope & Environment</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-sky-600 font-semibold">
                <span>View Assigned Frameworks</span>
                <ArrowRight className="w-4 h-4 text-sky-600 transform group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
