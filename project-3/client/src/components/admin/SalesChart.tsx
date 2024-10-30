// client/src/components/admin/SalesChart.tsx
'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api  from '@/lib/api';

interface SalesChartProps {
  dateRange: string;
}

interface ChartData {
  date: string;
  sales: number;
  orders: number;
}

export default function SalesChart({ dateRange }: SalesChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await api.get(`/admin/sales-chart?range=${dateRange}`);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [dateRange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--panda-red)]"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-card h-96">
      <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="sales"
            stroke="var(--panda-red)"
            name="Sales ($)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            stroke="var(--panda-gold)"
            name="Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}