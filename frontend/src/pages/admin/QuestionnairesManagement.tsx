import React, { useEffect, useState } from 'react';
import { FileCheck2, Check, X, Edit, Save, Plus } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'sonner';

export const QuestionnairesManagement: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number>(1);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Bulk selection & Edit
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Add Question State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newServiceId, setNewServiceId] = useState<number>(1);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newStatus, setNewStatus] = useState<'1' | '2'>('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await api.get('/admin/compliance-services');
      if (res.data.success) {
        setServices(res.data.services);
      }
    } catch {
      toast.error('Failed to load services.');
    }
  };

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/admin/questionnaires?serviceId=${selectedServiceId}`);
      if (res.data.success) {
        setQuestions(res.data.questionnaires);
        setSelectedIds([]);
      }
    } catch {
      toast.error('Failed to load questionnaires.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [selectedServiceId]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(questions.map((q) => q._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleBulkStatus = async (status: '1' | '2') => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one question.');
      return;
    }

    try {
      const res = await api.put('/admin/questionnaires/bulk-status', {
        ids: selectedIds,
        status,
      });
      if (res.data.success) {
        toast.success(`Updated status for ${selectedIds.length} questions.`);
        fetchQuestions();
      }
    } catch {
      toast.error('Failed to update question status.');
    }
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await api.put(`/admin/questionnaires/${id}`, { question: editText });
      if (res.data.success) {
        toast.success('Question text updated.');
        setEditingId(null);
        fetchQuestions();
      }
    } catch {
      toast.error('Failed to update question.');
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) {
      toast.error('Please enter the question/requirement text.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/admin/questionnaires', {
        serviceId: newServiceId,
        question: newQuestionText.trim(),
        status: newStatus,
      });

      if (res.data.success) {
        toast.success(res.data.message || 'New control question added.');
        setCreateModalOpen(false);
        setNewQuestionText('');
        if (newServiceId !== selectedServiceId) {
          setSelectedServiceId(newServiceId);
        } else {
          fetchQuestions();
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add question.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Questionnaire Controls & Checklist</h2>
          <p className="text-sm text-slate-500 font-medium">
            Manage audit requirements, bulk activation/deactivation, and control questions per standard.
          </p>
        </div>
        <button
          onClick={() => {
            setNewServiceId(selectedServiceId);
            setNewQuestionText('');
            setNewStatus('1');
            setCreateModalOpen(true);
          }}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 shrink-0"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add New Question</span>
        </button>
      </div>

      {/* Service Selector & Bulk Actions Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Compliance Framework:</label>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(Number(e.target.value))}
            className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-sky-500"
          >
            {services.map((s) => (
              <option key={s._id} value={s.legacyId}>
                {s.serviceName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 mr-1">({selectedIds.length} selected)</span>
          <button
            onClick={() => handleBulkStatus('1')}
            disabled={selectedIds.length === 0}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition shadow-xs disabled:opacity-40 flex items-center space-x-1.5"
          >
            <Check className="w-3.5 h-3.5 text-white" />
            <span>Activate Selected</span>
          </button>
          <button
            onClick={() => handleBulkStatus('2')}
            disabled={selectedIds.length === 0}
            className="px-3.5 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-semibold rounded-xl transition disabled:opacity-40 flex items-center space-x-1.5"
          >
            <X className="w-3.5 h-3.5 text-current" />
            <span>Deactivate Selected</span>
          </button>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={selectedIds.length === questions.length && questions.length > 0}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                </th>
                <th className="py-3 px-4 w-16"># ID</th>
                <th className="py-3 px-4">Audit Requirement / Control Question</th>
                <th className="py-3 px-4 w-28">Status</th>
                <th className="py-3 px-4 w-20 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    Loading questions...
                  </td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    No questions found for this service standard.
                  </td>
                </tr>
              ) : (
                questions.map((q, idx) => (
                  <tr key={q._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(q._id)}
                        onChange={(e) => handleSelectOne(q._id, e.target.checked)}
                        className="rounded text-slate-900 focus:ring-slate-900"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === q._id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900"
                          />
                          <button
                            onClick={() => handleSaveEdit(q._id)}
                            className="p-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                          >
                            <Save className="w-3.5 h-3.5 text-current" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-800 leading-relaxed font-medium">{q.question}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          q.status === '1'
                            ? 'bg-slate-100 text-slate-800 border-slate-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}
                      >
                        {q.status === '1' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditingId(q._id);
                          setEditText(q.question);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-900 rounded transition"
                      >
                        <Edit className="w-4 h-4 text-current" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Question Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Add Control Question</h3>
              </div>
              <button onClick={() => !isSubmitting && setCreateModalOpen(false)} disabled={isSubmitting}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Compliance Framework</label>
                <select
                  value={newServiceId}
                  onChange={(e) => setNewServiceId(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                >
                  {services.map((s) => (
                    <option key={s._id} value={s.legacyId}>
                      {s.serviceName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Audit Requirement / Control Question
                </label>
                <textarea
                  rows={4}
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Enter the full requirement or control description for the standard..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 leading-relaxed font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Initial Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as '1' | '2')}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                >
                  <option value="1">Active</option>
                  <option value="2">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-xs transition flex items-center space-x-1.5"
                >
                  {isSubmitting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Question</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
