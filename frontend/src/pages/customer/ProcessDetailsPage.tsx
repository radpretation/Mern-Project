import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Layers, FileSpreadsheet, ArrowRight, PieChart } from 'lucide-react';
import api from '../../services/api';
import { DonutChart } from '../../components/common/DonutChart';
import { toast } from 'sonner';

export const ProcessDetailsPage: React.FC = () => {
  const { processId } = useParams<{ processId: string }>();
  const [data, setData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!processId) return;

    api
      .get(`/customer/processes/${processId}/services`)
      .then((res) => {
        setData(res.data);
        if (res.data.complianceProjects?.length > 0) {
          const firstService = res.data.complianceProjects[0];
          fetchAnalytics(firstService.serviceId, res.data.process.customerId, processId);
        }
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load process details.'))
      .finally(() => setIsLoading(false));
  }, [processId]);

  const fetchAnalytics = async (serviceId: number, customerId: string, procId: string) => {
    try {
      const res = await api.post('/analytics/process-stats', {
        serviceId,
        customerId,
        processId: procId,
      });
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center text-slate-400">Loading process environment...</div>;
  }

  const attemptData = stats
    ? [
        { name: 'Attempted', value: stats.attempted, color: '#0e8ce9' },
        { name: 'Not Attempted', value: stats.notAttempted, color: '#4f46e5' },
      ]
    : [];

  const breakdownData = stats
    ? [
        { name: 'Assigned to QSA', value: stats.assignedToQsa, color: '#38bdf8' },
        { name: 'Assigned to QA', value: stats.assignedToQa, color: '#6366f1' },
        { name: 'Approved by QA', value: stats.approvedByQa, color: '#10b981' },
        { name: 'Disapproved by QSA', value: stats.disapprovedByQsa, color: '#f43f5e' },
        { name: 'Disapproved by QA', value: stats.disapprovedByQa, color: '#e11d48' },
        { name: 'Marked Incomplete', value: stats.markedIncomplete, color: '#f59e0b' },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
          <Link to="/customer/dashboard" className="hover:text-slate-900 transition">
            Processes
          </Link>
          <span>/</span>
          <span className="text-slate-600 font-bold">{data?.process?.processName}</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{data?.process?.processName}</h2>
        <p className="text-sm text-slate-500 font-medium">
          Assigned compliance frameworks, testing engagements, and live audit progress.
        </p>
      </div>

      {/* Analytics Donut Charts */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DonutChart title={`Question Attempt Ratio (Total: ${stats.totalQuestions})`} data={attemptData} />
          <DonutChart title={`Audit Assessment Status Breakdown (Attempted: ${stats.attempted})`} data={breakdownData} />
        </div>
      )}

      {/* Compliance Frameworks */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-slate-700" />
          <span>Assigned Compliance Standards</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.complianceProjects?.length === 0 ? (
            <div className="col-span-full bg-white p-6 rounded-2xl border border-slate-200 text-xs text-slate-400">
              No compliance frameworks assigned to this process.
            </div>
          ) : (
            data?.complianceProjects?.map((cp: any) => (
              <div
                key={cp._id}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-sky-400 shadow-2xs transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 bg-sky-50 text-sky-700 font-bold rounded-lg text-xs border border-sky-200">
                      {cp.serviceName}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {cp.startDate && cp.endDate ? `${cp.startDate} - ${cp.endDate}` : 'Active'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">QSA</span>
                      <p className="font-semibold text-slate-800 truncate">{cp.qsaId?.fullName || '—'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">QA</span>
                      <p className="font-semibold text-slate-800 truncate">{cp.qaId?.fullName || '—'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Consultant</span>
                      <p className="font-semibold text-slate-800 truncate">{cp.consultantId?.fullName || '—'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                  <Link
                    to={`/customer/evidence-audit?processId=${processId}&serviceId=${cp.serviceId}`}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5"
                  >
                    <span>Upload & Review Evidences</span>
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
