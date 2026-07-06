'use client';

import { Users, UserCheck, UserX, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { DASHBOARD_CONTENT } from '@/app/lib/constants';

interface StatsCardsProps {
  stats: {
    total: number;
    present: number;
    absent: number;
    percentage: number;
  };
  lang: string;
}

export function StatsCards({ stats, lang }: StatsCardsProps) {
  const t = DASHBOARD_CONTENT[lang as keyof typeof DASHBOARD_CONTENT] || DASHBOARD_CONTENT.en;

  const cards = [
    {
      label: t.totalParticipants,
      value: stats.total,
      icon: Users,
      iconClass: 'blue',
      change: '+12%',
    },
    {
      label: t.present,
      value: stats.present,
      icon: UserCheck,
      iconClass: 'green',
      change: '+8%',
    },
    {
      label: t.absent,
      value: stats.absent,
      icon: UserX,
      iconClass: 'red',
      change: '-3%',
    },
    {
      label: t.attendanceRate,
      value: `${stats.percentage}%`,
      icon: TrendingUp,
      iconClass: 'orange',
      change: stats.percentage > 70 ? '+5%' : '-2%',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, i) => (
        <div key={i} className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-label ">{card.label}</p>
              <p className="stat-value">{card.value}</p>
              <div className="flex items-center gap-1 mt-2">
                {card.change.startsWith('+') ? (
                  <ArrowUpRight size={14} className="text-[#0B6B3A]" />
                ) : (
                  <ArrowDownRight size={14} className="text-[#CE1126]" />
                )}
                <span className={card.change.startsWith('+') ? 'text-[#0B6B3A]' : 'text-[#CE1126]'} style={{ fontSize: '12px', fontWeight: 600 }}>
                  {card.change}
                </span>
                <span className="text-xs text-gray-400">vs last week</span>
              </div>
            </div>
            <div className={`stat-icon ${card.iconClass}`}>
              <card.icon size={22} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
