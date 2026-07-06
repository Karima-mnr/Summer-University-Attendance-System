'use client';

import { ColumnDef } from '@tanstack/react-table';
import { IParticipant } from '@/app/lib/db/models/Participant';
import { Edit2, Trash2, CheckCircle, User, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { DASHBOARD_CONTENT } from '@/app/lib/constants';

interface ColumnsProps {
  lang: string;
  onEdit: (participant: IParticipant) => void;
  onRefresh: () => void;
}

export const columns = ({ lang, onEdit, onRefresh }: ColumnsProps): ColumnDef<IParticipant>[] => {
  const t = DASHBOARD_CONTENT[lang as keyof typeof DASHBOARD_CONTENT] || DASHBOARD_CONTENT.en;

  return [
    {
      accessorKey: 'fullName',
      header: () => <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{t.name}</span>,
      cell: ({ row }) => {
        const name = row.getValue('fullName') as string;
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-semibold text-white shadow-md shadow-emerald-500/30">
              {name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{name}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <User size={10} />
                {row.getValue('matricule') || 'N/A'}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'university',
      header: () => <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{t.university}</span>,
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">{row.getValue('university') || 'N/A'}</span>
      ),
    },
    {
      accessorKey: 'phone',
      header: () => <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{t.phone}</span>,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Phone size={13} className="text-slate-400" />
          {row.getValue('phone') || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: () => <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{t.email}</span>,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Mail size={13} className="text-slate-400" />
          {row.getValue('email') || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'axis',
      header: () => <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{t.axis}</span>,
      cell: ({ row }) => (
        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700 shadow-sm">
          {row.getValue('axis') || 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'clubName',
      header: () => <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{t.club}</span>,
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">{row.getValue('clubName') || 'N/A'}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: () => <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{t.status}</span>,
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const isPresent = status === 'Present';
        return (
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
            isPresent ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isPresent ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {isPresent ? t.presentStatus : t.notPresent}
          </span>
        );
      },
    },
    {
      accessorKey: 'attendanceTime',
      header: () => <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{t.attendanceTime}</span>,
      cell: ({ row }) => {
        const time = row.getValue('attendanceTime') as Date;
        return time ? (
          <span className="text-sm text-slate-500">
            {new Date(time).toLocaleString()}
          </span>
        ) : (
          <span className="text-sm text-slate-300">—</span>
        );
      },
    },
    {
      id: 'actions',
      header: () => <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{t.actions}</span>,
      cell: ({ row }) => {
        const participant = row.original;

        const handleValidate = async () => {
          if (participant.status === 'Present') {
            toast.info(t.alreadyPresent);
            return;
          }

          try {
            const response = await fetch('/api/participants/validate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: participant._id }),
            });

            if (response.ok) {
              toast.success(t.validateSuccess);
              onRefresh();
            } else {
              const data = await response.json();
              toast.error(data.error || t.validateError);
            }
          } catch (error) {
            toast.error(t.validateError);
          }
        };

        const handleDelete = async () => {
          if (!confirm(t.deleteConfirm)) return;

          try {
            const response = await fetch(`/api/participants/${participant._id}`, {
              method: 'DELETE',
            });

            if (response.ok) {
              toast.success(t.deleteSuccess);
              onRefresh();
            } else {
              toast.error(t.deleteError);
            }
          } catch (error) {
            toast.error(t.deleteError);
          }
        };

        return (
          <div className="flex items-center gap-1.5">
            {participant.status === 'Not Present' && (
              <button
                onClick={handleValidate}
                className="rounded-xl p-2 text-emerald-600 transition-colors hover:bg-emerald-100"
                title={t.validateSuccess}
              >
                <CheckCircle size={16} />
              </button>
            )}
            <button
              onClick={() => onEdit(participant)}
              className="rounded-xl p-2 text-sky-600 transition-colors hover:bg-sky-100"
              title={t.editTitle}
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="rounded-xl p-2 text-rose-600 transition-colors hover:bg-rose-100"
              title={t.delete}
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
    },
  ];
};