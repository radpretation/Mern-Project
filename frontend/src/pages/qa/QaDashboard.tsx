import React, { useEffect, useState } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'sonner';

export const QaDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/qa/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load QA engagements.'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Quality Assurance (QA) Engagements</h2>
        <p className="text-sm text-slate-500 font-medium">
          Secondary quality gate to audit QSA findings, verify sampling, and execute bulk quality approvals.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-sky-600" />
          <span>Assigned QA Review Engagements</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-slate-400">Loading QA assignments...</div>
          ) : data?.complianceProjects?.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400">No QA reviews currently assigned.</div>
          ) : (
            data?.complianceProjects?.map((cp: any) => (
              <div
                key={cp._id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-sky-400 shadow-2xs transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 bg-sky-50 text-sky-700 font-bold rounded-lg text-xs border border-sky-200">
                      {cp.serviceName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {cp.startDate ? `${cp.startDate} → ${cp.endDate}` : 'Active'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {cp.customerId?.companyName || cp.customerId?.fullName}
                    </h4>
                    <p className="text-xs text-sky-600 font-medium mt-0.5">{cp.processId?.processName}</p>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
                  <Link
                    to={`/qa/audit-view?processId=${cp.processId?._id}&serviceId=${cp.serviceId}&customerId=${cp.customerId?._id}`}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5"
                  >
                    <span>Execute QA Review</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
