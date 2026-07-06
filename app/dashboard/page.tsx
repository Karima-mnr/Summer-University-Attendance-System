'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { IParticipant } from '@/app/lib/db/models/Participant';
import { DASHBOARD_CONTENT, AXIS_GROUP_MAP, AXIS_DISPLAY_NAMES } from '@/app/lib/constants';
import { toast } from 'sonner';
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  Search,
  Mail,
  Phone,
  ArrowRight,
  FileSpreadsheet,
  UserPlus,
} from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import * as XLSX from 'xlsx';

ChartJS.register(ArcElement, Tooltip, Legend);


interface StatsData {
  total: number;
  present: number;
  absent: number;
  percentage: number;
  boys: number;
  girls: number;
}


function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="absolute -right-16 top-40 h-80 w-80 rounded-full bg-amber-300/25 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-rose-200/25 blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50/60 to-slate-100" />
    </div>
  );
}

interface StatCardConfig {
  label: string;
  value: number | string;
  icon: any;
  gradient: string;
  change: string;
  up: boolean;
}

function StatsCards({ stats, lang }: { stats: StatsData; lang: string }) {
  const t = DASHBOARD_CONTENT[lang as keyof typeof DASHBOARD_CONTENT] || DASHBOARD_CONTENT.en;

  const cards: StatCardConfig[] = [
    {
      label: t.totalParticipants,
      value: stats.total,
      icon: Users,
      gradient: 'from-slate-600 to-slate-800',
      change: '+12%',
      up: true,
    },
    {
      label: t.present,
      value: stats.present,
      icon: UserCheck,
      gradient: 'from-emerald-400 to-emerald-600',
      change: '+8%',
      up: true,
    },
    {
      label: t.absent,
      value: stats.absent,
      icon: UserX,
      gradient: 'from-rose-400 to-rose-600',
      change: '-3%',
      up: false,
    },
    {
      label: t.attendanceRate,
      value: `${stats.percentage}%`,
      icon: TrendingUp,
      gradient: 'from-amber-400 to-amber-600',
      change: stats.percentage > 70 ? '+5%' : '-2%',
      up: stats.percentage > 70,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
        >
          <div
            className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20`}
          />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{card.value}</p>
              <div className="mt-2.5 flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    card.up ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {card.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {card.change}
                </span>
                <span className="text-xs text-slate-400">{t.vsLastWeek}</span>
              </div>
            </div>
            <card.icon
              size={24}
              className={`text-slate-700 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}


interface ChartConfig {
  title: string;
  subtitle: string;
  data: {
    labels: string[];
    datasets: { data: number[]; backgroundColor: string[]; borderWidth: number; hoverOffset: number }[];
  };
  centerText: string | number;
  centerSub: string;
  icon: any;
  gradient: string;
  glowColor: string;
  legend: { color: string; label: string; value: number }[];
}

function DonutCharts({ stats, participants, lang }: { stats: StatsData; participants: IParticipant[]; lang: string }) {
  const t = DASHBOARD_CONTENT[lang as keyof typeof DASHBOARD_CONTENT] || DASHBOARD_CONTENT.en;

  const boysTotal = participants.filter((p) => p.gender === 'Boy').length;
  const girlsTotal = participants.filter((p) => p.gender === 'Girl').length;

 
  const axisGroups: { [key: string]: number } = {};
  participants.forEach((p) => {
    const axis = p.axis || 'N/A';
    const groupKey = AXIS_GROUP_MAP[axis as keyof typeof AXIS_GROUP_MAP] || axis;
    axisGroups[groupKey] = (axisGroups[groupKey] || 0) + 1;
  });

  const displayNames = AXIS_DISPLAY_NAMES[lang as keyof typeof AXIS_DISPLAY_NAMES] || AXIS_DISPLAY_NAMES.en;

  const axisLabels: string[] = [];
  const axisValues: number[] = [];

  Object.keys(axisGroups).forEach((key) => {
    const label = displayNames[key as keyof typeof displayNames] || key;
    axisLabels.push(label);
    axisValues.push(axisGroups[key]);
  });

  const sortedData = axisLabels.map((label, index) => ({
    label,
    value: axisValues[index],
  })).sort((a, b) => b.value - a.value);

  const sortedLabels = sortedData.map((item) => item.label);
  const sortedValues = sortedData.map((item) => item.value);

  const axisColors = [
    '#0B6B3A', '#CE1126', '#F2891D', '#3B82F6', '#8B5CF6', 
    '#EC4899', '#14B8A6', '#F59E0B', '#6366F1', '#EF4444'
  ];

  const chartOptions = {
    cutout: '76%',
    maintainAspectRatio: false,
    responsive: true,
    plugins: { legend: { display: false } },
  };

  const charts: ChartConfig[] = [
    {
      title: t.attendanceRateLabel || 'Overall attendance',
      subtitle: `${stats.total} ${t.totalParticipants?.toLowerCase() || 'participants'}`,
      data: {
        labels: [t.presentStatus || 'Present', t.notPresent || 'Absent'],
        datasets: [{ data: [stats.present, stats.absent], backgroundColor: ['#10B981', '#F43F5E'], borderWidth: 0, hoverOffset: 10 }],
      },
      centerText: `${stats.percentage}%`,
      centerSub: t.attendanceRateLabel || 'Attendance rate',
      icon: UserCheck,
      gradient: 'from-emerald-400 to-emerald-600',
      glowColor: 'bg-emerald-400/20',
      legend: [
        { color: '#10B981', label: t.presentStatus || 'Present', value: stats.present },
        { color: '#F43F5E', label: t.notPresent || 'Absent', value: stats.absent },
      ],
    },
    {
      title: t.genderDistribution || 'Gender distribution',
      subtitle: `${boysTotal} ${t.boys} - ${girlsTotal} ${t.girls}`,
      data: {
        labels: [t.boys || 'Boys', t.girls || 'Girls'],
        datasets: [{ data: [boysTotal, girlsTotal], backgroundColor: ['#0B6B3A', '#CE1126'], borderWidth: 0, hoverOffset: 10 }],
      },
      centerText: stats.total,
      centerSub: t.totalMembers || 'Total members',
      icon: Users,
      gradient: 'from-amber-400 to-amber-600',
      glowColor: 'bg-amber-400/20',
      legend: [
        { color: '#0B6B3A', label: t.boys || 'Boys', value: boysTotal },
        { color: '#CE1126', label: t.girls || 'Girls', value: girlsTotal },
      ],
    },
    {
      title: t.competitionAxis || 'Competition Axis',
      subtitle: `${sortedLabels.length} ${t.axis?.toLowerCase() || 'axes'}`,
      data: {
        labels: sortedLabels,
        datasets: [{ data: sortedValues, backgroundColor: axisColors.slice(0, sortedLabels.length), borderWidth: 0, hoverOffset: 10 }],
      },
      centerText: stats.total,
      centerSub: t.totalParticipants || 'Total participants',
      icon: TrendingUp,
      gradient: 'from-purple-400 to-purple-600',
      glowColor: 'bg-purple-400/20',
      legend: sortedData.map((item, i) => ({
        color: axisColors[i % axisColors.length],
        label: item.label,
        value: item.value,
      })),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {charts.map((chart, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{chart.title}</h3>
              <p className="mt-0.5 text-xs text-slate-500">{chart.subtitle}</p>
            </div>
            <chart.icon
              size={20}
              className={`text-slate-700 transition-transform duration-300 group-hover:scale-110`}
            />
          </div>

          <div className="relative flex h-44 items-center justify-center">
            <div className={`absolute h-36 w-36 rounded-full ${chart.glowColor} blur-2xl`} />
            <div className="relative h-full w-full">
              <Doughnut data={chart.data} options={chartOptions} />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold tracking-tight text-slate-900">{chart.centerText}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    {chart.centerSub}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-4 border-t border-slate-100 pt-4">
            {chart.legend.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium text-slate-600">
                  {item.label} <span className="text-slate-400">({item.value})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ParticipantTableProps {
  participants: IParticipant[];
  loading: boolean;
  lang: string;
  onRefresh: () => void;
}

function StatusBadge({ status, lang }: { status: string; lang: string }) {
  const t = DASHBOARD_CONTENT[lang as keyof typeof DASHBOARD_CONTENT] || DASHBOARD_CONTENT.en;
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
}

function ParticipantTable({ participants, loading, lang, onRefresh }: ParticipantTableProps) {
  const t = DASHBOARD_CONTENT[lang as keyof typeof DASHBOARD_CONTENT] || DASHBOARD_CONTENT.en;
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(
    () =>
      participants.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.fullName?.toLowerCase().includes(q) ||
          p.matricule?.toLowerCase().includes(q) ||
          p.phone?.includes(searchQuery) ||
          p.email?.toLowerCase().includes(q)
        );
      }),
    [participants, searchQuery]
  );

  if (loading) {
    return (
      <div className="space-y-4 rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200/70" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200/70" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200/70" />
            </div>
            <div className="h-8 w-20 animate-pulse rounded-full bg-slate-200/70" />
            <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200/70" />
          </div>
        ))}
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="rounded-3xl border border-white/60 bg-white/70 p-16 text-center shadow-xl shadow-slate-200/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-sm flex-col items-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
            <Users size={34} className="text-white" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-slate-900">{t.startFirstRoster}</h3>
          <p className="text-sm text-slate-500">{t.addParticipantToStart}</p>
          <button className="mt-6 flex items-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl">
            <UserPlus size={16} />
            {t.addParticipant}
          </button>
        </div>
      </div>
    );
  }

  const tableHeaders = [t.name, t.university, t.phone, t.email, t.axis, t.status];

  return (
    <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Users size={17} className="text-green-900" />
          <span className="font-semibold text-slate-900">{t.recentParticipants}</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {filtered.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder || 'Search participants...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 rounded-2xl border border-slate-200 bg-white/80 py-2.5 pl-10 pr-4 text-sm shadow-sm backdrop-blur-sm transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 sm:w-56"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              {tableHeaders.map((h) => (
                <th
                  key={h}
                  className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.slice(0, 5).map((participant) => (
              <tr key={String(participant._id)} className="transition-colors hover:bg-slate-50/70">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-100 text-sm font-semibold text-green-900 shadow-md shadow-emerald-500/15">
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
                  <StatusBadge status={participant.status} lang={lang} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5">
        <span className="text-xs text-slate-500">
          {t.showing} {Math.min(filtered.length, 5)} {t.of} {filtered.length} {t.participants}
        </span>
        <div className="flex items-center gap-2">
          <button className="rounded-xl px-3 py-1.5 text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
            {t.previous}
          </button>
          <button className="rounded-xl bg-gradient-to-br from-green-100 to-green-100 px-3 py-1.5 text-xs font-medium text-green-900 shadow-md shadow-emerald-500/30">
            1
          </button>
          <button className="rounded-xl px-3 py-1.5 text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
            {t.next}
          </button>
        </div>
      </div>
    </div>
  );
}


export default function DashboardPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams?.get('lang') || 'en';
  const t = DASHBOARD_CONTENT[lang as keyof typeof DASHBOARD_CONTENT] || DASHBOARD_CONTENT.en;

  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({ 
    total: 0, 
    present: 0, 
    absent: 0, 
    percentage: 0,
    boys: 0,
    girls: 0
  });

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
      const data: IParticipant[] = await response.json();
      setParticipants(data);
      
      const present = data.filter((p) => p.status === 'Present').length;
      const total = data.length;
      const boys = data.filter((p) => p.gender === 'Boy').length;
      const girls = data.filter((p) => p.gender === 'Girl').length;
      
      setStats({
        total,
        present,
        absent: total - present,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0,
        boys,
        girls,
      });
    } catch {
      toast.error('Failed to fetch participants');
    } finally {
      setLoading(false);
    }
  };
  const exportToExcel = () => {
    if (participants.length === 0) {
      toast.warning('No participants to export');
      return;
    }

    try {
      const excelData = participants.map((p) => ({
        'Full Name': p.fullName || 'N/A',
        'University': p.university || 'N/A',
        'Matricule': p.matricule || 'N/A',
        'Phone': p.phone || 'N/A',
        'Email': p.email || 'N/A',
        'Axis': p.axis || 'N/A',
        'Club': p.clubName || 'N/A',
        'Attribute': p.attribute || 'N/A',
        'Gender': p.gender || 'N/A',
        'Status': p.status || 'Not Present',
        'Attendance Time': p.attendanceTime ? new Date(p.attendanceTime).toLocaleString() : 'N/A',
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      ws['!cols'] = [
        { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, 
        { wch: 30 }, { wch: 35 }, { wch: 25 }, { wch: 25 }, 
        { wch: 12 }, { wch: 15 }, { wch: 25 }
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Participants');
      
      const fileName = `participants_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success(`✅ Exported ${participants.length} participants to Excel!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export to Excel');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <AmbientBackground />
      <div className="relative space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t.overview}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar size={14} />
                {new Date().toLocaleDateString(lang === 'ar' ? 'ar' : lang === 'fr' ? 'fr' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Clock size={14} />
                {new Date().toLocaleTimeString(lang === 'ar' ? 'ar' : lang === 'fr' ? 'fr' : 'en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-br from-green-100 to-green-100 px-5 py-2.5 text-sm font-semibold text-green-900 shadow-lg shadow-green-500/10 transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <FileSpreadsheet size={18} />
              Export Excel
            </button>
            <div className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_2px_rgba(16,185,129,0.5)]" />
              {t.live}
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-slate-700" />
              {stats.total} {t.total}
            </div>
          </div>
        </div>

        <StatsCards stats={stats} lang={lang} />
        <DonutCharts stats={stats} participants={participants} lang={lang} />

        <div>
          <div className="mb-4 flex items-center justify-between px-1">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t.recentParticipants}</h2>
              <p className="text-sm text-slate-500">{t.latestMembers}</p>
            </div>
            <button className="group flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800">
              {t.viewAll}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <ParticipantTable 
            participants={participants} 
            loading={loading} 
            lang={lang}
            onRefresh={fetchParticipants} 
          />
        </div>
      </div>
    </>
  );
}
