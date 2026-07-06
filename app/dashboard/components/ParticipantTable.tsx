'use client';

import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { IParticipant } from '@/app/lib/db/models/Participant';
import { columns } from './columns';
import { DASHBOARD_CONTENT } from '@/app/lib/constants';
import { Users, UserPlus, Search } from 'lucide-react';

interface ParticipantTableProps {
  participants: IParticipant[];
  loading: boolean;
  lang: string;
  onEdit: (participant: IParticipant) => void;
  onRefresh: () => void;
}

export function ParticipantTable({ 
  participants, 
  loading, 
  lang,
  onEdit,
  onRefresh 
}: ParticipantTableProps) {
  const t = DASHBOARD_CONTENT[lang as keyof typeof DASHBOARD_CONTENT] || DASHBOARD_CONTENT.en;
  
  const table = useReactTable({
    data: participants,
    columns: columns({ lang, onEdit, onRefresh }),
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-100 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
              </div>
              <div className="h-8 w-20 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
        <div className="flex flex-col items-center max-w-sm mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-[#0B6B3A]/10 to-[#0B6B3A]/5 rounded-2xl flex items-center justify-center mb-5">
            <Users size={36} className="text-[#0B6B3A]/40" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t.noParticipants}</h3>
          <p className="text-gray-500 text-sm">{t.addFirstParticipant}</p>
          <button className="mt-6 px-6 py-2.5 bg-[#0B6B3A] text-white rounded-xl font-semibold hover:bg-[#0B6B3A]/90 transition-colors flex items-center gap-2">
            <UserPlus size={16} />
            Add Your First Participant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0B6B3A]/10 rounded-lg">
            <Users size={18} className="text-[#0B6B3A]" />
          </div>
          <span className="font-semibold text-gray-900">All Participants</span>
          <span className="text-xs bg-gray-200 text-gray-700 px-2.5 py-0.5 rounded-full font-medium">
            {participants.length}
          </span>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search participants..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B3A]/20 focus:border-[#0B6B3A] transition-all w-48"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50/50 border-b border-gray-100">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50/50 transition-colors duration-150 group"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-sm text-gray-700"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/30">
        <span className="text-xs text-gray-500">
          Showing {participants.length} participants
        </span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 text-xs bg-[#0B6B3A] text-white rounded-lg">
            1
          </button>
          <button className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}