'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Users, UserCheck, UserX } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartsProps {
  stats: {
    total: number;
    present: number;
    absent: number;
    percentage: number;
  };
  lang: string;
}

export function DonutCharts({ stats, lang }: DonutChartsProps) {
  const girlsTotal = Math.round(stats.total / 2);
  const girlsPresent = Math.round(stats.present / 2);
  const girlsAbsent = Math.round(stats.absent / 2);

  const chartOptions = {
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            weight: '600' as const,
            family: 'Poppins',
          },
          color: '#4B5563',
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  const charts = [
    {
      title: 'Overall Attendance',
      subtitle: `${stats.total} total participants`,
      data: {
        labels: ['Present', 'Absent'],
        datasets: [{
          data: [stats.present, stats.absent],
          backgroundColor: ['#0B6B3A', '#CE1126'],
          borderWidth: 0,
          hoverOffset: 12,
        }],
      },
      centerText: `${stats.percentage}%`,
      centerSub: 'Attendance Rate',
      icon: UserCheck,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      color1: '#0B6B3A',
      color2: '#CE1126',
      label1: 'Present',
      label2: 'Absent',
      value1: stats.present,
      value2: stats.absent,
    },
    {
      title: 'Gender Distribution',
      subtitle: 'Boys vs Girls',
      data: {
        labels: ['Boys', 'Girls'],
        datasets: [{
          data: [stats.total - girlsTotal, girlsTotal],
          backgroundColor: ['#0B6B3A', '#CE1126'],
          borderWidth: 0,
          hoverOffset: 12,
        }],
      },
      centerText: stats.total,
      centerSub: 'Total Members',
      icon: Users,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      color1: '#0B6B3A',
      color2: '#CE1126',
      label1: 'Boys',
      label2: 'Girls',
      value1: stats.total - girlsTotal,
      value2: girlsTotal,
    },
    {
      title: 'Girls Attendance',
      subtitle: `${girlsTotal} female participants`,
      data: {
        labels: ['Present', 'Absent'],
        datasets: [{
          data: [girlsPresent, girlsAbsent],
          backgroundColor: ['#0B6B3A', '#CE1126'],
          borderWidth: 0,
          hoverOffset: 12,
        }],
      },
      centerText: girlsTotal,
      centerSub: 'Total Girls',
      icon: UserX,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      color1: '#0B6B3A',
      color2: '#CE1126',
      label1: 'Present',
      label2: 'Absent',
      value1: girlsPresent,
      value2: girlsAbsent,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {charts.map((chart, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-gray-800">{chart.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{chart.subtitle}</p>
            </div>
            <div className={`p-2.5 rounded-xl ${chart.iconBg} ${chart.iconColor} shadow-sm`}>
              <chart.icon size={18} />
            </div>
          </div>

          {/* Chart */}
          <div className="h-48 relative">
            <Doughnut data={chart.data}  />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-gray-800 tracking-tight">
                  {chart.centerText}
                </p>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {chart.centerSub}
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-8 mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2.5">
              <span 
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: chart.color1 }}
              />
              <span className="text-xs font-medium text-gray-600">
                {chart.label1} 
                <span className="text-gray-400 ml-1">({chart.value1})</span>
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span 
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: chart.color2 }}
              />
              <span className="text-xs font-medium text-gray-600">
                {chart.label2}
                <span className="text-gray-400 ml-1">({chart.value2})</span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
