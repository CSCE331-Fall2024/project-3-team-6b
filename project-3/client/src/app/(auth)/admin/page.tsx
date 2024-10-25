// client/src/app/(auth)/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/admin/Dashboard';
import SalesChart from '@/components/admin/SalesChart';
import { api } from '@/lib/api';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  popularItems: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('today'); // today, week, month

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(`/admin/stats?range=${dateRange}`);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [dateRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--panda-red)]"></div>
        </div>
      ) : stats ? (
        <>
          <Dashboard stats={stats} />
          <div className="mt-8">
            <SalesChart dateRange={dateRange} />
          </div>
        </>
      ) : (
        <p>Failed to load dashboard data.</p>
      )}
    </div>
  );
}
