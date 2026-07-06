'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { Search, Users, UserPlus, Filter, X, CheckCircle, Edit2, Trash2, Mail, Phone } from 'lucide-react';
import { Modal } from '@/app/components/ui/Modal';
import { ParticipantForm } from '@/app/components/forms/ParticipantForm';
import { IParticipant } from '@/app/lib/db/models/Participant';
import { DASHBOARD_CONTENT } from '@/app/lib/constants';
import { toast } from 'sonner';

export default function GirlsPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams?.get('lang') || 'en';
  const t = DASHBOARD_CONTENT[lang as keyof typeof DASHBOARD_CONTENT] || DASHBOARD_CONTENT.en;

  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<IParticipant | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    fetchParticipants();
  }, [isAuthenticated, router]);

  const fetchParticipants = async () => {
    try {
      const response = await fetch('/api/participants');
      const data = await response.json();
      const girls = data.filter((p: IParticipant) => p.gender === 'Girl');
      setParticipants(girls);
    } catch (error) {
      toast.error('Failed to fetch participants');
    } finally {
      setLoading(false);
    }
  };

  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return participants;
    const query = searchQuery.toLowerCase().trim();
    return participants.filter((p) =>
      p.fullName?.toLowerCase().includes(query) ||
      p.matricule?.toLowerCase().includes(query) ||
      p.phone?.includes(query) ||
      p.email?.toLowerCase().includes(query) ||
      p.university?.toLowerCase().includes(query) ||
      p.clubName?.toLowerCase().includes(query)
    );
  }, [participants, searchQuery]);

  const handleValidate = async (participant: IParticipant) => {
    if (participant.status === 'Present') {
      toast.info(t.alreadyPresent || 'Already present');
      return;
    }

    try {
      const response = await fetch('/api/participants/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: participant._id }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t.validateSuccess || 'Attendance validated!');
        await fetchParticipants();
      } else {
        toast.error(data.error || t.validateError || 'Failed to validate');
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error(t.validateError || 'Failed to validate attendance');
    }
  };

  const handleDelete = async (participant: IParticipant) => {
    if (!confirm(t.deleteConfirm)) return;
    try {
      const response = await fetch(`/api/participants/${participant._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success(t.deleteSuccess);
        fetchParticipants();
      } else {
        toast.error(t.deleteError);
      }
    } catch (error) {
      toast.error(t.deleteError);
    }
  };

  const handleEdit = (participant: IParticipant) => {
    setEditingParticipant(participant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingParticipant(null);
  };

  const handleSuccess = () => {
    handleCloseModal();
    fetchParticipants();
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const isPresent = status === 'Present';
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
          isPresent ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${isPresent ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        {isPresent ? t.presentStatus : t.notPresent}
      </span>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Users size={28} className="text-[#CE1126]" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t.girls}</h1>
              <p className="text-sm text-slate-500">{t.manageFemale}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-br from-[#efc8cc] to-[#dfb9bc] px-6 py-3 text-sm font-semibold text-red-900 shadow-lg shadow-[#CE1126]/10 transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <UserPlus size={18} />
          {t.addMember}
        </button>
      </div>

      {/* ===== SEARCH & FILTER ===== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900" />
          <input
            type="text"
            placeholder={t.searchPlaceholder || 'Search participants...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 py-3 pl-12 pr-12 text-sm shadow-sm backdrop-blur-sm transition-all focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-600 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-50">
            <Filter size={16} />
            {t.filter || 'Filter'}
          </button>
          <span className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-600">
            {filteredParticipants.length} {t.members || 'members'}
          </span>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{t.name || 'Name'}</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{t.university || 'University'}</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{t.phone || 'Phone'}</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{t.email || 'Email'}</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{t.axis || 'Axis'}</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{t.status || 'Status'}</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{t.actions || 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParticipants.map((participant) => (
                <tr key={participant._id} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#dfb9bc] to-[#dfb9bc] text-sm font-semibold text-red-900 shadow-md shadow-rose-500/15">
                        {participant.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{participant.fullName}</p>
                        <p className="text-xs text-slate-400">{participant.matricule}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{participant.university || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Phone size={13} className="text-slate-400" />
                      {participant.phone || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Mail size={13} className="text-slate-400" />
                      {participant.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700 shadow-sm">
                      {participant.axis || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={participant.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {participant.status === 'Not Present' && (
                        <button
                          onClick={() => handleValidate(participant)}
                          className="rounded-xl p-2 text-emerald-600 transition-colors hover:bg-emerald-100"
                          title="Validate attendance"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(participant)}
                        className="rounded-xl p-2 text-sky-600 transition-colors hover:bg-sky-100"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(participant)}
                        className="rounded-xl p-2 text-rose-600 transition-colors hover:bg-rose-100"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5">
          <span className="text-xs text-slate-500">
            {t.showing || 'Showing'} {Math.min(filteredParticipants.length, 5)} {t.of || 'of'} {filteredParticipants.length} {t.participants || 'participants'}
          </span>
          <div className="flex items-center gap-2">
            <button className="rounded-xl px-3 py-1.5 text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
              {t.previous || 'Previous'}
            </button>
            <button className="rounded-xl bg-gradient-to-br from-green-100 to-green-100 px-3 py-1.5 text-xs font-medium text-green-900 shadow-md shadow-emerald-500/30">
              1
            </button>
            <button className="rounded-xl px-3 py-1.5 text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
              {t.next || 'Next'}
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingParticipant ? t.editTitle || 'Edit Member' : t.addTitle || 'Add New Member'}
        subtitle={editingParticipant ? t.editSubtitle || 'Update participant information' : t.addSubtitle || 'Fill in the details to add a new participant'}
        icon={<UserPlus size={18} />}
      >
        <ParticipantForm
          gender="Girl"
          lang={lang}
          onSuccess={handleSuccess}
          onCancel={handleCloseModal}
          initialData={editingParticipant || undefined}
        />
      </Modal>
    </div>
  );
}