import React, { useEffect, useState } from 'react';
import { Archive, Calendar, Building2 } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'sonner';

export const ArchivedProcesses: React.FC = () => {
  const [archives, setArchives] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/archived-processes')
      .then((res) => setArchives(res.data.archives))
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Archived Audit Processes</h2>
        <p className="text-sm text-slate-500 font-medium">
          Historical registry of completed and archived compliance audits and assessment scopes.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Archived Process Name</th>
                <th className="py-3.5 px-4">Customer Organization</th>
                <th className="py-3.5 px-4">Archived Timestamp</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">
                    Loading archived records...
                  </td>
                </tr>
              ) : archives.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">
                    No archived processes found.
                  </td>
                </tr>
              ) : (
                archives.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <Archive className="w-4 h-4 text-slate-500" />
                        <span className="font-bold text-slate-900">{a.processId?.processName || 'Archived Process'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5 text-slate-700">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {a.processId?.customerId?.companyName || a.processId?.customerId?.fullName || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {new Date(a.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Archived
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
