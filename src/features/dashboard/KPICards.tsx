import React, { useState, useEffect } from 'react';
import { dashboardService } from '@/services';
import { Icons } from '../../components/ui/Icons';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

interface KPI {
  title: string;
  value: number | string;
  icon: string;
  trend: number;
  isPositive: boolean;
  trendLabel: string;
}

export const KPICards: React.FC = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchKPIs();
  }, []);

  const fetchKPIs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getKPIs();
      setKpis(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load KPIs');
      console.error('Error fetching KPIs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 animate-pulse">
            <div className="h-24"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
        <p className="text-red-600 text-sm">Lỗi tải KPIs: {error}</p>
        <button
          onClick={fetchKPIs}
          className="mt-2 text-red-700 underline text-xs"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => {
        // Icon selection logic
        const IconComponent = kpi.icon === 'file' ? Icons.Contract
          : kpi.icon === 'files' ? Icons.Document
            : kpi.icon === 'dollar' ? Icons.Dollar
              : Icons.Report;

        const isMoney = kpi.title.includes('Doanh thu') || kpi.title.includes('Chi phí');
        const displayValue = isMoney ? formatCurrency(kpi.value as number) : kpi.value;
        const trendColor = kpi.isPositive ? 'text-emerald-600' : 'text-rose-600';
        const trendBg = kpi.isPositive ? 'bg-emerald-50' : 'bg-rose-50';
        const TrendIcon = kpi.trend >= 0 ? Icons.TrendingUp : Icons.TrendingDown;

        return (
          <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${index === 0 ? 'bg-blue-50 text-blue-600' : index === 1 ? 'bg-indigo-50 text-indigo-600' : index === 2 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                <IconComponent size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trendBg} ${trendColor}`}>
                <TrendIcon size={12} />
                <span>{Math.abs(kpi.trend)}%</span>
              </div>
            </div>

            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{kpi.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{displayValue}</h3>
              <p className="text-xs text-slate-400 mt-2">{kpi.trendLabel}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
